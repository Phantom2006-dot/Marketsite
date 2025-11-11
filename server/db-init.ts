// db-init.ts
import { db } from './db';
import { sql } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Test the connection
    const result = await db.execute(sql`SELECT NOW()`);
    console.log('✅ Database connection test passed');
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
