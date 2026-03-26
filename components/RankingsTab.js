'use client'

import { useState, useEffect } from 'react'

export default function RankingsTab({ clientId, clientUrl }) {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRankings()
  }, [clientId])

  const fetchRankings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/rankings?clientId=${clientId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch rankings')
      }

      const data = await response.json()
      setRankings(data.keywords || [])
      setLastUpdated(new Date(data.timestamp).toLocaleDateString())
    } catch (err) {
      setError(err.message)
      console.error('Ranking fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">🎯 Top Keywords</h2>
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {lastUpdated || 'Never'}
          </p>
        </div>
        <button
          onClick={fetchRankings}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition"
        >
          {loading ? '⏳ Fetching...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="card p-4 border-red-500/50 bg-red-500/10">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
          <p className="text-gray-400 text-xs mt-2">
            Ensure Google Search Console API is enabled and OAuth token is valid.
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="card p-8 text-center">
          <p className="text-gray-400">Connecting to Google Search Console...</p>
          <div className="inline-block animate-spin mt-4 text-2xl">⚙️</div>
        </div>
      )}

      {/* Rankings table */}
      {!loading && rankings.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300">
                    Position
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300">
                    Impressions
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300">
                    CTR
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((kw, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-blue-400">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {kw.keyword}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-sm font-semibold
                        ${parseFloat(kw.avgPosition) <= 10 ? 'bg-green-500/20 text-green-400' :
                          parseFloat(kw.avgPosition) <= 30 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'}
                      `}>
                        {kw.avgPosition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {kw.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {kw.clicks}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {kw.ctr}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700">
            <p className="text-xs text-gray-400">
              📊 Data from last 30 days • {rankings.length} keywords tracked
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && rankings.length === 0 && !error && (
        <div className="card p-8 text-center">
          <p className="text-gray-400">No keyword data available yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Click "Refresh" to fetch data from Google Search Console
          </p>
        </div>
      )}
    </div>
  )
}
