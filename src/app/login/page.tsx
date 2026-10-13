'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, UserCheck, ArrowRight, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('professor@researchhub.demo')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (data.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('An error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { label: 'Professor', email: 'professor@researchhub.demo', role: 'PROFESSOR' },
    { label: 'Student Scholar', email: 'student@researchhub.demo', role: 'STUDENT' },
    { label: 'Principal Scientist', email: 'researcher@researchhub.demo', role: 'RESEARCHER' },
    { label: 'University Admin', email: 'admin@researchhub.demo', role: 'UNIVERSITY_ADMIN' },
    { label: 'Funding Agency', email: 'funding@researchhub.demo', role: 'FUNDING_AGENCY' },
    { label: 'Industry R&D', email: 'industry@researchhub.demo', role: 'INDUSTRY' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xs p-8">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
            R
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ResearchHub Portal</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in with your academic credentials or demo role</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Accounts */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Select Demo Role to Test</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => {
                  setEmail(demo.email)
                  setPassword('password123')
                }}
                className={`text-left px-3 py-2 border rounded-md transition-all ${
                  email === demo.email
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/30'
                }`}
              >
                <span className="block text-xs font-medium">{demo.label}</span>
                <span className="block text-[10px] text-slate-400 truncate">{demo.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Need an account?{' '}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  )
}
