'use client'

import { useState } from 'react'

interface Suggestion {
  suggested_prompt: string
  confidence: number
  explanation: string
}

export default function Dashboard() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setSuggestions([])
    setError('')

    try {
      const res = await fetch('/suggest_prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          role: 'guest',
          user_id: 'web-client'
        })
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()
      setSuggestions(data.suggestions || [])
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">🧠 ZeroDev Prompt Tester</h1>

      {/* Prompt input */}
      <div className="space-y-4">
        <textarea
          className="w-full p-3 border rounded text-sm"
          rows={5}
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Thinking...' : 'Send to AI'}
        </button>
      </div>

      {/* Error display */}
      {error && <p className="text-red-600 text-sm mt-2">❌ {error}</p>}

      {/* Suggestion results */}
      {suggestions.length > 0 && (
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-semibold">💡 Suggestions:</h2>
          {suggestions.map((sug, i) => (
            <div key={i} className="border rounded p-3 bg-white shadow-sm">
              <p className="font-medium">👉 {sug.suggested_prompt}</p>
              <p className="text-sm text-muted-foreground mt-1">
                💬 {sug.explanation}
              </p>
              <p className="text-xs text-right text-gray-400">
                Confidence: {Math.round(sug.confidence * 100)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
