// db.ts
import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Get database URL with fallback for development
function getDatabaseUrl(): string {
  // Production - use Render database
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Development - use local or Replit database if available
  if (process.env.DEV_DATABASE_URL) {
    return process.env.DEV_DATABASE_URL;
  }
  
  throw new Error("DATABASE_URL environment variable is required");
}

const connectionString = getDatabaseUrl();

console.log('🔗 Using database:', connectionString.split('@')[1]); // Log only the host for security

export const pool = new Pool({
  connectionString,
  // SSL is required for Render PostgreSQL
  ssl: {
    rejectUnauthorized: false
  },
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Handle connection events
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export const db = drizzle(pool, { schema });
