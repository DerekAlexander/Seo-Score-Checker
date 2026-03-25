import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'clients.json')

// Get all client data with latest scores
export async function GET(request) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    
    // Format data for frontend
    const clients = data.clients.map(client => {
      // Get latest scores for THIS CLIENT ONLY (not competitors)
      const clientScores = data.scores
        .filter(s => s.client_id === client.id && s.client_url === client.url)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      const latestScore = clientScores[0]
      const previousScore = clientScores[1]
      
      // Get latest competitor scores
      const competitorScores = {}
      client.competitors.forEach(competitor => {
        const compScores = data.scores
          .filter(s => s.client_id === client.id && s.competitor_url === competitor.url)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        if (compScores.length > 0) {
          competitorScores[competitor.url] = compScores[0]
        }
      })

      // Build trend data - only client scores, reverse chronological
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
        competitors: client.competitors.map((competitor, idx) => {
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
  } catch (error) {
    console.error('Error reading clients:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
