const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const setup = require("./setup");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
setup().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
