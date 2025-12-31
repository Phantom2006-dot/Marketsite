// db-init.ts
import { testConnection, testQuery } from './db';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test the connection
    await testConnection();
    
    // Test a query to verify tables exist
    const queryResult = await testQuery();
    
    if (queryResult) {
      console.log('✅ Database is ready and has data');
    } else {
      console.log('⚠️  Database connected but tables may be empty');
      console.log('   Run: npm run db:seed to populate initial data');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed');
    
    // Log detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('   Error details:', errorMessage);
    
    if (process.env.NODE_ENV === 'development' && errorStack) {
      console.error('   Stack trace:', errorStack);
    }
    
    // Don't crash the server - allow it to run without database
    // The app might have fallback functionality
    console.log('   ⚠️  Server will continue running without database connection');
    console.log('   ⚠️  Some features may not work');
    
    return false;
  }
}
