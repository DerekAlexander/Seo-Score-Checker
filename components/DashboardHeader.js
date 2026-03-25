export default function DashboardHeader({ clientName, clientUrl }) {
  return (
    <div className="card p-8 border-2 border-blue-500/30">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{clientName}</h1>
          <p className="text-gray-400 break-all">{clientUrl}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 mb-1">Last Updated</p>
          <p className="text-lg font-semibold text-white">
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
