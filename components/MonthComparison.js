export default function MonthComparison({ currentScore, previousScore, change }) {
  const isPositive = change >= 0
  const hasPreviousData = previousScore && previousScore > 0 && previousScore !== currentScore
  const improvementPercent = hasPreviousData ? ((change / previousScore) * 100).toFixed(1) : 0

  if (!hasPreviousData) {
    return (
      <div className="card p-8 border-amber-500/30 bg-amber-500/5">
        <h2 className="text-2xl font-bold text-white mb-6">Period-over-Period Comparison</h2>
        
        <div className="bg-slate-800/50 rounded-lg p-8 text-center border border-amber-500/30">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-amber-300 font-semibold mb-2">Coming Soon</p>
          <p className="text-gray-400 text-sm mb-4">
            Comparison requires at least 2 audit runs to see period-over-period changes.
          </p>
          <div className="bg-slate-700/50 rounded px-4 py-2 inline-block">
            <p className="text-gray-300 text-xs">
              Current audits: <span className="font-bold text-amber-300">1</span> (need 2+)
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-gray-400 text-sm mb-3">💡 Tip: Run the next audit to see your score progress</p>
            <div className="inline-block bg-blue-500/10 border border-blue-500/30 rounded px-4 py-2">
              <p className="text-blue-300 text-xs font-mono">
                POST /api/audit
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Period-over-Period Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Previous Month */}
        <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
          <p className="text-gray-400 text-sm mb-2">Last Month</p>
          <p className="text-4xl font-bold text-gray-300 mb-2">{previousScore}</p>
          <p className="text-gray-500 text-sm">Previous baseline</p>
        </div>

        {/* Arrow & Change */}
        <div className="flex flex-col items-center justify-center">
          <div className={`text-6xl mb-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '📈' : '📉'}
          </div>
          <div className={`text-3xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change}
          </div>
          <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{improvementPercent}% change
          </p>
        </div>

        {/* Current Month */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-6 border-2 border-blue-400/50">
          <p className="text-gray-300 text-sm mb-2">This Month</p>
          <p className="text-4xl font-bold text-blue-300 mb-2">{currentScore}</p>
          <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '✓ On the rise' : '! Needs attention'}
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-300 text-sm font-semibold">✓ Positive Trend</p>
            <p className="text-gray-300 text-sm mt-1">
              {isPositive 
                ? `You've improved ${change} points this month. Keep up the great work!`
                : `There's been a dip this month. Review recent changes and optimize key areas.`
              }
            </p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm font-semibold">📊 Consistency</p>
            <p className="text-gray-300 text-sm mt-1">
              Steady month-to-month progress shows good SEO health. Focus on maintaining improvements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
