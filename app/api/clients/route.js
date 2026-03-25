export const dynamic = 'force-dynamic'

// Get all client data with latest scores from PostgreSQL
export async function GET(request) {
  try {
    const { Pool } = require('pg')

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    // Get all clients
    const clientsResult = await pool.query('SELECT * FROM clients ORDER BY id ASC')
    const clients = clientsResult.rows

    // Enrich each client with scores and competitors
    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        // Get latest client scores (last 2)
        const scoresResult = await pool.query(
          `SELECT * FROM seo_scores 
           WHERE client_id = $1 AND subject_type = 'client'
           ORDER BY timestamp DESC
           LIMIT 2`,
          [client.id]
        )
        
        const scores = scoresResult.rows
        const latestScore = scores[0] || {}
        const previousScore = scores[1] || {}

        // Get competitors
        const competitorsResult = await pool.query(
          `SELECT * FROM competitors WHERE client_id = $1`,
          [client.id]
        )

        // Get latest competitor scores
        const competitors = await Promise.all(
          competitorsResult.rows.map(async (comp) => {
            const compScoreResult = await pool.query(
              `SELECT * FROM seo_scores 
               WHERE client_id = $1 AND subject_type = 'competitor' AND subject_url = $2
               ORDER BY timestamp DESC
               LIMIT 1`,
              [client.id, comp.url]
            )
            
            const compScore = compScoreResult.rows[0] || {}
            return {
              name: comp.name,
              url: comp.url,
              score: compScore.score || 0
            }
          })
        )

        // Get trend data (all historical scores for this client)
        const trendResult = await pool.query(
          `SELECT score, timestamp FROM seo_scores 
           WHERE client_id = $1 AND subject_type = 'client'
           ORDER BY timestamp ASC`,
          [client.id]
        )

        const trendData = trendResult.rows.map((row, idx) => ({
          week: `Week ${idx + 1}`,
          score: row.score
        }))

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
        }
      })
    )

    await pool.end()

    return Response.json({ clients: enrichedClients }, { status: 200 })

  } catch (error) {
    console.error('Error fetching clients from Postgres:', error)

    // Fallback to JSON if database unavailable
    try {
      const fs = require('fs')
      const path = require('path')
      const dataPath = path.join(process.cwd(), 'data', 'clients.json')
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

      const clients = data.clients.map(client => {
        const clientScores = data.scores
          .filter(s => s.client_id === client.id && s.client_url === client.url)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        const latestScore = clientScores[0]
        const previousScore = clientScores[1]

        const competitorScores = {}
        client.competitors.forEach(competitor => {
          const compScores = data.scores
            .filter(s => s.client_id === client.id && s.competitor_url === competitor.url)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          if (compScores.length > 0) {
            competitorScores[competitor.url] = compScores[0]
          }
        })

        const trendData = clientScores
          .reverse()
          .map((score, index) => ({
            week: `Week ${index + 1}`,
            score: score.score
          }))

        return {
          id: client.id,
          name: client.name,
          url: client.url,
          currentScore: latestScore?.score || 0,
          previousScore: previousScore?.score || latestScore?.score || 0,
          pageSpeedMobile: latestScore?.pagespeed_mobile || 0,
          pageSpeedDesktop: latestScore?.pagespeed_desktop || 0,
          organicTraffic: latestScore?.organic_traffic || 0,
          organicTrafficChange: latestScore?.organic_traffic_change || 0,
          topKeywords: latestScore?.top_keywords || 0,
          topKeywordsChange: latestScore?.top_keywords_change || 0,
          localSEO: latestScore?.local_seo || 0,
          competitors: client.competitors.map((competitor) => {
            const compScore = competitorScores[competitor.url]
            return {
              name: competitor.name,
              url: competitor.url,
              score: compScore?.score || 0
            }
          }),
          trendData: trendData,
          lastUpdated: latestScore?.timestamp || new Date().toISOString()
        }
      })

      return Response.json({ clients }, { status: 200 })
    } catch (fallbackError) {
      console.error('JSON fallback failed:', fallbackError)
      return Response.json({
        error: 'Failed to fetch clients',
        details: error.message
      }, { status: 500 })
    }
  }
}
