import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SEO Score Checker
            </div>
            <Link
              href="/sosa-plumber"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              View Sample Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <section className="text-center mb-10 md:mb-14">
          <p className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30 mb-6">
            Instant Website SEO Snapshot
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            SEO Score Checker
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Enter any website URL to get a quick SEO quality score and understand where
            improvements can drive better visibility, rankings, and organic traffic.
          </p>
        </section>

        <section className="card p-6 md:p-8 max-w-4xl mx-auto">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label htmlFor="website-url" className="block text-sm font-medium text-gray-300 mb-2">
                Website URL
              </label>
              <input
                id="website-url"
                name="website-url"
                type="url"
                placeholder="https://example.com"
                className="input-field"
                aria-label="Website URL"
              />
            </div>
            <button type="button" className="btn-primary w-full md:w-auto md:min-w-44">
              Analyze Website
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            This is a layout-only preview. Score analysis will be connected in the next step.
          </p>
        </section>

        <section className="max-w-4xl mx-auto mt-10 md:mt-12">
          <div className="card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">What this tool does</h2>
            <p className="text-gray-300 leading-relaxed">
              The SEO Score Checker reviews key signals that influence search performance, such as
              technical health, on-page optimization, and performance factors. You get a clear,
              easy-to-read score that helps prioritize fixes and track progress over time.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
