import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SEO Score Checker
          </div>
          <Link href="/sosa-plumber" className="text-sm text-gray-400 hover:text-gray-300 transition">
            View dashboard example
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <section className="card p-8 md:p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              SEO Score Checker
            </h1>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              Analyze any website URL to preview your SEO health score and uncover the biggest
              opportunities to improve rankings, speed, and visibility.
            </p>

            <div className="mt-8">
              <label htmlFor="website-url" className="block text-sm font-medium text-gray-300 mb-2">
                Website URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="website-url"
                  type="url"
                  placeholder="https://example.com"
                  className="input-field"
                  aria-label="Website URL"
                />
                <button type="button" className="btn-primary sm:shrink-0">
                  Analyze Website
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
