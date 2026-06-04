const express = require("express");
const router = express.Router();
const db = require("../db");
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
     SELECT b.id, b.booked_by, b.date, b.time_slot, b.created_at,
r.id as room_id, r.name as room_name, r.location as room_location
     FROM bookings b
     LEFT JOIN rooms r ON b.room_id = r.id
     ORDER BY b.id DESC
   `);
    const bookings = result.rows.map((row) => ({
      id: row.id.toString(),
      bookedBy: row.booked_by,
      date: row.date,
      timeSlot: row.time_slot,
      roomId: {
        id: row.room_id?.toString(),
        name: row.room_name,
        location: row.room_location,
      },
    }));
    res.json(bookings);
  } catch (err) {
    console.error("Bookings error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { roomId, bookedBy, date, timeSlot } = req.body;
    const duplicate = await db.query(
      "SELECT id FROM bookings WHERE room_id = $1 AND date = $2 AND time_slot = $3",
      [roomId, date, timeSlot],
    );
    if (duplicate.rows.length > 0) {
      return res.status(400).json({ message: "This slot is already booked" });
    }
    const result = await db.query(
      "INSERT INTO bookings (room_id, booked_by, date, time_slot) VALUES ($1, $2, $3, $4) RETURNING *",
      [roomId, bookedBy, date, timeSlot],
    );
    res.status(201).json({ id: result.rows[0].id.toString() });
  } catch (err) {
    console.error("Create booking error:", err.message);
    res.status(400).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Delete booking error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
