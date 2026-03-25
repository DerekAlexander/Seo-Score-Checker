# SEO Score Checker Dashboard

A client-facing SEO dashboard that displays:
- **SEO Scores** with month-over-month trends
- **Top 3 Competitor Scores** for competitive analysis
- **12-Month Trend Chart** showing score progression
- **Key Metrics** (PageSpeed, Organic Traffic, Keywords, Local SEO)
- **Email Report** functionality

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Features

### 🎯 Dashboard
- Client selector dropdown
- Real-time SEO score with animated counter
- Performance trend visualization
- Month-over-month comparison

### 📊 Metrics Grid
- **PageSpeed Mobile** - Mobile performance score
- **PageSpeed Desktop** - Desktop performance score
- **Organic Traffic** - Monthly organic visitors
- **Top 10 Keywords** - Keywords ranking in top 10
- **Local SEO** - Local business metrics

### 📈 Trend Chart
- 12-month area chart with gradient fill
- Interactive tooltips on hover
- Highest/lowest/average score statistics
- Smooth animations

### 👥 Competitor Analysis
- Top 3 competitors with scores
- Ranking medals (🥇🥈🥉)
- Lead/behind metrics
- Competitive insights

### 💾 Export Options
- Email dashboard reports
- PDF download (placeholder)

## Component Structure

```
app/page.js                    # Main dashboard page
├── ClientSelector            # Dropdown to select client
├── DashboardHeader            # Client name & URL
├── ScoreCard                  # Main score display
├── MetricsGrid                # 5 key metrics
├── TrendChart                 # 12-month trend
├── MonthComparison            # Month-over-month view
├── CompetitorComparison       # Top 3 competitors
├── EmailReport                # Email modal
└── Components all in /components/
```

## Mock Data

Currently using mock data in `app/page.js`. To connect to a real API:

1. Replace `mockClients` with API call to fetch client data
2. Update score calculation endpoint
3. Connect to database for historical trends

Example API integration:
```javascript
const [clients, setClients] = useState([])

useEffect(() => {
  fetch('/api/clients')
    .then(res => res.json())
    .then(data => setClients(data))
}, [])
```

## Next Steps

### Phase 1 (MVP - Current)
✅ Dashboard UI/UX  
✅ Mock data integration  
✅ Client selector  
✅ Score display & trends  

### Phase 2 (Backend)
- [ ] Connect to SEO audit API (your Python script)
- [ ] Database schema for score history
- [ ] Real competitor data fetching
- [ ] Email sending integration

### Phase 3 (Admin)
- [ ] Add new client form
- [ ] Manual score input
- [ ] Bulk update scores
- [ ] Report scheduling

### Phase 4 (Pro Features)
- [ ] PDF export with branding
- [ ] Custom date ranges
- [ ] Competitor benchmarking
- [ ] Automated alerts

## Styling

Uses Tailwind CSS with custom component classes in `styles/globals.css`:
- `.card` - Card containers
- `.btn-primary` / `.btn-ghost` - Button variants
- `.input-field` - Input styling
- `.badge` - Status badges

## Deployment

Deploy to Vercel:
```bash
vercel
```

Or build and serve:
```bash
npm run build
npm start
```

## Notes

- Replace mock data with real API calls
- Connect email sending (Gmail API, SendGrid, etc.)
- Add authentication for client access
- Implement admin panel for dashboard management
