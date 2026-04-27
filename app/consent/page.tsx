'use client'
// Alex/Max — Consent gate before first use
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, Trash2, Lock, CheckCircle } from 'lucide-react'

export default function ConsentPage() {
  const router = useRouter()
  const [checked, setChecked] = useState({
    dataUse: false,
    notMedical: false,
    ageConfirm: false,
  })
  const allChecked = Object.values(checked).every(Boolean)

  const handleAccept = async () => {
    if (!allChecked) return
    // Store consent in localStorage for session
    localStorage.setItem('care360_consent', JSON.stringify({ given: true, at: new Date().toISOString() }))
    // Also save to DB if logged in
    await fetch('/api/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ consent: true }) })
    router.push('/symptoms')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Before You Begin</h1>
          <p className="text-slate-500">Care360 AI is committed to responsible, transparent AI. Please review and accept the following.</p>
        </div>

        {/* What we collect */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-600" /> What We Collect & Why
          </h2>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <p><strong>Health symptoms you enter</strong> — used only to generate AI guidance. Never sold or shared with advertisers.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <p><strong>Optional health profile</strong> (age, sex, allergies, medications) — used to personalize and improve safety of recommendations.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <p><strong>Usage data</strong> — anonymized and used only to improve the service.</p>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-3 border border-amber-100">
              <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
              <p className="text-amber-800"><strong>Note:</strong> Care360 AI is not HIPAA-certified. Do not enter information you wish to keep under HIPAA protection. Use this service for general wellness guidance only.</p>
            </div>
          </div>
        </div>

        {/* AI Disclosure */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-lg">🤖</span> AI Transparency
          </h2>
          <div className="text-sm text-slate-600 space-y-2">
            <p>This app is powered by <strong>GPT-4o (OpenAI)</strong>. AI outputs may contain errors and should not replace professional medical advice.</p>
            <p>Every recommendation includes a <strong>confidence score</strong> and <strong>source citation</strong> so you can evaluate the guidance yourself.</p>
            <p>All AI interactions are logged with a <strong>model version ID</strong> for accountability and review.</p>
          </div>
        </div>

        {/* Your rights */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-teal-600" /> Your Rights
          </h2>
          <div className="text-sm text-slate-600 space-y-2">
            <p>✅ You can <strong>delete all your data</strong> at any time from your profile settings.</p>
            <p>✅ You can <strong>withdraw consent</strong> at any time by contacting support@hoshmand.ai.</p>
            <p>✅ You can <strong>report any AI output</strong> you believe is harmful or incorrect.</p>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={checked.dataUse} onChange={e => setChecked(p => ({...p, dataUse: e.target.checked}))}
              className="mt-0.5 w-4 h-4 text-teal-600 rounded" />
            <span className="text-sm text-slate-700">I understand that Care360 AI will use my entered health data only to generate wellness guidance, and that this data is not sold or shared with advertisers.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={checked.notMedical} onChange={e => setChecked(p => ({...p, notMedical: e.target.checked}))}
              className="mt-0.5 w-4 h-4 text-teal-600 rounded" />
            <span className="text-sm text-slate-700">I understand that Care360 AI is <strong>not a substitute for professional medical advice</strong> and that I should consult a licensed healthcare provider for medical decisions.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={checked.ageConfirm} onChange={e => setChecked(p => ({...p, ageConfirm: e.target.checked}))}
              className="mt-0.5 w-4 h-4 text-teal-600 rounded" />
            <span className="text-sm text-slate-700">I confirm I am 18 years of age or older, or I have parental/guardian consent to use this service.</span>
          </label>
        </div>

        <button
          onClick={handleAccept}
          disabled={!allChecked}
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          I Agree — Take Me to Care360
        </button>
        <p className="text-center text-xs text-slate-400 mt-3">
          <Lock className="w-3 h-3 inline mr-1" />
          Your consent is logged with a timestamp for accountability.
        </p>
      </div>
    </div>
  )
}
