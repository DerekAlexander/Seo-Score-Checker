import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SEO Score Checker
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <section className="card p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              SEO Score Checker
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Enter your website URL to preview an SEO score analysis experience. The tool highlights
              performance signals and on-page opportunities that can improve search visibility.
            </p>

            <form className="space-y-3">
              <label htmlFor="website-url" className="block text-sm font-medium text-gray-300">
                Website URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="website-url"
                  type="url"
                  className="input-field flex-1"
                  placeholder="https://example.com"
                  autoComplete="url"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Analyze Website
                </button>
              </div>
            </form>

            <div className="mt-8">
              <Link href="/sosa-plumber" className="btn-ghost inline-flex">
                View Example Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
