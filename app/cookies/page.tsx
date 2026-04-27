import Link from 'next/link'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">Cookie Policy</h1>
          <p className="text-slate-500">Last updated: March 2025</p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "What Are Cookies",
              content: "Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, such as whether you are logged in."
            },
            {
              title: "Cookies We Use",
              content: "Care360 AI uses only essential cookies required for the service to function. These include session cookies that keep you signed in and security cookies that protect your account."
            },
            {
              title: "No Advertising Cookies",
              content: "We do not use advertising cookies, tracking pixels, or any technology that tracks you across other websites. We do not share cookie data with advertisers."
            },
            {
              title: "Third-Party Cookies",
              content: "We use NextAuth.js for authentication, which sets session cookies. We do not integrate third-party advertising or analytics services that set their own cookies."
            },
            {
              title: "Managing Cookies",
              content: "You can control cookies through your browser settings. Note that disabling essential cookies may prevent you from signing in or using certain features of Care360 AI."
            },
            {
              title: "Contact",
              content: "For questions about our cookie practices, contact us at support@hoshmand.ai."
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
