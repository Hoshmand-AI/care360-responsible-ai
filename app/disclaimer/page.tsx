import Link from 'next/link'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">Medical Disclaimer</h1>
          <p className="text-slate-500">Last updated: March 2025</p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-red-800 mb-3">⚠️ Important Notice</h2>
          <p className="text-red-700 leading-relaxed font-medium">
            Care360 AI is NOT a medical service. The information provided is for general wellness guidance only and should never replace professional medical advice, diagnosis, or treatment.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: "Not a Medical Device",
              content: "Care360 AI is a consumer software application. It is not an FDA-cleared medical device and has not been evaluated for clinical accuracy."
            },
            {
              title: "No Doctor-Patient Relationship",
              content: "Using Care360 AI does not create a doctor-patient relationship between you and Hoshmand AI or any healthcare provider."
            },
            {
              title: "AI Limitations",
              content: "Our AI systems, while powerful, can make mistakes. Symptom analysis provided by Care360 AI may be incomplete, inaccurate, or not applicable to your specific situation."
            },
            {
              title: "Emergency Situations",
              content: "If you are experiencing a medical emergency, stop using this app and call 911 (or your local emergency number) immediately. Do not rely on Care360 AI in emergency situations."
            },
            {
              title: "Always Consult a Professional",
              content: "Before making any health decisions based on information from Care360 AI, consult with a licensed healthcare professional who can evaluate your specific situation."
            },
            {
              title: "Medication Information",
              content: "OTC medication suggestions provided by Care360 AI are general in nature. Always read medication labels, check for contraindications, and consult a pharmacist or physician before taking any medication."
            }
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-xl p-8 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">{section.title}</h2>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/" className="text-teal-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
