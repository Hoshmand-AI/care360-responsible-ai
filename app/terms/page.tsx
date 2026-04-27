import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">Terms of Service</h1>
          <p className="text-slate-500">Last updated: March 2025</p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "Acceptance of Terms",
              content: "By using Care360 AI, you agree to these Terms of Service. If you do not agree, please do not use our services."
            },
            {
              title: "Not Medical Advice",
              content: "Care360 AI provides general health information and wellness guidance only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns. In case of emergency, call 911 immediately."
            },
            {
              title: "Eligibility",
              content: "You must be at least 18 years old to create an account. By using Care360 AI, you confirm that you meet this requirement."
            },
            {
              title: "Account Responsibilities",
              content: "You are responsible for maintaining the security of your account and password. You agree to provide accurate information and to keep your account information updated."
            },
            {
              title: "Acceptable Use",
              content: "You agree not to misuse Care360 AI, including attempting to access systems without authorization, entering false health information, or using the service in any way that violates applicable laws."
            },
            {
              title: "Limitation of Liability",
              content: "To the maximum extent permitted by law, Hoshmand AI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of Care360 AI."
            },
            {
              title: "Changes to Terms",
              content: "We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms."
            },
            {
              title: "Contact",
              content: "For questions about these terms, contact us at support@hoshmand.ai."
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
