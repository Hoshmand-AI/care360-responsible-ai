'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('No account found with this email, or your password is incorrect. Please check your credentials or sign up.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <Link href="/" className="inline-block mb-4">
            <span className="text-3xl font-bold text-teal-600">Care360</span>
            <span className="text-3xl font-normal text-slate-400">.ai</span>
          </Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* OAuth buttons (can be enabled later) */}
          {/* <div className="space-y-3 mb-6">
            <Button variant="secondary" className="w-full" onClick={() => signIn('google')}>
              <GoogleIcon className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => signIn('apple')}>
              <AppleIcon className="w-5 h-5 mr-2" />
              Continue with Apple
            </Button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">or</span>
            </div>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link href="/forgot-password" className="text-teal-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <p className="text-sm text-slate-600 mb-2">New to Care360? You&apos;ll need to create an account first.</p>
            <Link href="/signup" className="inline-block bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-500 transition-colors">
              Create A Free Account
            </Link>
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-400">
            A Hoshmand AI Product
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
