// db.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Get database URL with fallback for development
function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  if (process.env.DEV_DATABASE_URL) {
    return process.env.DEV_DATABASE_URL;
  }
  
  throw new Error("DATABASE_URL environment variable is required");
}

const connectionString = getDatabaseUrl();

console.log('🔗 Using database:', connectionString.split('@')[1]);

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export const db = drizzle(pool, { schema });
