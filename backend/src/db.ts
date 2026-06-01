import { createClient } from '@supabase/supabase-js';
import sqlite3 from 'sqlite3';
import path from 'path';
import ws from 'ws';

// Detectar si usamos Supabase o SQLite local
const useSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY;

let supabaseClient: any = null;
let sqliteDb: sqlite3.Database | null = null;

// Lazy initialization - don't connect at startup
function initializeSupabase() {
  if (!supabaseClient && useSupabase) {
    try {
      supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        {
          realtime: false,
          auth: {
            persistSession: false,
          },
        }
      );
      console.log('✓ Connected to Supabase PostgreSQL');
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      throw error;
    }
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

export const db = null; // Deprecated: use getDb() instead

export function initializeDatabase() {
  if (useSupabase) {
    // Supabase tables are managed in the SQL migrations
    // Just verify connection with lazy initialization
    try {
      const client = initializeSupabase();
      return client.auth.getSession().then(() => {
        console.log('✓ Database initialized successfully (Supabase)');
        return Promise.resolve();
      });
    } catch (error) {
      console.log('⚠ Supabase not fully initialized yet (will initialize on first request)');
      return Promise.resolve();
    }
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
