'use client'

import { useState, useEffect } from 'react'
import DashboardContent from './DashboardContent'

export default function DashboardPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('dashboard_auth')
    if (stored === 'true') setAuthenticated(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    const response = await fetch('/api/dashboard-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      sessionStorage.setItem('dashboard_auth', 'true')
      setAuthenticated(true)
    } else {
      setErrorMsg('Incorrect password.')
    }
  }

  if (authenticated) {
    return <DashboardContent />
  }

  return (
    <div style={{ padding: '5rem 2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#3611d2' }}>
        Coach Login
      </h1>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '0.6rem',
            borderRadius: '4px',
            border: '1px solid #E0D9C9',
            backgroundColor: '#FFFFFF',
            color: '#3611d2',
            width: '100%',
            marginBottom: '1rem',
          }}
        />
        {errorMsg && <p style={{ color: '#B33A3A', marginBottom: '1rem' }}>{errorMsg}</p>}
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3611d2',
            color: '#F5EDDC',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Log In
        </button>
      </form>
    </div>
  )
}