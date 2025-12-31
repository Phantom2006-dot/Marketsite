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
  // SSL is required for Neon/Render PostgreSQL
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : (connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : false),
  // Connection pool settings
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
  prepare: false, // Required for Neon pooler
});
// db.ts
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@shared/schema";

// Get database URL with better error handling
function getDatabaseUrl(): string {
  // Check for DATABASE_URL (production)
  if (process.env.DATABASE_URL) {
    console.log('🔗 Using DATABASE_URL from environment');
    return process.env.DATABASE_URL;
  }
  
  // Check for RENDER_EXTERNAL_DATABASE_URL (Render)
  if (process.env.RENDER_EXTERNAL_DATABASE_URL) {
    console.log('🔗 Using RENDER_EXTERNAL_DATABASE_URL');
    return process.env.RENDER_EXTERNAL_DATABASE_URL;
  }
  
  // Check for development database URL
  if (process.env.DEV_DATABASE_URL) {
    console.log('🔗 Using DEV_DATABASE_URL');
    return process.env.DEV_DATABASE_URL;
  }
  
  // For Neon specifically, we might need to construct it
  if (process.env.NEON_DATABASE_URL) {
    console.log('🔗 Using NEON_DATABASE_URL');
    return process.env.NEON_DATABASE_URL;
  }
  
  console.error('❌ No database URL found in environment variables');
  console.error('Available env vars:', Object.keys(process.env));
  throw new Error("DATABASE_URL environment variable is required");
}

const connectionString = getDatabaseUrl();

// Log a safe version of the connection string
const urlObj = new URL(connectionString);
console.log(`🔗 Database: ${urlObj.hostname}${urlObj.pathname}`);

// Function to ensure SSL is properly configured for Neon
function getSSLConfig(connString: string) {
  if (connString.includes('neon.tech')) {
    return { 
      rejectUnauthorized: false,
      require: true
    };
  }
  
  // For production environments, use SSL
  if (process.env.NODE_ENV === 'production') {
    return { rejectUnauthorized: false };
  }
  
  return false;
}

export const sql = postgres(connectionString, {
  // SSL configuration
  ssl: getSSLConfig(connectionString),
  
  // Connection pool settings
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // Required for Neon pooler
  
  // Transform PostgreSQL snake_case to camelCase
  transform: {
    column: (col) => {
      // Convert snake_case to camelCase
      return col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }
  },
  
  // Debug logging
  debug: process.env.NODE_ENV === 'development',
});

// Comprehensive connection test
export async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test 1: Simple query
    const result = await sql`SELECT NOW() as current_time, version() as version`;
    console.log('✅ Database connection test passed');
    console.log(`   Time: ${result[0].currentTime}`);
    console.log(`   Version: ${result[0].version.split(' ')[0]}`);
    
    // Test 2: Try to list tables (if we have permissions)
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log(`   Found ${tables.length} tables`);
    } catch (tableError) {
      // This is OK - we might not have permissions
      console.log('   Could not list tables (permissions issue)');
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Database connection test failed');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    
    // Provide helpful error messages
    if (error.code === '28P01') {
      console.error('   🔑 Issue: Invalid username/password');
      console.error('   Solution: Check your DATABASE_URL credentials');
    } else if (error.code === '3D000') {
      console.error('   🗄️ Issue: Database does not exist');
      console.error('   Solution: Create the database in Neon dashboard');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   🌐 Issue: Connection refused');
      console.error('   Solution: Check hostname/port and network connectivity');
    } else if (error.message?.includes('SSL')) {
      console.error('   🔒 Issue: SSL connection required');
      console.error('   Solution: Add ?sslmode=require to your DATABASE_URL');
    }
    
    throw error;
  }
}

// Test query function to verify database operations
export async function testQuery() {
  try {
    console.log('🧪 Testing database query...');
    
    // Try to count users (or any simple query)
    const result = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM categories) as category_count,
        (SELECT COUNT(*) FROM products) as product_count
    `;
    
    console.log('✅ Database query test passed');
    console.log(`   Users: ${result[0].userCount}`);
    console.log(`   Categories: ${result[0].categoryCount}`);
    console.log(`   Products: ${result[0].productCount}`);
    
    return result[0];
  } catch (error: any) {
    console.error('❌ Database query test failed:', error.message);
    
    // If tables don't exist yet, that's OK - we'll create them
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.log('   ℹ️  Tables not found - need to run migrations/seeds');
      return null;
    }
    
    throw error;
  }
}

export const db = drizzle(sql, { schema });
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
