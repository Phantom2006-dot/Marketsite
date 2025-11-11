// db.ts
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
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

export const sql = postgres(connectionString, {
  // SSL is required for Render PostgreSQL
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  // Connection pool settings
  max: 20,
  idle_timeout: 30,
  connect_timeout: 10,
});

// Simple connection test
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connection test passed');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    throw error;
  }
}

export const db = drizzle(sql, { schema });
