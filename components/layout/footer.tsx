import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Care360</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/about" className="hover:text-teal-600">About</Link></li>
              <li><Link href="/consent" className="hover:text-teal-600">Consent & Privacy</Link></li>
              <li><Link href="/contact" className="hover:text-teal-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/symptoms" className="hover:text-teal-600">Symptom Checker</Link></li>
              <li><Link href="/chat" className="hover:text-teal-600">AI Health Advisor</Link></li>
              <li><Link href="/find-care" className="hover:text-teal-600">Find Care</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-teal-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-600">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-teal-600">Medical Disclaimer</Link></li>
              <li><a href="mailto:support@hoshmand.ai" className="hover:text-teal-600">Data Requests</a></li>
              <li><a href="mailto:support@hoshmand.ai" className="hover:text-teal-600">Report AI Issue</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-400">© 2026 Hoshmand AI</p>
        </div>
      </div>
    </footer>
  )
}
