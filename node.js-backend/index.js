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
  db.get('SELECT joke_id as id, type, setup, punchline FROM jokes ORDER BY RANDOM() LIMIT 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'No jokes found. Did you seed the DB?' });
    res.json(row);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
