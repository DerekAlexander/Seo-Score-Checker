import https from 'https'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY

    if (!url) {
      return Response.json({ error: 'URL required' }, { status: 400 })
    }

    if (!apiKey) {
      return Response.json({ error: 'PageSpeed API key not configured' }, { status: 500 })
    }

    // Fetch mobile score
    console.log(`[PageSpeed] Fetching mobile for ${url}`)
    const mobileData = await fetchPageSpeed(url, 'mobile', apiKey)
    const mobileScore = mobileData?.lighthouseResult?.categories?.performance?.score * 100 || 0

    // Fetch desktop score
    console.log(`[PageSpeed] Fetching desktop for ${url}`)
    const desktopData = await fetchPageSpeed(url, 'desktop', apiKey)
    const desktopScore = desktopData?.lighthouseResult?.categories?.performance?.score * 100 || 0

    return Response.json({
      url,
      mobile: Math.round(mobileScore),
      desktop: Math.round(desktopScore),
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('PageSpeed error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

function fetchPageSpeed(url, strategy, apiKey) {
  return new Promise((resolve, reject) => {
    const encodedUrl = encodeURIComponent(url)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${apiKey}&strategy=${strategy}`

    const req = https.get(apiUrl, { timeout: 60000 }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`))
        }
      })
    })

    req.on('error', (err) => reject(err))
    req.on('timeout', () => {
      req.abort()
      reject(new Error(`Timeout fetching ${strategy} PageSpeed`))
    })
  })
}
