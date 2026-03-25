'use client'

export default function CompetitorComparison({ clientScore, competitors }) {
  const sortedCompetitors = [...competitors].sort((a, b) => b.score - a.score)
  const averageCompetitorScore = (sortedCompetitors.reduce((a, b) => a + b.score, 0) / sortedCompetitors.length).toFixed(1)
  const leadDiff = clientScore - averageCompetitorScore

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-600 to-orange-700'
    return 'from-blue-500 to-blue-700'
  }

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return '📍'
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Top 3 Competitors</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Your Score */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 border-2 border-blue-400">
          <p className="text-gray-200 text-sm mb-2">YOUR SCORE</p>
          <p className="text-5xl font-bold text-white mb-2">{clientScore}</p>
          <p className="text-blue-200 text-sm mb-4">
            {leadDiff > 0 ? `+${leadDiff.toFixed(1)}` : leadDiff.toFixed(1)} vs competitors
          </p>
          <div className={`text-sm font-semibold ${leadDiff > 0 ? 'text-green-300' : 'text-yellow-300'}`}>
            {leadDiff > 0 ? '📈 Leading' : '⚠️ Behind'}
          </div>
        </div>

        {/* Competitors */}
        {sortedCompetitors.map((competitor, index) => {
          const rank = index + 1
          const diff = clientScore - competitor.score
          const isAhead = diff > 0

          return (
            <div key={competitor.name} className="card p-6 hover:border-slate-500 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={`text-3xl`}>
                  {getRankMedal(rank)}
                </div>
                <div>
                  <p className="text-gray-400 text-xs">RANK #{rank}</p>
                  <p className={`text-sm font-semibold ${isAhead ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isAhead ? `+${diff}` : `-${Math.abs(diff)}`}
                  </p>
                </div>
              </div>

              <p className="text-white font-semibold mb-1 truncate">{competitor.name}</p>
              <p className="text-gray-400 text-xs mb-3 truncate">{competitor.url}</p>

              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-gray-300">{competitor.score}</p>
                  <p className="text-gray-500 text-sm">/100</p>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getRankColor(rank)}`}
                    style={{ width: `${(competitor.score / 100) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm font-semibold">👑 Market Position</p>
          <p className="text-gray-300 text-sm mt-1">
            {clientScore > averageCompetitorScore 
              ? `You're ahead of the competition by ${leadDiff.toFixed(1)} points.`
              : `Competitors are averaging ${averageCompetitorScore}. Focus on gaps to close the lead.`
            }
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 text-sm font-semibold">🎯 Opportunity</p>
          <p className="text-gray-300 text-sm mt-1">
            Target the top competitor's weak areas: keywords, backlinks, and technical SEO.
          </p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-300 text-sm font-semibold">📢 Strategy</p>
          <p className="text-gray-300 text-sm mt-1">
            Maintain your lead by consistently improving. +5 pts/month compounds quickly.
          </p>
        </div>
      </div>
    </div>
  )
}
