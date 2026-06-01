import ws from 'ws';
import { createClient } from '@supabase/supabase-js';
import sqlite3 from 'sqlite3';
import path from 'path';

const useSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY;

if (useSupabase && (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY)) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = useSupabase
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        realtime: {
          transport: ws,
        },
      }
    )
  : null;

let sqliteDb: sqlite3.Database | null = null;

function initializeSQLite() {
  if (!sqliteDb && !useSupabase) {
    try {
      const dbPath = path.join(process.cwd(), 'urban_ladies.db');
      sqliteDb = new sqlite3.Database(dbPath);
      sqliteDb.run('PRAGMA foreign_keys = ON');
      console.log('✓ SQLite initialized');
    } catch (error) {
      console.error('SQLite error:', error);
    }
  }
  return sqliteDb;
}

export function getDb() {
  return useSupabase ? supabase : initializeSQLite();
}

export const db = null;

export function initializeDatabase() {
  if (useSupabase) {
    console.log('✓ Supabase initialized');
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    try {
      const database = initializeSQLite();
      if (database) {
        console.log('✓ Database initialized');
      }
      resolve();
    } catch (error) {
      console.error('Init error:', error);
      resolve();
    }
  });
}
