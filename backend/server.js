const express = require("express");
const cors = require("cors");
require("dotenv").config();
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
