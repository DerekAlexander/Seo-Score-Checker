import Link from 'next/link'

const auditChecks = [
  'Title tag and meta description quality',
  'Heading structure (H1-H3) coverage',
  'Image alt attribute completion',
  'Internal linking opportunities',
  'Mobile performance and load speed',
  'Indexability and crawlability basics'
]

const topIssues = [
  {
    issue: 'Meta descriptions missing on 4 pages',
    impact: 'High',
    recommendation: 'Add unique 140-160 character summaries for each key page.'
  },
  {
    issue: 'Largest Contentful Paint is slower on mobile',
    impact: 'High',
    recommendation: 'Compress hero media and defer non-critical scripts.'
  },
  {
    issue: 'Two pages have duplicate H1 headings',
    impact: 'Medium',
    recommendation: 'Use one descriptive H1 per page and move extras to H2.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SEO Score Checker
          </div>
          <div className="flex items-center gap-3">
            <Link href="/alexander-roofing" className="btn-ghost btn-sm">
              Sample Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <section className="text-center space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Check your website SEO health in minutes
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Enter any URL to preview a complete SEO report with performance, technical issues,
            and high-impact recommendations.
          </p>
        </section>

        <section className="card p-6 md:p-8">
          <div className="space-y-4">
            <label htmlFor="website-url" className="text-sm font-medium text-slate-300 block">
              Website URL
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                id="website-url"
                type="url"
                className="input-field"
                placeholder="https://example.com"
                aria-label="Website URL"
              />
              <button type="button" className="btn-primary whitespace-nowrap">
                Run SEO Check
              </button>
            </div>
            <p className="text-xs text-slate-400">
              This is a generic checker interface. Connect your audit API to generate live scores.
            </p>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <article className="card p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">SEO Snapshot</h2>
                <p className="text-slate-400 text-sm">example.com • Last checked just now</p>
              </div>
              <span className="badge-success">Healthy</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <p className="text-slate-400 text-sm">Overall Score</p>
                <p className="text-3xl font-bold text-white mt-2">74/100</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <p className="text-slate-400 text-sm">PageSpeed (Mobile)</p>
                <p className="text-3xl font-bold text-amber-300 mt-2">62</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <p className="text-slate-400 text-sm">Indexable Pages</p>
                <p className="text-3xl font-bold text-white mt-2">38</p>
              </div>
            </div>
          </article>

          <aside className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Checks Included</h3>
            <ul className="space-y-3">
              {auditChecks.map((item) => (
                <li key={item} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-5">Top Recommendations</h2>
          <div className="space-y-4">
            {topIssues.map((item) => (
              <article key={item.issue} className="rounded-lg border border-slate-700 p-4 bg-slate-900/40">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-white font-medium">{item.issue}</h3>
                  <span className={item.impact === 'High' ? 'badge-error' : 'badge-warning'}>
                    {item.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-slate-300">{item.recommendation}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
