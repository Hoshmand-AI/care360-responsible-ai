import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">Contact Us</h1>
          <p className="text-xl text-slate-500">We&apos;d love to hear from you</p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Get In Touch</h2>
              <p className="text-slate-500 text-sm">For all inquiries — support, privacy, data requests, and AI issue reports</p>
            </div>
          </div>
          <a href="mailto:support@hoshmand.ai"
            className="inline-block bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-500 transition-colors">
            support@hoshmand.ai
          </a>
        </div>

        <div className="bg-slate-100 rounded-xl p-6 text-sm text-slate-500 space-y-2">
          <p>🔒 <strong>Data deletion requests</strong> — email us at support@hoshmand.ai with subject "Delete My Data"</p>
          <p>🚩 <strong>Report an AI issue</strong> — email us at support@hoshmand.ai with subject "AI Issue Report"</p>
          <p>⚕️ <strong>Medical concerns</strong> — always contact a licensed healthcare provider directly</p>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-teal-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
