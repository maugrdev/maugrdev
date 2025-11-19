const Database = require("better-sqlite3");

// Crea o abre la base de datos
const db = new Database("./database/mau.db");

// Crear tabla si no existe
db.prepare(`
    CREATE TABLE IF NOT EXISTS testimonios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        mensaje TEXT NOT NULL,
        fecha TEXT NOT NULL,
        foto TEXT,
        rating INTEGER DEFAULT 5
    )
`).run();

console.log("Base de datos lista");
