// test-db.js - Database diagnostic tool
import { testConnection, testQuery } from './dist/db.js';

async function main() {
  console.log('🧪 Database Diagnostic Test');
  console.log('==========================\n');
  
  console.log('📝 Environment check:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set'}`);
  
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log(`   Host: ${url.hostname}`);
      console.log(`   Database: ${url.pathname}`);
    } catch (e) {
      console.log(`   ⚠️  Invalid DATABASE_URL format`);
    }
  }
  
  console.log('\n🔗 Testing connection...');
  
  try {
    // Test 1: Connection
    await testConnection();
    
    // Test 2: Query
    console.log('\n📊 Testing queries...');
    const result = await testQuery();
    
    if (result) {
      console.log('\n✅ All tests passed! Database is working correctly.');
      console.log('\n📈 Summary:');
      console.log(`   Users: ${result.userCount}`);
      console.log(`   Categories: ${result.categoryCount}`);
      console.log(`   Products: ${result.productCount}`);
    } else {
      console.log('\n⚠️  Database connected but tables are empty.');
      console.log('   Run: npm run db:seed to populate initial data.');
    }
    
  } catch (error) {
    console.error('\n❌ Diagnostic failed!');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('password authentication failed')) {
      console.error('\n🔑 CREDENTIALS ISSUE:');
      console.error('   Check your DATABASE_URL password.');
      console.error('   For Neon: Get password from neon.tech dashboard');
      console.error('   Command: fly secrets set DATABASE_URL="your_connection_string"');
    }
    
    process.exit(1);
  }
}

main();
