'use client'

import { useState } from 'react'
import { Search, TrendingUp, BarChart3, Globe } from 'lucide-react'

export default function Home() {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder for future functionality
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            SEO Score Checker
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Get instant insights into your website's search engine optimization performance
          </p>
          <p className="text-gray-400 max-w-xl mx-auto">
            Enter your website URL below to analyze key SEO metrics, performance scores, and get actionable recommendations to improve your rankings.
          </p>
        </div>

        {/* URL Input Card */}
        <div className="card p-8 max-w-3xl mx-auto mb-12 border-2 border-blue-500/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">
                Website URL
              </label>
              <div className="relative">
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="input-field pr-12"
                  required
                />
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
            >
              <Search size={20} />
              Analyze SEO Score
            </button>
          </form>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card p-6 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">Performance Score</h3>
            </div>
            <p className="text-gray-400">
              Get detailed PageSpeed scores for both mobile and desktop to optimize user experience.
            </p>
          </div>

          <div className="card p-6 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <BarChart3 className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">SEO Metrics</h3>
            </div>
            <p className="text-gray-400">
              Track organic traffic, keyword rankings, and local SEO performance over time.
            </p>
          </div>

          <div className="card p-6 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Globe className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">Competitor Analysis</h3>
            </div>
            <p className="text-gray-400">
              Compare your SEO performance against top competitors in your industry.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="card p-8 max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Enter Your URL</h3>
                <p className="text-gray-400">Simply paste your website URL into the input field above.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Analyze Performance</h3>
                <p className="text-gray-400">Our tool scans your site for SEO metrics, performance scores, and technical issues.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Get Your Report</h3>
                <p className="text-gray-400">Receive a comprehensive dashboard with actionable insights and recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
