import ws from 'ws';
import { createClient } from '@supabase/supabase-js';
import sqlite3 from 'sqlite3';
import path from 'path';

// Detectar si usamos Supabase o SQLite local
const useSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY;

let supabaseClient: any = null;
let sqliteDb: sqlite3.Database | null = null;

// Lazy initialization - NO se ejecuta en startup
function initializeSupabase() {
  if (!supabaseClient && useSupabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      realtime: {
        transport: ws,
      },
      auth: {
        persistSession: false,
      },
    });

    console.log('✓ Connected to Supabase PostgreSQL');
  }
  return supabaseClient;
}

function initializeSQLite() {
  if (!sqliteDb && !useSupabase) {
    try {
      const dbPath = path.join(process.cwd(), 'urban_ladies.db');
      sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
        }
      });
      sqliteDb.run('PRAGMA foreign_keys = ON');
      console.log('✓ Connected to SQLite');
    } catch (error) {
      console.error('Error connecting to SQLite:', error);
      throw error;
    }
  }
  return sqliteDb;
}

export function getDb() {
  if (useSupabase) {
    return initializeSupabase();
  } else {
    return initializeSQLite();
  }
}

// Export para acceso directo (también lazy)
export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    const client = initializeSupabase();
    return (client as any)[prop];
  },
});

export const db = null; // Deprecated: use getDb() instead

export function initializeDatabase() {
  if (useSupabase) {
    console.log('✓ Supabase will initialize on first request');
    return Promise.resolve();
  } else {
    // SQLite initialization
    return new Promise<void>((resolve, reject) => {
      try {
        const db = initializeSQLite();
        db!.serialize(() => {
          db!.run(`
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

          db!.run(`
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
      } catch (error) {
        console.error('Error initializing database:', error);
        reject(error);
      }
    });
  }
}
