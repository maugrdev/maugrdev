const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "data", "mau.db");
const dirPath = path.dirname(dbPath);

// Crea la carpeta si no existe
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const db = new Database(dbPath);
module.exports = db;