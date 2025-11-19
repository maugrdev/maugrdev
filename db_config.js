const Database = require("better-sqlite3");
const db = new Database("./database/mau.db");
module.exports = db;
