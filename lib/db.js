// Database utilities for Postgres
const { Pool } = require('pg');

let pool;

// Initialize connection pool
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

// Get all clients with their latest scores
async function getClientsWithScores() {
  const pool = getPool();
  
  try {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.url,
        c.created_at,
        c.updated_at
      FROM clients c
      ORDER BY c.id ASC;
    `;
    
    const result = await pool.query(query);
    const clients = result.rows;

    // For each client, get their latest scores and competitors
    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        // Get latest client score
        const scoreResult = await pool.query(
          `SELECT * FROM seo_scores 
           WHERE client_id = $1 AND subject_type = 'client'
           ORDER BY timestamp DESC
           LIMIT 2;`,
          [client.id]
        );
        
        const latestScore = scoreResult.rows[0] || {};
        const previousScore = scoreResult.rows[1] || {};

        // Parse issues if they exist
        if (latestScore.issues) {
          latestScore.issues = JSON.parse(latestScore.issues);
        }

        // Get competitors
        const compResult = await pool.query(
          `SELECT id, name, url FROM competitors WHERE client_id = $1;`,
          [client.id]
        );
        
        const competitors = await Promise.all(
          compResult.rows.map(async (comp) => {
            const compScoreResult = await pool.query(
              `SELECT * FROM seo_scores 
               WHERE client_id = $1 AND subject_type = 'competitor' AND subject_url = $2
               ORDER BY timestamp DESC
               LIMIT 1;`,
              [client.id, comp.url]
            );
            
            const compScore = compScoreResult.rows[0] || {};
            return {
              name: comp.name,
              url: comp.url,
              score: compScore.score || 0
            };
          })
        );

        // Get trend data (all client scores)
        const trendResult = await pool.query(
          `SELECT score, timestamp FROM seo_scores 
           WHERE client_id = $1 AND subject_type = 'client'
           ORDER BY timestamp ASC;`,
          [client.id]
        );

        const trendData = trendResult.rows.map((row, idx) => ({
          week: `Week ${idx + 1}`,
          score: row.score
        }));

        return {
          id: client.id,
          name: client.name,
          url: client.url,
          currentScore: latestScore.score || 0,
          previousScore: previousScore.score || latestScore.score || 0,
          pageSpeedMobile: latestScore.pagespeed_mobile || 0,
          pageSpeedDesktop: latestScore.pagespeed_desktop || 0,
          organicTraffic: latestScore.organic_traffic || 0,
          organicTrafficChange: latestScore.organic_traffic_change || 0,
          topKeywords: latestScore.top_keywords || 0,
          topKeywordsChange: latestScore.top_keywords_change || 0,
          localSEO: latestScore.local_seo || 0,
          competitors,
          trendData,
          lastUpdated: latestScore.timestamp || new Date().toISOString()
        };
      })
    );

    return enrichedClients;

  } catch (error) {
    console.error('Database error in getClientsWithScores:', error);
    throw error;
  }
}

// Insert a new score record
async function insertScore(data) {
  const pool = getPool();
  
  try {
    const result = await pool.query(
      `INSERT INTO seo_scores 
      (client_id, subject_type, subject_url, subject_name, score, pagespeed_mobile, pagespeed_desktop,
       organic_traffic, organic_traffic_change, top_keywords, top_keywords_change, local_seo, issues, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;`,
      [
        data.client_id,
        data.subject_type,
        data.subject_url,
        data.subject_name || null,
        data.score,
        data.pagespeed_mobile || null,
        data.pagespeed_desktop || null,
        data.organic_traffic || null,
        data.organic_traffic_change || null,
        data.top_keywords || null,
        data.top_keywords_change || null,
        data.local_seo || null,
        data.issues ? JSON.stringify(data.issues) : null,
        new Date()
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error in insertScore:', error);
    throw error;
  }
}

// Close pool (for cleanup)
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  getPool,
  getClientsWithScores,
  insertScore,
  closePool
};
