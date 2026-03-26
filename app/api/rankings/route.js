export const dynamic = 'force-dynamic'

import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

/**
 * GET /api/rankings?clientId=1
 * Fetch top 25 keywords from Google Search Console for a client
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return Response.json({ error: 'clientId required' }, { status: 400 })
    }

    // Get client info
    const clientRes = await pool.query('SELECT * FROM clients WHERE id = $1', [clientId])
    if (clientRes.rows.length === 0) {
      return Response.json({ error: 'Client not found' }, { status: 404 })
    }

    const client = clientRes.rows[0]
    const gscProperty = `sc-domain:${new URL(client.url).hostname}`

    // Get or refresh GSC access token
    const accessToken = await getGSCAccessToken()

    // Fetch top keywords from GSC
    const keywords = await fetchGSCKeywords(gscProperty, accessToken)

    // Store in database
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    await saveRankingSnapshot(clientId, timestamp, keywords)

    return Response.json({
      clientId,
      domain: client.url,
      gscProperty,
      timestamp,
      keywords: keywords.slice(0, 25), // Top 25
      count: keywords.length
    })
  } catch (error) {
    console.error('Ranking API error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Get GSC access token using service account
 */
async function getGSCAccessToken() {
  try {
    const credentialsFile = '/home/hydrodub/.openclaw/workspace/data/gsc_service_account.json'
    
    if (!fs.existsSync(credentialsFile)) {
      throw new Error('GSC service account file not found.')
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'))
    
    // Create JWT claim
    const now = Math.floor(Date.now() / 1000)
    const claim = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }
    
    // Sign JWT
    const token = jwt.sign(claim, credentials.private_key, { algorithm: 'RS256' })
    
    // Exchange JWT for access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      })
    })

    if (!response.ok) {
      throw new Error(`Token generation failed: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Token error:', error)
    throw error
  }
}

/**
 * Fetch top keywords from Google Search Console API
 */
async function fetchGSCKeywords(gscProperty, accessToken) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const response = await fetch(
    'https://www.googleapis.com/webmasters/v3/sites/' + 
    encodeURIComponent(gscProperty) + 
    '/searchAnalytics/query',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: thirtyDaysAgo,
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['query'],
        rowLimit: 25,
        orderBy: [
          {
            columnName: 'impressions',
            sortOrder: 'DESCENDING'
          }
        ]
      })
    }
  )

  if (!response.ok) {
    throw new Error(`GSC API error: ${response.status}`)
  }

  const data = await response.json()
  
  return (data.rows || []).map(row => ({
    keyword: row.keys[0],
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: (row.ctr * 100).toFixed(2),
    avgPosition: row.position.toFixed(1)
  }))
}

/**
 * Store ranking snapshot in database
 */
async function saveRankingSnapshot(clientId, date, keywords) {
  try {
    // Create rankings table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rankings (
        id SERIAL PRIMARY KEY,
        client_id INT NOT NULL REFERENCES clients(id),
        date DATE NOT NULL,
        keyword TEXT NOT NULL,
        position DECIMAL(5,2),
        impressions INT,
        clicks INT,
        ctr DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(client_id, date, keyword)
      )
    `)

    // Insert or update rankings
    for (const kw of keywords) {
      await pool.query(`
        INSERT INTO rankings (client_id, date, keyword, position, impressions, clicks, ctr)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (client_id, date, keyword) DO UPDATE
        SET position = $4, impressions = $5, clicks = $6, ctr = $7
      `, [
        clientId,
        date,
        kw.keyword,
        parseFloat(kw.avgPosition),
        kw.impressions,
        kw.clicks,
        parseFloat(kw.ctr)
      ])
    }

    console.log(`✅ Saved ${keywords.length} rankings for client ${clientId}`)
  } catch (error) {
    console.error('Save rankings error:', error)
    throw error
  }
}
