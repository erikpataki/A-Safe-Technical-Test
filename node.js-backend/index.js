const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'jokes.db');
const db = new sqlite3.Database(DB_PATH, err => {
  if (err) console.error('Failed to open DB:', err);
  else console.log('Connected to', DB_PATH);
});

// ensure table exists (safe if you also ran import_jokes.js)
db.run(`CREATE TABLE IF NOT EXISTS jokes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  joke_id INTEGER UNIQUE,
  type TEXT,
  setup TEXT,
  punchline TEXT
)`);

app.get('/api/jokes/random', (req, res) => {
  const typesParam = req.query.types;
  let sql = 'SELECT joke_id as id, type, setup, punchline FROM jokes';
  let params = [];
  if (typeof typesParam === 'string') {
    const types = typesParam
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (types.length > 0) {
      const placeholders = types.map(() => '?').join(',');
      sql += ` WHERE type IN (${placeholders})`;
      params = types;
    }
  }
  sql += ' ORDER BY RANDOM() LIMIT 1';

  db.get(sql, params, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'No jokes found for the given filter.' });
    res.json(row);
  });
});

app.get('/api/types', (req, res) => {
  db.all('SELECT DISTINCT type FROM jokes WHERE type IS NOT NULL ORDER BY type', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const types = rows.map(r => r.type);
    res.json(types);
  });
});

// Return types with counts
app.get('/api/types/stats', (req, res) => {
  db.all('SELECT type, COUNT(*) as count FROM jokes WHERE type IS NOT NULL GROUP BY type ORDER BY type', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
