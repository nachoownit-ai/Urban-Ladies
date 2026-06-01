import { createClient } from '@supabase/supabase-js';
import sqlite3 from 'sqlite3';
import path from 'path';
import ws from 'ws';

// Detectar si usamos Supabase o SQLite local
const useSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY;

let supabaseClient: any = null;
let sqliteDb: sqlite3.Database | null = null;

if (useSupabase) {
  // Usar Supabase PostgreSQL
  supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      global: {
        // @ts-ignore - ws is for Node.js environment
        fetch: undefined,
      },
    }
  );
  console.log('✓ Connected to Supabase PostgreSQL');
} else {
  // Usar SQLite local como fallback
  const dbPath = path.join(process.cwd(), 'urban_ladies.db');
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
    }
  });
  sqliteDb.run('PRAGMA foreign_keys = ON');
}

export const db = supabaseClient || sqliteDb;

export function initializeDatabase() {
  if (useSupabase) {
    // Supabase tables are managed in the SQL migrations
    // Just verify connection
    return supabaseClient.auth.getSession().then(() => {
      console.log('✓ Database initialized successfully (Supabase)');
      return Promise.resolve();
    });
  } else {
    // SQLite initialization
    return new Promise<void>((resolve, reject) => {
      sqliteDb!.serialize(() => {
        sqliteDb!.run(`
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

        sqliteDb!.run(`
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
            console.log('✓ Database initialized successfully (SQLite)');
            resolve();
          }
        });
      });
    });
  }
}
