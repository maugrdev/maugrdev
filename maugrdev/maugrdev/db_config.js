const Database = require("better-sqlite3");
const db = new Database("./data/mau.db");
module.exports = db;
