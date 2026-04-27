import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">About Care360 AI</h1>
          <p className="text-xl text-slate-500">A Hoshmand AI Product</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              Care360 AI exists to make health guidance accessible to everyone — regardless of insurance status, location, or ability to pay. We believe that understanding your symptoms and knowing when to seek care should not be a privilege.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">What We Do</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Care360 AI uses advanced artificial intelligence to help users understand their symptoms, receive general wellness guidance, find nearby care, and make more informed health decisions. Our platform is built on GPT-4o and designed with both accessibility and usability in mind.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We are not a replacement for professional medical care. Care360 AI is a tool to help you navigate your health questions and connect with the right resources.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Built by Hoshmand AI</h2>
            <p className="text-slate-600 leading-relaxed">
              Care360 is developed and maintained by <a href="https://hoshmand.ai" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">Hoshmand AI</a>, a technology company focused on building responsible, accessible AI products that solve real-world problems for real people.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-teal-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
