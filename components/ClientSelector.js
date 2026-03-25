export default function ClientSelector({ clients, selectedClientId, onClientChange }) {
  return (
    <div className="card p-6 mb-8">
      <div className="flex items-center gap-4">
        <label className="text-gray-300 font-semibold">Select Client:</label>
        <select
          value={selectedClientId || ''}
          onChange={(e) => onClientChange(Number(e.target.value))}
          className="input-field max-w-xs"
        >
          <option value="">Choose a client...</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
