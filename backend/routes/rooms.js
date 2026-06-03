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
  res.json(data.rooms);
});
router.post("/", (req, res) => {
  const data = readData();
  const newRoom = { id: Date.now().toString(), ...req.body };
  data.rooms.push(newRoom);
  writeData(data);
  res.status(201).json(newRoom);
});
module.exports = router;
