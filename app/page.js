'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Client slug mappings
const clientSlugs = {
  1: 'alexander-roofing',
  2: 'sosa-plumber'
}

export default function DashboardPage() {
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/clients')
        if (!response.ok) throw new Error('Failed to fetch clients')
        
        const data = await response.json()
        setClients(data.clients)
      } catch (err) {
        console.error('Error fetching clients:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

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
            <div className="text-sm text-gray-400">Dashboard</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 mb-4">⏳ Loading clients...</p>
            <div className="inline-block animate-spin">⚙️</div>
          </div>
        )}

        {error && (
          <div className="card p-6 border-red-500/50 bg-red-500/10">
            <p className="text-red-400">⚠️ Error: {error}</p>
            <p className="text-gray-400 text-sm mt-2">Make sure the API is running and clients are configured.</p>
          </div>
        )}

        {!isLoading && clients.length > 0 && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Select a Client</h1>
              <p className="text-gray-400">Each client has an isolated dashboard view with no data sharing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((client) => {
                const slug = clientSlugs[client.id]
                const scoreChange = client.currentScore - client.previousScore
                const scoreChangePercent = client.previousScore > 0 
                  ? ((scoreChange / client.previousScore) * 100).toFixed(1)
                  : 0

                return (
                  <Link 
                    key={client.id} 
                    href={`/${slug}`}
                    className="group"
                  >
                    <div className="card p-8 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer h-full transform hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition">
                            {client.name}
                          </h2>
                          <p className="text-sm text-gray-400 mt-1">{client.url}</p>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {client.currentScore}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-6">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          scoreChange >= 0 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {scoreChange >= 0 ? '↑' : '↓'} {Math.abs(scoreChange)} ({scoreChangePercent}%)
                        </span>
                      </div>

                      <div className="mt-6 text-sm text-gray-400">
                        📊 {client.competitors?.length || 0} competitors tracked
                      </div>

                      <div className="mt-4 text-blue-400 group-hover:text-blue-300 transition font-semibold">
                        View Dashboard →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {!isLoading && clients.length === 0 && !error && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 mb-4">📭 No clients found</p>
            <p className="text-gray-500 text-sm">Add clients to data/clients.json to get started</p>
          </div>
        )}
      </main>
    </div>
  )
}
