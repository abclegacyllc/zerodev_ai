'use client'

import { useState } from 'react'
import AuroraBackground from './components/AuroraBackground'

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

  // F03: Feedback modal states
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Suggestion | null>(null)
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState('')

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

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setSuggestions(data.suggestions || [])
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuroraBackground />

      <main className="relative z-10 p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white drop-shadow-md">🧠 ZeroDev Prompt Tester</h1>

        {/* Prompt input */}
        <div className="space-y-4">
          <textarea
            className="w-full p-3 border rounded text-sm bg-white/80 backdrop-blur-md shadow-inner focus:ring focus:ring-blue-300"
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
            <h2 className="text-lg font-semibold text-white drop-shadow">💡 Suggestions:</h2>
            {suggestions.map((sug, i) => (
              <div
                key={i}
                className="border rounded p-4 bg-white/80 backdrop-blur-md shadow-lg space-y-2 transition hover:scale-[1.01]"
              >
                <p className="font-medium">👉 {sug.suggested_prompt}</p>
                <p className="text-sm text-muted-foreground mt-1">💬 {sug.explanation}</p>
                <p className="text-xs text-right text-gray-400">
                  Confidence: {Math.round(sug.confidence * 100)}%
                </p>

                {/* F03: Feedback buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    className="text-green-600 hover:scale-110 transition"
                    onClick={() => {
                      setSelectedPrompt(sug)
                      setFeedbackScore(1)
                      setFeedbackOpen(true)
                    }}
                  >
                    👍
                  </button>
                  <button
                    className="text-red-500 hover:scale-110 transition"
                    onClick={() => {
                      setSelectedPrompt(sug)
                      setFeedbackScore(0)
                      setFeedbackOpen(true)
                    }}
                  >
                    👎
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* F03: Feedback modal */}
        {feedbackOpen && selectedPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
              <h3 className="text-lg font-semibold">
                {feedbackScore === 1 ? '👍 You liked this suggestion' : '👎 You disliked this suggestion'}
              </h3>
              <textarea
                rows={3}
                className="w-full border rounded p-2 text-sm"
                placeholder="Add a comment (optional)..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />
              <div className="flex justify-between items-center pt-2">
                <button
                  className="text-gray-500 text-sm"
                  onClick={() => {
                    setFeedbackOpen(false)
                    setFeedbackComment('')
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                  onClick={async () => {
                    setFeedbackStatus('sending')
                    try {
                      const res = await fetch('/feedback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          prompt: selectedPrompt?.suggested_prompt,
                          user_id: 'web-client',
                          score: feedbackScore,
                          comment: feedbackComment
                        })
                      })

                      if (!res.ok) throw new Error('Feedback failed')
                      setFeedbackStatus('sent')
                      setTimeout(() => {
                        setFeedbackOpen(false)
                        setFeedbackComment('')
                        setFeedbackStatus('')
                      }, 1000)
                    } catch {
                      setFeedbackStatus('error')
                    }
                  }}
                >
                  {feedbackStatus === 'sending' ? 'Sending...' : 'Submit Feedback'}
                </button>
              </div>
              {feedbackStatus === 'sent' && <p className="text-green-600 text-sm">✅ Thank you for your feedback!</p>}
              {feedbackStatus === 'error' && <p className="text-red-600 text-sm">❌ Error submitting feedback.</p>}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
