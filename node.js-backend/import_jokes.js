const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'jokes.db');
const JSON_PATH = path.join(__dirname, 'index.json');

if (!fs.existsSync(JSON_PATH)) {
  console.error('index.json not found. Download it into this folder:');
  console.error('curl -L -o index.json https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json');
  process.exit(1);
}

const raw = fs.readFileSync(JSON_PATH, 'utf8');
const jokes = JSON.parse(raw);

const db = new sqlite3.Database(DB_PATH);
db.serialize(() => { //Serialize makes sure all commands run in order and finish before next one starts
  db.run(`CREATE TABLE IF NOT EXISTS jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joke_id INTEGER UNIQUE,
    type TEXT,
    setup TEXT,
    punchline TEXT
  );`);

  const stmt = db.prepare('INSERT OR IGNORE INTO jokes (joke_id, type, setup, punchline) VALUES (?, ?, ?, ?)');
  jokes.forEach(j => {
    stmt.run(j.id, j.type || null, j.setup || null, j.punchline || null);
  });
  stmt.finalize();

  db.get('SELECT COUNT(*) as count FROM jokes', (err, row) => {
    if (err) console.error(err);
    else console.log(`DB ready — ${row.count} jokes in jokes.db`);
    db.close();
  });
});