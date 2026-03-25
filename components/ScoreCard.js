'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Check, AlertCircle, X } from 'lucide-react'

export default function ScoreCard({ score, change, changePercent, competitors = [] }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  // Calculate real competition percentage based on actual competitor scores
  const competitorPercentage = (() => {
    if (!competitors || competitors.length === 0) return 0
    const avgCompetitorScore = competitors.reduce((sum, c) => sum + c.score, 0) / competitors.length
    const percentageAbove = ((score - avgCompetitorScore) / avgCompetitorScore) * 100
    return Math.round(percentageAbove)
  })()

  useEffect(() => {
    let start = 0
    const increment = score / 50
    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(start))
      }
    }, 10)
    return () => clearInterval(timer)
  }, [score])

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600'
    if (score >= 60) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getStatusText = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Work'
  }

  const getStatusIcon = (score) => {
    if (score >= 80) return <Check className="inline mr-2 text-green-400" size={20} />
    if (score >= 60) return <AlertCircle className="inline mr-2 text-yellow-400" size={20} />
    return <X className="inline mr-2 text-red-400" size={20} />
  }

  const isPositive = change >= 0

  return (
    <div className="card p-12 border-2 border-blue-500/50 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left: Score Circle */}
        <div className="flex flex-col items-center gap-6">
          <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${getScoreColor(score)} p-1 shadow-2xl`}>
            <div className="absolute inset-1 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white">{animatedScore}</div>
                <div className="text-lg text-gray-300">/100</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{getStatusIcon(score)}{getStatusText(score)}</p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex-1 pl-12">
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Month-over-Month Change</p>
              <div className={`flex items-baseline gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                <span className="text-4xl font-bold">{isPositive ? '+' : ''}{change}</span>
                <span className="text-2xl font-semibold">({changePercent}%)</span>
                {isPositive ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-700">
              <div>
                <p className="text-gray-400 text-sm mb-2">Performance Trend</p>
                <div className="h-12 bg-slate-700/50 rounded-lg flex items-end gap-1 px-3">
                  {[40, 50, 60, 70, 80, 85].map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t opacity-80 hover:opacity-100"
                      style={{ height: `${(val / 100) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">vs Competitors</p>
                <div className="flex items-center gap-3">
                  <div className={`text-3xl font-bold ${competitorPercentage > 0 ? 'text-green-400' : competitorPercentage < 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                    {competitorPercentage > 0 ? '+' : ''}{competitorPercentage}%
                  </div>
                  <p className="text-sm text-gray-400">{competitorPercentage > 0 ? 'Above' : competitorPercentage < 0 ? 'Below' : 'At'} average</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
