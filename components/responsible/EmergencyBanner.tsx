'use client'
// Roxette's "Kill Switch" — high contrast emergency screen
import { Phone, MapPin } from 'lucide-react'

export function EmergencyBanner() {
  return (
    <div className="fixed inset-0 z-50 bg-red-600 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Phone className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-red-700 mb-3">🚨 EMERGENCY DETECTED</h1>
        <p className="text-slate-700 text-lg mb-6">
          Please stop using this app immediately and call emergency services.
          Your symptoms may require urgent medical attention.
        </p>
        <a
          href="tel:911"
          className="block w-full bg-red-600 text-white text-xl font-bold py-4 rounded-xl mb-4 hover:bg-red-700 transition-colors"
        >
          📞 Call 911 Now
        </a>
        <a
          href="https://www.google.com/maps/search/emergency+room+near+me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-800 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <MapPin className="w-5 h-5" />
          Find Nearest ER
        </a>
        <p className="mt-4 text-xs text-slate-400">
          Care360 AI — Responsible AI Edition · Emergency Protocol Active
        </p>
      </div>
    </div>
  )
}
