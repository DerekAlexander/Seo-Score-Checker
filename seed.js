// Seed script - load existing JSON data into PostgreSQL
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const dataPath = path.join(__dirname, 'data', 'clients.json');
if (!fs.existsSync(dataPath)) {
  console.error('❌ data/clients.json not found');
  process.exit(1);
}

const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

const seed = async () => {
  try {
    await client.connect();
    console.log('✅ Connected to Neon');

    // Insert clients
    for (const jsonClient of jsonData.clients) {
      const result = await client.query(
        'INSERT INTO clients (id, name, url) VALUES ($1, $2, $3) ON CONFLICT (url) DO UPDATE SET name = $2 RETURNING id;',
        [jsonClient.id, jsonClient.name, jsonClient.url]
      );
      const clientId = result.rows[0].id;
      console.log(`✅ Inserted client: ${jsonClient.name} (id: ${clientId})`);

      // Insert competitors
      if (jsonClient.competitors && jsonClient.competitors.length > 0) {
        for (const competitor of jsonClient.competitors) {
          await client.query(
            'INSERT INTO competitors (client_id, name, url) VALUES ($1, $2, $3) ON CONFLICT (client_id, url) DO NOTHING;',
            [clientId, competitor.name, competitor.url]
          );
        }
        console.log(`   ├─ ${jsonClient.competitors.length} competitors added`);
      }
    }

    // Insert scores
    let scoreCount = 0;
    for (const score of jsonData.scores) {
      const subjectType = score.client_url ? 'client' : 'competitor';
      const subjectUrl = score.client_url || score.competitor_url;
      const subjectName = score.competitor_name || null;

      await client.query(
        `INSERT INTO seo_scores 
        (client_id, subject_type, subject_url, subject_name, score, pagespeed_mobile, pagespeed_desktop, 
         organic_traffic, organic_traffic_change, top_keywords, top_keywords_change, local_seo, issues, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
        [
          score.client_id,
          subjectType,
          subjectUrl,
          subjectName,
          score.score || 0,
          score.pagespeed_mobile || null,
          score.pagespeed_desktop || null,
          score.organic_traffic || null,
          score.organic_traffic_change || null,
          score.top_keywords || null,
          score.top_keywords_change || null,
          score.local_seo || null,
          score.issues ? JSON.stringify(score.issues) : null,
          score.timestamp
        ]
      );
      scoreCount++;
    }
    console.log(`✅ Inserted ${scoreCount} score records`);

    console.log('\n✅ Seed complete!');
    console.log(`   Clients: ${jsonData.clients.length}`);
    console.log(`   Scores: ${scoreCount}`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

seed();
