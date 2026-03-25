'use client'

import { useState } from 'react'

export default function PageSpeedFetcher({ clientUrl, onScoresFetched, onLoadingChange }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFetch = async () => {
    setIsLoading(true)
    onLoadingChange?.(true)
    setError(null)

    try {
      console.log('Fetching PageSpeed for:', clientUrl)
      const response = await fetch(`/api/pagespeed?url=${encodeURIComponent(clientUrl)}`)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to fetch PageSpeed data')
      }
      
      const data = await response.json()
      console.log('PageSpeed data received:', data)
      onScoresFetched(data.mobile, data.desktop)
      onLoadingChange?.(false)
    } catch (err) {
      console.error('PageSpeed error:', err)
      setError(err.message)
      onLoadingChange?.(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFetch}
      disabled={isLoading}
      className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
        isLoading
          ? 'bg-blue-600/50 text-white cursor-wait'
          : 'btn-primary'
      }`}
    >
      {isLoading ? '⏳ Fetching PageSpeed...' : '⚡ Get Real PageSpeed Scores'}
    </button>
  )
}
