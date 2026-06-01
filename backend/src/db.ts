import { createClient } from '@supabase/supabase-js';
import sqlite3 from 'sqlite3';
import path from 'path';

const useSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY;
let supabaseClient: any = null;
let sqliteDb: sqlite3.Database | null = null;

function getSupabaseClient() {
  if (!supabaseClient && useSupabase) {
    try {
      supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        {
          auth: { persistSession: false },
        }
      );
      console.log('✓ Supabase initialized');
    } catch (err) {
      console.error('Supabase error:', err);
    }
  }
  return supabaseClient;
}

function initializeSQLite() {
  if (!sqliteDb && !useSupabase) {
    try {
      const dbPath = path.join(process.cwd(), 'urban_ladies.db');
      sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error('Error opening database:', err);
      });
      sqliteDb.run('PRAGMA foreign_keys = ON');
      console.log('✓ Connected to SQLite');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return sqliteDb;
}

export function getDb() {
  return useSupabase ? getSupabaseClient() : initializeSQLite();
}

export const supabase = { get client() { return getSupabaseClient(); } };
export const db = null;

export function initializeDatabase() {
  if (useSupabase) {
    console.log('✓ Database initialized');
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    try {
      const db = initializeSQLite();
      db!.serialize(() => {
        db!.run('CREATE TABLE IF NOT EXISTS salons (id TEXT PRIMARY KEY, name TEXT NOT NULL, address TEXT, phone TEXT, email TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
        db!.run('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, salon_id TEXT, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT "employee", active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (salon_id) REFERENCES salons(id))', (err) => {
          if (err) reject(err);
          else { console.log('✓ Database initialized'); resolve(); }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}
