'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function TrendChart({ data }) {
  const hasEnoughData = data && data.length >= 4

  if (!hasEnoughData) {
    const dataPoints = data ? data.length : 0
    return (
      <div className="card p-8 border-amber-500/30 bg-amber-500/5">
        <h2 className="text-2xl font-bold text-white mb-4">SEO Score Trend</h2>
        
        <div className="bg-slate-800/50 rounded-lg p-8 text-center border border-amber-500/30">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-amber-300 font-semibold mb-2">Coming Soon</p>
          <p className="text-gray-400 text-sm mb-4">
            Trend data requires at least 4 weeks of audit history.
          </p>
          <div className="bg-slate-700/50 rounded px-4 py-2 inline-block">
            <p className="text-gray-300 text-xs">
              Current data points: <span className="font-bold text-amber-300">{dataPoints}</span> (need 4+)
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-gray-400 text-sm mb-3">💡 Tip: Run audits every week to build your trend history</p>
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

  // Calculate date range for title
  const dateRange = `${data.length} weeks of data`

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-white mb-6">SEO Score Trend ({dateRange})</h2>
      
      <div className="w-full h-96 -mx-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#475569"
              vertical={false}
            />
            <XAxis 
              dataKey="month"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              domain={[0, 100]}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`${value}/100`, 'Score']}
              labelStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)"
              dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 8, fill: '#06b6d4', stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-slate-700">
        <div>
          <p className="text-gray-400 text-sm mb-1">Highest Score</p>
          <p className="text-2xl font-bold text-green-400">{Math.max(...data.map(d => d.score))}/100</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Lowest Score</p>
          <p className="text-2xl font-bold text-red-400">{Math.min(...data.map(d => d.score))}/100</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Average Score</p>
          <p className="text-2xl font-bold text-blue-400">
            {Math.round(data.reduce((a, b) => a + b.score, 0) / data.length)}/100
          </p>
        </div>
      </div>
    </div>
  )
}
