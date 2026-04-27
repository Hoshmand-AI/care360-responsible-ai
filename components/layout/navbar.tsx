'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '/symptoms', label: 'Symptom Checker' },
  { href: '/chat', label: 'AI Advisor' },
  { href: '/find-care', label: 'Find Care' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top banner */}
      <div className="bg-teal-600 text-white text-xs text-center py-1.5 px-4">
        Powered by GPT-4o · Not a medical diagnosis · General Wellness Guidance · Licensed Healthcare Oversight Required
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-teal-600">Care360</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-teal-600 border-b-2 border-teal-600 pb-0.5' : 'text-slate-600 hover:text-teal-600'}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-teal-600 font-medium">Dashboard</Link>
              <button onClick={() => signOut()} className="text-sm text-slate-500 hover:text-slate-700">Sign Out</button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/login">Sign In</Link></Button>
              <Button asChild size="sm"><Link href="/consent">Get Started</Link></Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${pathname === link.href ? 'text-teal-600' : 'text-slate-600'}`}>
              {link.label}
            </Link>
          ))}
          {session ? (
            <button onClick={() => signOut()} className="block text-sm text-slate-500 py-2">Sign Out</button>
          ) : (
            <Link href="/consent" onClick={() => setMobileOpen(false)} className="block bg-teal-600 text-white text-sm font-semibold text-center py-2.5 rounded-lg">Get Started</Link>
          )}
        </div>
      )}
    </header>
  )
}
