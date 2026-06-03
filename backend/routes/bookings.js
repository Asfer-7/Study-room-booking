const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "../data.json");
const readData = () => JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
router.get("/", (req, res) => {
  const data = readData();
  const bookingsWithRooms = data.bookings.map((booking) => {
    const room = data.rooms.find((r) => r.id === booking.roomId);
    return { ...booking, roomId: room || null };
  });
  res.json(bookingsWithRooms);
});
router.post("/", (req, res) => {
  const data = readData();
  const { roomId, bookedBy, date, timeSlot } = req.body;
  const duplicate = data.bookings.find(
    (b) => b.roomId === roomId && b.date === date && b.timeSlot === timeSlot,
  );
  if (duplicate) {
    return res.status(400).json({ message: "This slot is already booked" });
  }
  const newBooking = {
    id: Date.now().toString(),
    roomId,
    bookedBy,
    date,
    timeSlot,
    createdAt: new Date().toISOString(),
  };
  data.bookings.push(newBooking);
  writeData(data);
  res.status(201).json(newBooking);
});
router.delete("/:id", (req, res) => {
  const data = readData();
  data.bookings = data.bookings.filter((b) => b.id !== req.params.id);
  writeData(data);
  res.json({ message: "Booking cancelled successfully" });
});
module.exports = router;
