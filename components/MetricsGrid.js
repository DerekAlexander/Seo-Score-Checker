'use client'

import { Smartphone, Monitor, Users, Key, MapPin, BarChart3 } from 'lucide-react'

const MetricCard = ({ icon, label, value, change, isPercentage = false, requiresAPI = null, isLoading = false }) => {
  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'
  const changeBg = isPositive ? 'bg-green-500/10' : 'bg-red-500/10'

  // Show real value card if we have a value (even if 0, check !== undefined/null)
  if (value !== undefined && value !== null && value > 0) {
    const isEstimate = label.includes('Estimate')
    return (
      <div className={`card p-6 hover:border-blue-400/50 transition-all duration-200 hover:shadow-lg ${isEstimate ? 'hover:shadow-amber-500/10' : 'hover:shadow-blue-500/10'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isEstimate ? 'bg-amber-500/20 text-amber-300' : `${changeBg} ${changeColor}`}`}>
            {isEstimate ? '📊 Estimate' : `${isPositive ? '↑' : '↓'} ${Math.abs(change || 0)}${isPercentage ? '%' : ''}`}
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        <p className="text-3xl font-bold text-white">{value}{isPercentage ? '%' : ''}</p>
        {isEstimate && <p className="text-gray-500 text-xs mt-2">{requiresAPI}</p>}
      </div>
    )
  }

  // Show on-demand card for PageSpeed
  if (requiresAPI && label.includes('PageSpeed')) {
    return (
      <div className={`card p-6 border-amber-500/30 bg-amber-500/5 ${isLoading ? 'opacity-100 border-blue-500/50 bg-blue-500/5' : 'opacity-60'} hover:border-amber-400/50 transition-all`}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${isLoading ? 'bg-blue-500/20 text-blue-300 animate-pulse' : 'bg-amber-500/20 text-amber-300'}`}>
            {isLoading ? 'Loading...' : 'On-Demand'}
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        <p className="text-amber-300/70 text-xs font-mono">
          {requiresAPI}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Click button below to fetch real scores
        </p>
      </div>
    )
  }

  // Show coming soon for other APIs
  if (requiresAPI) {
    return (
      <div className="card p-6 opacity-60 border-amber-500/30 bg-amber-500/5 hover:border-amber-400/50 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          <div className="px-2 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-300">
            Coming Soon
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        <p className="text-amber-300/70 text-xs font-mono">
          {requiresAPI}
        </p>
      </div>
    )
  }

  return (
    <div className="card p-6 hover:border-blue-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${changeBg} ${changeColor}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}{isPercentage ? '%' : ''}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}{isPercentage ? '%' : ''}</p>
    </div>
  )
}

export default function MetricsGrid({
  pageSpeedMobile,
  pageSpeedDesktop,
  organicTraffic,
  organicTrafficChange,
  topKeywords,
  topKeywordsChange,
  localSEO,
  isLoadingPageSpeed = false
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        icon={<Smartphone size={32} />}
        label="PageSpeed Mobile"
        value={pageSpeedMobile}
        change={0}
        isPercentage={true}
        requiresAPI="Google PageSpeed API"
        isLoading={isLoadingPageSpeed}
      />
      <MetricCard
        icon={<Monitor size={32} />}
        label="PageSpeed Desktop"
        value={pageSpeedDesktop}
        change={0}
        isPercentage={true}
        requiresAPI="Google PageSpeed API"
        isLoading={isLoadingPageSpeed}
      />
      <MetricCard
        icon={<Users size={32} />}
        label="Organic Traffic"
        value={organicTraffic}
        change={organicTrafficChange}
        requiresAPI="Google Search Console API"
      />
      <MetricCard
        icon={<Key size={32} />}
        label="Top 10 Keywords"
        value={topKeywords}
        change={topKeywordsChange}
        requiresAPI="SEO Tool (Ahrefs/SEMrush)"
      />
      <MetricCard
        icon={<MapPin size={32} />}
        label="Local SEO (Estimate)"
        value={localSEO}
        change={0}
        isPercentage={true}
        requiresAPI="Based on site structure (not real ranking data)"
      />
    </div>
  )
}
