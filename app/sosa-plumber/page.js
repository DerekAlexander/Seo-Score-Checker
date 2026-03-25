'use client'

import { useState, useEffect } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import ScoreCard from '@/components/ScoreCard'
import MetricsGrid from '@/components/MetricsGrid'
import TrendChart from '@/components/TrendChart'
import MonthComparison from '@/components/MonthComparison'
import CompetitorComparison from '@/components/CompetitorComparison'
import EmailReport from '@/components/EmailReport'
import PageSpeedFetcher from '@/components/PageSpeedFetcher'

const CLIENT_ID = 2

export default function SOSAPlumberDashboard() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLoadingPageSpeed, setIsLoadingPageSpeed] = useState(false)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/clients')
        if (!response.ok) throw new Error('Failed to fetch clients')
        
        const data = await response.json()
        const client = data.clients.find(c => c.id === CLIENT_ID)
        
        if (!client) {
          throw new Error('Client not found')
        }
        
        setSelectedClient(client)
      } catch (err) {
        console.error('Error fetching client:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClient()
  }, [])

  const handlePageSpeedFetched = (mobile, desktop) => {
    console.log('PageSpeed scores received:', mobile, desktop)
    setSelectedClient(prev => ({
      ...prev,
      pageSpeedMobile: mobile,
      pageSpeedDesktop: desktop
    }))
    setIsLoadingPageSpeed(false)
  }

  const scoreChange = selectedClient ? selectedClient.currentScore - selectedClient.previousScore : 0

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
            <div className="text-sm text-gray-400">Client Dashboard</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 mb-4">⏳ Loading client data...</p>
            <div className="inline-block animate-spin">⚙️</div>
          </div>
        )}

        {error && (
          <div className="card p-6 border-red-500/50 bg-red-500/10 mb-8">
            <p className="text-red-400">⚠️ Error: {error}</p>
          </div>
        )}

        {!isLoading && selectedClient && (
          <div className="space-y-8">
            {/* Header */}
            <DashboardHeader 
              clientName={selectedClient.name}
              clientUrl={selectedClient.url}
            />

            {/* Main Score Card */}
            <ScoreCard 
              score={selectedClient.currentScore}
              change={scoreChange}
              changePercent={((scoreChange / selectedClient.previousScore) * 100).toFixed(1)}
              competitors={selectedClient.competitors}
            />

            {/* Metrics Grid */}
            <MetricsGrid 
              pageSpeedMobile={selectedClient.pageSpeedMobile}
              pageSpeedDesktop={selectedClient.pageSpeedDesktop}
              organicTraffic={selectedClient.organicTraffic}
              organicTrafficChange={selectedClient.organicTrafficChange}
              topKeywords={selectedClient.topKeywords}
              topKeywordsChange={selectedClient.topKeywordsChange}
              localSEO={selectedClient.localSEO}
              isLoadingPageSpeed={isLoadingPageSpeed}
            />

            {/* PageSpeed Fetcher */}
            <div className="card p-6 text-center">
              <p className="text-gray-400 text-sm mb-4">Get real PageSpeed scores (takes 2-3 minutes):</p>
              <PageSpeedFetcher 
                clientUrl={selectedClient.url}
                onScoresFetched={handlePageSpeedFetched}
                onLoadingChange={setIsLoadingPageSpeed}
              />
            </div>

            {/* Trend Chart */}
            <TrendChart data={selectedClient.trendData} />

            {/* Month Comparison */}
            <MonthComparison 
              currentScore={selectedClient.currentScore}
              previousScore={selectedClient.previousScore}
              change={scoreChange}
            />

            {/* Competitor Comparison */}
            <CompetitorComparison 
              clientScore={selectedClient.currentScore}
              competitors={selectedClient.competitors}
            />

            {/* Email Report Button */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowEmailModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                📧 Email This Report
              </button>
              <button className="btn-ghost">
                📥 Download PDF
              </button>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
              <EmailReport 
                clientName={selectedClient.name}
                onClose={() => setShowEmailModal(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
