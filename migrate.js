// Database migration script for SEO Score Checker
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const migration = async () => {
  try {
    await client.connect();
    console.log('✅ Connected to Neon');

    // Create clients table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created clients table');

    // Create competitors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS competitors (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_id, url)
      );
    `);
    console.log('✅ Created competitors table');

    // Create seo_scores table
    await client.query(`
      CREATE TABLE IF NOT EXISTS seo_scores (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        subject_type VARCHAR(20) NOT NULL CHECK (subject_type IN ('client', 'competitor')),
        subject_url VARCHAR(500) NOT NULL,
        subject_name VARCHAR(255),
        score INTEGER,
        pagespeed_mobile INTEGER,
        pagespeed_desktop INTEGER,
        organic_traffic INTEGER,
        organic_traffic_change INTEGER,
        top_keywords INTEGER,
        top_keywords_change INTEGER,
        local_seo INTEGER,
        issues TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created seo_scores table');

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_seo_scores_client_id 
      ON seo_scores(client_id);
    `);
    console.log('✅ Created index on seo_scores.client_id');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_seo_scores_timestamp 
      ON seo_scores(timestamp DESC);
    `);
    console.log('✅ Created index on seo_scores.timestamp');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_seo_scores_subject 
      ON seo_scores(client_id, subject_type);
    `);
    console.log('✅ Created index on seo_scores(client_id, subject_type)');

    console.log('\n✅ Migration complete!');
    console.log('\nTables created:');
    console.log('  - clients (id, name, url, created_at, updated_at)');
    console.log('  - competitors (id, client_id, name, url, created_at)');
    console.log('  - seo_scores (id, client_id, subject_type, subject_url, score, pagespeed_*, organic_traffic, top_keywords, local_seo, issues, timestamp)');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

migration();
