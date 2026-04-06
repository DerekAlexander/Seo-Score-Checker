import Link from 'next/link'

const featureCards = [
  {
    title: 'SEO Score',
    value: '82/100',
    status: '+6.4%',
    tone: 'text-green-300'
  },
  {
    title: 'Page Speed',
    value: '91',
    status: 'Desktop',
    tone: 'text-blue-300'
  },
  {
    title: 'Core Web Vitals',
    value: 'Good',
    status: 'LCP 2.1s',
    tone: 'text-cyan-300'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SEO Score Checker
          </div>
          <div className="text-sm text-slate-400">Instant Website Analysis</div>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12">
        <section className="card border border-blue-500/20 p-8 md:p-10">
          <div className="mx-auto max-w-4xl space-y-7 text-center">
            <p className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-200">
              Free SEO Audit Dashboard Preview
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Check Your Website SEO Score in Seconds
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Enter your website URL to preview key SEO insights, technical health, and performance signals in one place.
            </p>

            <form className="mx-auto w-full max-w-3xl">
              <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3 sm:flex-row sm:items-center">
                <label htmlFor="website-url" className="sr-only">
                  Website URL
                </label>
                <input
                  id="website-url"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="input-field h-12 flex-1 border-slate-600 bg-slate-800/90"
                />
                <button type="button" className="btn-primary h-12 w-full sm:w-auto sm:px-8">
                  Check SEO Score
                </button>
              </div>
            </form>

            <p className="text-sm text-slate-400">
              Layout preview only — URL submission will be wired in next step.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="card p-6">
              <p className="text-sm text-slate-400">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
              <p className={`mt-2 text-sm font-medium ${card.tone}`}>{card.status}</p>
            </article>
          ))}
        </section>

        <section className="card p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Need a client dashboard example?</h2>
              <p className="mt-2 text-slate-300">
                View a sample report layout inspired by the same SEO checker interface design.
              </p>
            </div>
            <Link
              href="/sosa-plumber"
              className="btn-ghost inline-flex items-center justify-center border border-slate-600 text-sm"
            >
              Open Sample Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
