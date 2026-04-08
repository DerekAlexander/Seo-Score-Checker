import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SEO Score Checker
            </h1>
            <Link
              href="/sosa-plumber"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              View Sample Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <section className="text-center mb-10">
          <p className="text-blue-300 font-medium tracking-wide mb-4">Website SEO Analysis</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">SEO Score Checker</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Enter your website URL to get a clear SEO score, surface technical issues, and
            understand where to focus next for better search visibility.
          </p>
        </section>

        <section className="card p-6 md:p-8">
          <div className="space-y-4">
            <label htmlFor="website-url" className="block text-sm font-medium text-gray-300">
              Website URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="website-url"
                name="website-url"
                type="url"
                placeholder="https://example.com"
                className="input-field flex-1"
              />
              <button type="button" className="btn-primary whitespace-nowrap">
                Analyze Website
              </button>
            </div>
            <p className="text-sm text-gray-400">
              This tool checks core SEO signals like technical health, page speed, content quality,
              and ranking opportunities to help you improve organic performance.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
