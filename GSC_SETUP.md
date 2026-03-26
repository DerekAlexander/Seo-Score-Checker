# Google Search Console Ranking Tracker Setup

## Overview
The rank tracker fetches top 25 keywords from Google Search Console monthly and stores them in the database for trend analysis.

## Prerequisites

### 1. Google Cloud Project
- Create a project in Google Cloud Console
- Enable the **Google Search Console API**
- Create OAuth 2.0 credentials (Web Application)
- Authorized redirect URI: `http://localhost:3000/api/gsc/callback` (dev) or `https://yourdomain.com/api/gsc/callback` (prod)

### 2. Google Search Console
- Verify both client domains in GSC:
  - `alexanders-roofing.vercel.app`
  - `sosaplumbing.com`
- Each domain must have at least some search data history

## Setup Steps

### Step 1: Get Authorization Token
Run the OAuth flow once to create the initial token:

```bash
node scripts/gsc-oauth-init.js
```

This will:
1. Open a browser to Google's auth page
2. Prompt you to authorize the app
3. Exchange the code for access + refresh tokens
4. Save tokens to `/data/gsc_tokens.json`

### Step 2: Verify Environment Variables
Check `.env.local` has:
```
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_GSC_TOKEN_FILE=/home/hydrodub/.openclaw/workspace/data/gsc_tokens.json
```

### Step 3: Test the API
```bash
curl "http://localhost:3000/api/rankings?clientId=1"
```

Should return:
```json
{
  "clientId": 1,
  "domain": "https://alexanders-roofing.vercel.app",
  "gscProperty": "sc-domain:alexanders-roofing.vercel.app",
  "timestamp": "2026-03-26",
  "keywords": [
    {
      "keyword": "roofing services",
      "avgPosition": 12.5,
      "impressions": 245,
      "clicks": 18,
      "ctr": "7.35"
    },
    ...
  ],
  "count": 25
}
```

## Monthly Execution

The cron job runs on the **1st of every month at 9 AM CST**.

### Manual Trigger (for testing)
```bash
curl "http://localhost:3000/api/rankings?clientId=1"
curl "http://localhost:3000/api/rankings?clientId=2"
```

## Dashboard

### Viewing Rankings
1. Go to SEO Score Checker dashboard
2. Select a client
3. Click the **🎯 Rankings** tab
4. Refresh to fetch latest data

### Interpreting Data
- **Position**: Average ranking position (1-100)
  - Green: Top 10 (great)
  - Yellow: 11-30 (good)
  - Red: 30+ (needs work)
- **Impressions**: How many times you appeared in search results
- **Clicks**: Actual clicks from search results
- **CTR**: Click-through rate (clicks / impressions)

## Troubleshooting

### "Token expired" Error
The token auto-refreshes monthly. If it fails:
1. Re-run `node scripts/gsc-oauth-init.js`
2. Re-authorize with Google

### "GSC API error: 403" (Forbidden)
- Domain not verified in Google Search Console
- OAuth token doesn't have GSC permission
- Re-authorize with proper scopes

### No Data Showing
- Domain may not have 30 days of search history
- Check Google Search Console directly for data
- Wait 24-48 hours for GSC data to populate

## Architecture

### Database Schema
```sql
CREATE TABLE rankings (
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
);
```

### Flow
1. **Monthly cron** → Triggers at 1st of month, 9 AM CST
2. **API endpoint** (`/api/rankings`) → Calls GSC API with OAuth token
3. **Token refresh** → Auto-handles expired tokens
4. **Database storage** → Stores keyword data with timestamp
5. **Dashboard** → Displays rankings tab with table + trends

## Next Steps

### Planned Features
- [ ] Keyword position change tracking (↑ ↓ →)
- [ ] Rank tracking chart (monthly trends)
- [ ] Target keyword goals / alerts
- [ ] Export rankings to CSV
- [ ] Competitor keyword comparison
