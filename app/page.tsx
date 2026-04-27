import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope, Pill, MapPin, MessageCircle, Shield, ArrowRight, CheckCircle, Eye, Flag, Lock, Phone } from 'lucide-react'

const allFeatures = [
  { icon: Phone, label: 'Emergency Kill Switch', description: 'Emergency symptoms trigger an immediate 911 screen — AI is bypassed entirely.' },
  { icon: Lock, label: 'Consent Gate', description: 'Explicit informed consent required before first use. No data collected without agreement.' },
  { icon: Eye, label: 'AI Disclosure', description: 'Model (GPT-4o), version, and confidence score visible on every output.' },
  { icon: CheckCircle, label: 'Drug Safety Profile', description: 'Bio-Safety Profile gates OTC suggestions and checks drug contraindications.' },
  { icon: Flag, label: 'Human-in-the-Loop', description: 'Flag or report any AI output for human review. All interactions logged.' },
  { icon: Stethoscope, label: 'Doctor Referral Enforced', description: 'AI always defers to licensed healthcare providers. No diagnosis claims made.' },
  { icon: Stethoscope, label: 'Symptom Checker', description: 'Symptom analysis with confidence scores and source citations — not a diagnosis.' },
  { icon: Pill, label: 'Safety-First OTC Navigator', description: 'OTC suggestions cross-referenced against your medications for safety.' },
  { icon: MapPin, label: 'Find Care Nearby', description: 'Locate pharmacies, urgent care, and hospitals near you.' },
  { icon: MessageCircle, label: 'Responsible AI Advisor', description: 'Health chat with guardrails: out-of-scope detection and controlled substance blocks.' },
  { icon: Shield, label: 'NIST AI RMF Aligned', description: 'Govern, Map, Measure, Manage — transparent, accountable, and fair by design.' },
  { icon: Eye, label: 'Full Transparency', description: 'Every AI output shows the model, confidence level, and source citations.' },
]

const stats = [
  { value: '17', label: 'Responsible AI Features' },
  { value: 'NIST', label: 'AI RMF Aligned' },
  { value: 'GPT-4o', label: 'Transparent Model' },
  { value: 'Free', label: 'No Hidden Costs' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-navy-950 leading-tight mb-10">
            Health Guidance You Can Trust
          </h1>

          {/* Dark navy CTA card moved up from bottom */}
          <div className="bg-navy-900 rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-white mb-3">Start With Informed Consent</h2>
            <p className="text-slate-400 mb-8">Care360 requires explicit consent before use — so you always know what you&apos;re agreeing to.</p>
            <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-400 text-base">
              <Link href="/consent">Get Started</Link>
            </Button>
            <p className="mt-4 text-sm text-slate-500">100% free. Your data used only to generate guidance.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(stat => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-bold text-teal-600 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-display text-navy-950 mb-4 whitespace-nowrap">Everything You Need — Responsibly Designed</h2>
            <p className="text-lg text-slate-500">Every feature maps to a responsible innovation principle from Stilgoe/Owen, Jobin et al., Hallamaa, or NIST AI RMF.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{f.label}</h3>
                  <p className="text-sm text-slate-500">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
