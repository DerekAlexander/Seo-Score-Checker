# SEO Score Checker - Real Data Integration

## Overview

The dashboard now connects to real SEO data through:
- **Python audit script** (`scripts/audit-wrapper.py`) - Analyzes websites and calculates SEO scores
- **Next.js API endpoints** - Fetch and store audit results
- **Local JSON storage** (`data/clients.json`) - Keeps all scores and client data
- **Weekly cron job** - Automatically runs audits every Monday at 9 AM

## Data Flow

```
┌─ Weekly Cron Job (Monday 9 AM)
│
├─→ POST /api/audit
│   ├─→ Reads clients from data/clients.json
│   ├─→ Runs audit-wrapper.py for each client + competitors
│   ├─→ Stores results in data/clients.json
│   └─→ Posts status to Discord
│
└─ Dashboard queries GET /api/clients
   ├─→ Returns formatted client data with trends
   ├─→ Calculates month-over-month changes
   └─→ Displays in UI
```

## Setup

### 1. Install Python Dependencies
```bash
pip install requests beautifulsoup4
```

### 2. Add Your Clients

Edit `data/clients.json` and add your clients:

```json
{
  "clients": [
    {
      "id": 1,
      "name": "Your Client Name",
      "url": "https://client-website.com",
      "competitors": [
        {
          "name": "Competitor 1",
          "url": "https://competitor1.com"
        },
        {
          "name": "Competitor 2",
          "url": "https://competitor2.com"
        },
        {
          "name": "Competitor 3",
          "url": "https://competitor3.com"
        }
      ]
    }
  ],
  "scores": []
}
```

### 3. Run First Audit (Manual)

```bash
# Option A: Via API
curl -X POST http://localhost:3001/api/audit

# Option B: Direct Python script
python scripts/audit-wrapper.py "https://example.com"
```

### 4. Set Up Weekly Cron Job

In OpenClaw HEARTBEAT.md or cron configuration:

```json
{
  "name": "SEO Score Weekly Audit",
  "schedule": "0 9 * * 1",
  "command": "curl -X POST http://localhost:3001/api/audit"
}
```

This runs every **Monday at 9:00 AM CST**.

## What Gets Audited

Each URL is scored on 100 points for:

| Factor | Points | What's Checked |
|--------|--------|---|
| Title Tag | 10 | Exists, 30-60 chars |
| Meta Description | 10 | Exists, 120-160 chars |
| H1 Tags | 15 | Exactly one H1 |
| Heading Structure | 10 | H2/H3 hierarchy |
| Image Alt Text | 15 | Coverage % of images |
| Internal Links | 10 | At least 3 good links |
| Viewport Tag | 10 | Mobile viewport meta |
| Canonical Tag | 5 | Prevents duplicates |
| Page Size | 15 | < 500KB ideal |

## API Endpoints

### GET /api/clients
Returns all clients with latest scores:

```javascript
{
  "clients": [
    {
      "id": 1,
      "name": "Alexander's Roofing",
      "url": "https://...",
      "currentScore": 82,
      "previousScore": 79,
      "pageSpeedMobile": 76,
      "pageSpeedDesktop": 84,
      "organicTraffic": 12450,
      "topKeywords": 7,
      "localSEO": 88,
      "competitors": [
        { "name": "Competitor A", "score": 72, "url": "..." }
      ],
      "trendData": [
        { "month": "Nov", "score": 68 },
        { "month": "Dec", "score": 71 }
      ],
      "lastUpdated": "2026-03-24T21:59:00Z"
    }
  ]
}
```

### POST /api/audit
Runs audits for all clients and competitors:

```javascript
{
  "success": true,
  "scoresAdded": 12,
  "data": [
    {
      "client_id": 1,
      "client_url": "https://...",
      "score": 82,
      "pagespeed_mobile": 76,
      "pagespeed_desktop": 84,
      "local_seo": 88,
      "timestamp": "2026-03-24T21:59:00Z"
    }
  ]
}
```

## Data Storage

All data lives in `data/clients.json`:

- **clients** array: Client info + competitor URLs
- **scores** array: Historical audit results (appended each week)

Structure:
```json
{
  "clients": [...],
  "scores": [
    {
      "client_id": 1,
      "client_url": "https://...",
      "score": 82,
      "timestamp": "2026-03-24T21:59:00Z"
    },
    {
      "client_id": 1,
      "competitor_url": "https://...",
      "competitor_name": "Competitor A",
      "score": 72,
      "timestamp": "2026-03-24T21:59:00Z"
    }
  ]
}
```

## Dashboard Display

The dashboard shows:

1. **Main Score Card**: Current score with month-over-month change
2. **Metrics Grid**: PageSpeed, traffic, keywords, local SEO
3. **Trend Chart**: 12-month score progression (area chart)
4. **Month Comparison**: This month vs last month
5. **Competitor Comparison**: Top 3 competitors with rankings

## Next Steps

### Phase 2 (Enhanced)
- [ ] Pull real PageSpeed data (Google PageSpeed API)
- [ ] Track organic traffic (Google Search Console API)
- [ ] Track keywords ranking (SEO tool API)
- [ ] Integrate backlink data

### Phase 3 (Database)
- [ ] Migrate from JSON to SQLite/PostgreSQL
- [ ] Add admin panel for manual score input
- [ ] Add alert thresholds (notify if score drops >5 pts)
- [ ] Export reports as PDF

### Phase 4 (Client Portal)
- [ ] Shared dashboard links for clients
- [ ] Automated email reports
- [ ] White-label branding

## Troubleshooting

**"Module not found: requests"**
```bash
pip install requests beautifulsoup4
```

**"Cannot reach https://..."**
- Check if URL is accessible
- Some sites may block automated requests
- Add User-Agent header if needed

**Scores always 0**
- Check audit results in `data/clients.json` for errors
- Run manual audit: `python scripts/audit-wrapper.py "https://url.com"`

**Cron not running**
- Verify OpenClaw cron config is deployed
- Check if server is running (npm run dev)

## Files Structure

```
seo-score-checker/
├── app/
│   ├── page.js                 # Dashboard (fetches from API)
│   ├── api/
│   │   ├── clients/route.js    # GET /api/clients
│   │   └── audit/route.js      # POST /api/audit
│   └── ...
├── components/                 # Dashboard components
├── scripts/
│   ├── audit-wrapper.py        # SEO scoring engine
│   └── weekly-audit-cron.json  # Cron config
├── data/
│   └── clients.json            # All client & score data
├── styles/
├── jsconfig.json
├── next.config.js
├── tailwind.config.js
└── package.json
```
