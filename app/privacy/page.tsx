import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: March 2025</p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "Information We Collect",
              content: "We collect information you provide directly, including your name, email address, and health information you enter when using our symptom checker or AI advisor. We also collect usage data such as pages visited and features used."
            },
            {
              title: "How We Use Your Information",
              content: "We use your information to provide and improve Care360 AI services, personalize your experience, and communicate with you about your account. We use health data you enter solely to provide AI-powered guidance within the app."
            },
            {
              title: "Data Storage and Security",
              content: "Your data is stored securely using industry-standard encryption. We use Neon PostgreSQL for database storage and implement appropriate technical and organizational measures to protect your personal information."
            },
            {
              title: "Data Sharing",
              content: "We do not sell your personal information to third parties. We do not share your health data with advertisers. We may share data with service providers who help us operate Care360 AI, subject to confidentiality agreements."
            },
            {
              title: "Your Rights",
              content: "You have the right to access, correct, or delete your personal data. You can request a copy of your data or ask us to delete your account by contacting support@hoshmand.ai."
            },
            {
              title: "Cookies",
              content: "We use essential cookies to keep you signed in and remember your preferences. We do not use advertising cookies or track you across other websites."
            },
            {
              title: "Contact",
              content: "For privacy-related questions, contact us at support@hoshmand.ai or visit our Contact page."
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
