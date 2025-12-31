// db-init.ts
import { testConnection } from './db';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Test the connection using our new function
    await testConnection();
    console.log('✅ Database connection test passed');
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
