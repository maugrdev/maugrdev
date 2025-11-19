const sqlite3 = require('sqlite3').verbose();

// Render va a crear/usar este archivo dentro de la carpeta data
const db = new sqlite3.Database('./data/testimonios.db');

module.exports = db;
