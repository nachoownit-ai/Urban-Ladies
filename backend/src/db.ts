import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'urban_ladies.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

export function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS salons (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          salon_id TEXT,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'employee',
          active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (salon_id) REFERENCES salons(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error initializing database:', err);
          reject(err);
        } else {
          console.log('✓ Database initialized successfully at ' + dbPath);
          resolve();
        }
      });
    });
  });
}
