const initSqlJs = require('sql.js');
const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'astroveda.db');

let db = null;
let dbReady = false;

async function getDb() {
  if (dbReady) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS consultations (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      problem    TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'new',
      notes      TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      address    TEXT NOT NULL,
      items      TEXT NOT NULL,
      total      REAL NOT NULL DEFAULT 0,
      status     TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS page_views (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      page       TEXT NOT NULL DEFAULT '/',
      referrer   TEXT NOT NULL DEFAULT '',
      ua         TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL DEFAULT '',
      service    TEXT NOT NULL DEFAULT 'General Consultation',
      appt_date  TEXT NOT NULL,
      appt_time  TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'pending',
      notes      TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `);

  dbReady = true;
  _persist();
  console.log('[DB] SQLite ready →', DB_PATH);
  return db;
}

function _persist() {
  if (!db) return;
  try {
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  } catch (e) {
    console.error('[DB] persist error:', e.message);
  }
}

// Run a write query, persist, return lastInsertRowid
function run(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  db.run(sql, params);
  _persist();
  const result = db.exec('SELECT last_insert_rowid() as id');
  return { lastInsertRowid: result[0]?.values[0][0] ?? null };
}

// Get a single row
function get(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

// Get all rows
function all(sql, params = []) {
  if (!db) throw new Error('DB not initialized');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

module.exports = { getDb, run, get, all };
