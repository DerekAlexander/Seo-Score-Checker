import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SEO Score Checker
            </div>
            <span className="text-sm text-gray-400">Instant website SEO insights</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <section className="card p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
            SEO Score Checker
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Get a quick snapshot of your website&apos;s SEO health, technical performance,
            and optimization opportunities in one simple report.
          </p>

          <form className="max-w-3xl mx-auto mb-6">
            <label htmlFor="website-url" className="sr-only">
              Website URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="website-url"
                type="url"
                placeholder="https://example.com"
                className="input-field flex-1"
                autoComplete="url"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Analyze Website
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-400">
            Enter any public URL to check SEO score signals like page quality, content clarity,
            and foundational search readiness.
          </p>

          <div className="mt-10 pt-6 border-t border-slate-700">
            <Link href="/sosa-plumber" className="text-blue-400 hover:text-blue-300 transition-colors">
              View sample client dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
