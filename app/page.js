'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export default function HomePage() {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder - will be implemented later
    console.log('Analyzing URL:', url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                📊 SEO Score Checker
              </div>
            </div>
            <div className="text-sm text-gray-400">Free Website Analysis</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            SEO Score Checker
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Get instant insights into your website's SEO performance
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Enter your website URL below to analyze your SEO score, discover issues, 
            and get actionable recommendations to improve your search engine rankings.
          </p>
        </div>

        {/* Input Section */}
        <div className="card p-8 md:p-12 border-2 border-blue-500/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="website-url" className="block text-sm font-medium text-gray-300 mb-3">
                Website URL
              </label>
              <div className="relative">
                <input
                  id="website-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="input-field pr-12"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full text-lg py-4"
            >
              Analyze SEO Score
            </button>
          </form>

          {/* Info Text */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-sm text-gray-400 text-center">
              Analysis typically takes 2-3 minutes and includes performance, mobile-friendliness, 
              content quality, and technical SEO factors.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast Analysis</h3>
            <p className="text-gray-400">
              Get comprehensive SEO insights in minutes
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Detailed Metrics</h3>
            <p className="text-gray-400">
              Track PageSpeed, traffic, keywords, and more
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Actionable Tips</h3>
            <p className="text-gray-400">
              Receive specific recommendations to improve
            </p>
          </div>
        </div>

        {/* What We Analyze Section */}
        <div className="card p-8 mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What We Analyze
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Performance Score</h4>
                <p className="text-sm text-gray-400">Mobile and desktop page speed metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Organic Traffic</h4>
                <p className="text-sm text-gray-400">Monthly visitor trends and growth</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Keyword Rankings</h4>
                <p className="text-sm text-gray-400">Top 10 performing keywords</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Local SEO</h4>
                <p className="text-sm text-gray-400">Local search optimization metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Technical SEO</h4>
                <p className="text-sm text-gray-400">Meta tags, structure, and crawlability</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Competitor Analysis</h4>
                <p className="text-sm text-gray-400">Compare against top competitors</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SEO Score Checker. Free website analysis tool.
          </p>
        </div>
      </footer>
    </div>
  )
}
