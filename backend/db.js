const pg = require("pg");
const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "studyrooms",
  password: "postgres",
  port: 5432,
});
db.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to PostgreSQL");
    release();
  }
});
module.exports = db;
