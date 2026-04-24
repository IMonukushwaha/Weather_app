const Database = require('better-sqlite3');
const db = new Database('weather.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    city        TEXT NOT NULL,
    country     TEXT,
    temp        REAL,
    description TEXT,
    searched_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

module.exports = db;
