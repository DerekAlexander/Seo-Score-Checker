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
            <Link href="/sosa-plumber" className="text-sm text-gray-300 hover:text-white transition">
              View sample dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="max-w-3xl mx-auto card p-8 md:p-10">
          <p className="text-sm uppercase tracking-wider text-blue-300 mb-3">
            Website SEO Analysis
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            SEO Score Checker
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Enter your website URL to get a clear snapshot of SEO performance, discover
            high-impact issues, and prioritize fixes that improve rankings.
          </p>

          <form className="space-y-4" aria-label="SEO score checker form">
            <label htmlFor="website-url" className="block text-sm font-medium text-gray-200">
              Website URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="website-url"
                name="website-url"
                type="url"
                className="input-field flex-1"
                placeholder="https://example.com"
                autoComplete="url"
              />
              <button type="button" className="btn-primary whitespace-nowrap">
                Analyze Website
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
