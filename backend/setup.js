const db = require("./db");
const setup = async () => {
  try {
    await db.query(`
     CREATE TABLE IF NOT EXISTS rooms (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       capacity INTEGER NOT NULL,
       location VARCHAR(200) NOT NULL,
       is_available BOOLEAN DEFAULT true
     )
   `);
    await db.query(`
     CREATE TABLE IF NOT EXISTS bookings (
       id SERIAL PRIMARY KEY,
       room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
       booked_by VARCHAR(100) NOT NULL,
       date VARCHAR(20) NOT NULL,
       time_slot VARCHAR(50) NOT NULL,
       created_at TIMESTAMP DEFAULT NOW()
     )
   `);
    const existing = await db.query("SELECT COUNT(*) FROM rooms");
    if (parseInt(existing.rows[0].count) === 0) {
      await db.query(`
       INSERT INTO rooms (name, capacity, location, is_available) VALUES
       ('Room A', 4, 'Block 1, Floor 1', true),
       ('Room B', 6, 'Block 1, Floor 2', true),
       ('Room C', 8, 'Block 2, Floor 1', true)
     `);
      console.log("Sample rooms added");
    }
    console.log("Database tables ready");
  } catch (err) {
    console.error("Setup error:", err.message);
  }
};
module.exports = setup;
