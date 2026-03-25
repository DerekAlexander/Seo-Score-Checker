// Test Neon database connection
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('🔗 Testing Neon connection...');
console.log('Connection string:', connectionString.replace(/:[^:]*@/, ':****@'));

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Neon requires SSL
  }
});

client.connect(async (err) => {
  if (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }

  try {
    console.log('✅ Connected to Neon!');

    // Test query
    const result = await client.query('SELECT NOW() as current_time;');
    console.log('✅ Query successful. Current DB time:', result.rows[0].current_time);

    // List existing tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Existing tables:');
    if (tables.rows.length === 0) {
      console.log('   (none - database is empty)');
    } else {
      tables.rows.forEach(t => console.log(`   - ${t.table_name}`));
    }

  } catch (error) {
    console.error('❌ Query failed:', error);
    process.exit(1);
  } finally {
    client.end();
    console.log('✅ Connection closed');
  }
});
