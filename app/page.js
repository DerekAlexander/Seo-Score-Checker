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
            <Link
              href="/sosa-plumber"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              View sample dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <section className="card p-8 sm:p-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            SEO Score Checker
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-8">
            Analyze your website&apos;s SEO performance in seconds. Enter any URL
            to get an overview of search visibility, technical health, and
            opportunities to improve rankings.
          </p>

          <form className="w-full" aria-label="SEO score checker form">
            <label htmlFor="website-url" className="block text-sm text-gray-300 mb-3">
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
              <button type="button" className="btn-primary sm:px-8 whitespace-nowrap">
                Analyze
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
