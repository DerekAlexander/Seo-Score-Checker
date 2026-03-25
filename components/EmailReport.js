'use client'

import { useState } from 'react'

export default function EmailReport({ clientName, onClose }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full p-8 border-2 border-blue-500/50">
        <h3 className="text-2xl font-bold text-white mb-2">Email Report</h3>
        <p className="text-gray-400 text-sm mb-6">{clientName} - SEO Dashboard</p>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white font-semibold mb-2">Report Sent!</p>
            <p className="text-gray-400 text-sm">The SEO dashboard has been sent to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="input-field"
                required
              />
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 text-sm text-gray-300">
              <p className="font-semibold text-white mb-2">📧 What's included:</p>
              <ul className="space-y-1">
                <li>✓ Current SEO score & trends</li>
                <li>✓ Month-over-month comparison</li>
                <li>✓ Competitor analysis</li>
                <li>✓ Key metrics & recommendations</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!email || isLoading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
