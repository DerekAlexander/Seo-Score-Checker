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
              View example dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <section className="card p-8 md:p-12 text-center">
          <p className="text-blue-300 text-sm font-semibold tracking-wide uppercase mb-4">
            Free SEO Website Analysis
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">SEO Score Checker</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Enter your website URL to preview an SEO score check. This tool helps identify overall SEO
            health so you can focus on the fixes that improve rankings and visibility.
          </p>

          <form className="max-w-2xl mx-auto">
            <label htmlFor="website-url" className="sr-only">
              Website URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="website-url"
                type="url"
                placeholder="https://example.com"
                className="input-field flex-1"
              />
              <button type="button" className="btn-primary sm:px-8">
                Analyze Website
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
