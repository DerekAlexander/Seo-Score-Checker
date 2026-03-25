// Google Search Console API integration
// Requires OAuth token to be set via environment or session

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const siteUrl = searchParams.get('siteUrl') // e.g., https://alexanders-roofing.vercel.app/
    const accessToken = searchParams.get('accessToken') // OAuth access token

    if (!siteUrl) {
      return Response.json({ error: 'siteUrl parameter required' }, { status: 400 })
    }

    if (!accessToken) {
      return Response.json({ 
        error: 'Not authenticated',
        message: 'Need to authenticate with Google first',
        authUrl: `/api/gsc/auth`
      }, { status: 401 })
    }

    // Query Search Console for top queries
    const response = await fetch(
      'https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(siteUrl) + '/searchanalytics/query',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: getDateRange(30).start, // Last 30 days
          endDate: getDateRange(30).end,
          dimensions: ['query'],
          rowLimit: 10
        }),
        timeout: 10000
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        return Response.json({ 
          error: 'Token expired',
          message: 'Please reauthenticate'
        }, { status: 401 })
      }
      throw new Error(`GSC API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract metrics
    const rows = data.rows || []
    const totalClicks = rows.reduce((sum, row) => sum + row.clicks, 0)
    const topKeywords = rows.slice(0, 10).map(row => ({
      query: row.query,
      clicks: row.clicks,
      impressions: row.impressions,
      position: row.position
    }))
    const keywordsInTop10 = rows.filter(row => row.position <= 10).length

    return Response.json({
      siteUrl,
      organicTraffic: totalClicks,
      topKeywords: keywordsInTop10,
      topQueries: topKeywords,
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('GSC error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// OAuth authentication endpoint
export async function POST(request) {
  try {
    const body = await request.json()
    const code = body.code // Authorization code from Google

    if (!code) {
      return Response.json({ error: 'Authorization code required' }, { status: 400 })
    }

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

    if (!clientId || !clientSecret) {
      return Response.json({ error: 'OAuth credentials not configured' }, { status: 500 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    return Response.json({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in
    }, { status: 200 })

  } catch (error) {
    console.error('OAuth error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

function getDateRange(days) {
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}
