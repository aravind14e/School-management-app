import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

let db: any = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  // For Vercel deployment, use a temporary database path
  const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/school_management.db'  // Vercel allows writes to /tmp
    : join(process.cwd(), 'school_management.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create schools table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      contact TEXT NOT NULL,
      image TEXT,
      email_id TEXT NOT NULL,
      about TEXT,
      academic_programs TEXT,
      facilities TEXT,
      website TEXT,
      established_year TEXT,
      principal_name TEXT,
      total_students TEXT,
      board_affiliation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

export default getDatabase;
