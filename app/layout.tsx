import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { Providers } from '@/components/providers'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import './globals.css'

// Hoshmand AI Typography System
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Care360 AI — Your Health, Simplified',
  description: 'AI-powered health guidance that helps you understand symptoms, find care, and make informed decisions. A Hoshmand AI Product.',
  keywords: ['health', 'symptoms', 'AI', 'healthcare', 'pharmacy finder', 'medical advice'],
  authors: [{ name: 'Hoshmand AI' }],
  openGraph: {
    title: 'Care360 AI — Your Health, Simplified',
    description: 'AI-powered health guidance that helps you understand symptoms, find care, and make informed decisions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Care360 AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care360 AI — Your Health, Simplified',
    description: 'AI-powered health guidance from Hoshmand AI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
