const express = require("express");
const router = express.Router();
const db = require("../db");
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM rooms ORDER BY id ASC");
    const rooms = result.rows.map((r) => ({
      id: r.id.toString(),
      name: r.name,
      capacity: r.capacity,
      location: r.location,
      isAvailable: r.is_available,
    }));
    res.json(rooms);
  } catch (err) {
    console.error("Rooms error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { name, capacity, location, isAvailable } = req.body;
    const result = await db.query(
      "INSERT INTO rooms (name, capacity, location, is_available) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, capacity, location, isAvailable ?? true],
    );
    const r = result.rows[0];
    res.status(201).json({
      id: r.id.toString(),
      name: r.name,
      capacity: r.capacity,
      location: r.location,
      isAvailable: r.is_available,
    });
  } catch (err) {
    console.error("Create room error:", err.message);
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
