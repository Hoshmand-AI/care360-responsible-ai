'use client'
// Alex/Max accountability — flag/report button on every AI output
import { useState } from 'react'
import { Flag, ThumbsUp, ThumbsDown, X, CheckCircle } from 'lucide-react'

interface FeedbackWidgetProps {
  page: string
  sessionId?: string
}

export function FeedbackWidget({ page, sessionId }: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [quickFeedback, setQuickFeedback] = useState<'up' | 'down' | null>(null)

  const handleQuickFeedback = async (value: 'up' | 'down') => {
    setQuickFeedback(value)
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: value === 'up' ? 'helpful' : 'not_helpful', page, sessionId, description: '' }),
    })
  }

  const handleSubmit = async () => {
    if (!type) return
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, page, sessionId, description }),
    })
    setSubmitted(true)
    setTimeout(() => { setOpen(false); setSubmitted(false); setType(''); setDescription('') }, 2000)
  }

  return (
    <div className="flex items-center gap-3">
      {/* Quick thumbs */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-400 mr-1">Was this helpful?</span>
        <button
          onClick={() => handleQuickFeedback('up')}
          className={`p-1.5 rounded-lg transition-colors ${quickFeedback === 'up' ? 'bg-green-100 text-green-600' : 'hover:bg-slate-100 text-slate-400'}`}
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleQuickFeedback('down')}
          className={`p-1.5 rounded-lg transition-colors ${quickFeedback === 'down' ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100 text-slate-400'}`}
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>

      {/* Report button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
      >
        <Flag className="w-3.5 h-3.5" />
        Report Issue
      </button>

      {/* Report Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Report an Issue</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-slate-800">Thank you for your feedback</p>
                <p className="text-sm text-slate-500 mt-1">Our team will review this report.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-4">
                  Help us improve Care360 by reporting inaccurate or harmful AI outputs. 
                  Your report is logged for human review (NIST AI RMF accountability).
                </p>
                <div className="space-y-3 mb-4">
                  {[
                    { value: 'incorrect_result', label: 'Incorrect or inaccurate result' },
                    { value: 'harmful_content', label: 'Potentially harmful recommendation' },
                    { value: 'out_of_scope', label: 'Response was off-topic' },
                    { value: 'bias_concern', label: 'Possible bias or unfairness' },
                    { value: 'other', label: 'Other issue' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={opt.value}
                        checked={type === opt.value}
                        onChange={e => setType(e.target.value)}
                        className="text-teal-600"
                      />
                      <span className="text-sm text-slate-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional: describe the issue in more detail..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:border-teal-500 mb-4"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!type}
                  className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-lg hover:bg-teal-500 disabled:opacity-50 transition-colors"
                >
                  Submit Report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
