'use client'

import { siteConfig } from '@/app/config/site'
import { useState } from 'react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name || !email || !message) {
      setErrorMsg('Please fill in all fields.')
      return
    }

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })

    const result = await response.json()

    if (!response.ok) {
      setErrorMsg('Something went wrong: ' + result.error)
      return
    }

    setSubmitted(true)
  }

  const inputStyle = {
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid #E0D9C9',
    backgroundColor: '#FFFFFF',
    color: '#23395d',
    width: '100%',
  }

  if (submitted) {
    return (
      <div style={{ padding: '5rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ color: '#23395d' }}>Message Sent!</h1>
        <p style={{ color: '#5C6B7A' }}>Thanks for reaching out — I'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '5rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: '#23395d' }}>Get in Touch</h1>
      <p style={{ fontSize: '1.1rem', color: '#5C6B7A', marginBottom: '1.5rem' }}>
        Have a question before booking? Send a message below.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#23395d', fontWeight: 500 }}>Your Name</label><br />
          <input style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#23395d', fontWeight: 500 }}>Your Email</label><br />
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#23395d', fontWeight: 500 }}>Message</label><br />
          <textarea style={{ ...inputStyle, minHeight: '120px' }} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        {errorMsg && <p style={{ color: '#B33A3A' }}>{errorMsg}</p>}

        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#23395d',
            color: '#F5EDDC',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Send Message
        </button>
      </form>

      <a
        
  
  href={siteConfig.instagramUrl}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
    color: '#5C6B7A',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    border: '1px solid #E0D9C9',
    borderRadius: '999px',
    backgroundColor: '#FFFFFF',
    width: 'fit-content',
  }}
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FED576" />
        <stop offset="26%" stopColor="#F47133" />
        <stop offset="61%" stopColor="#BC3081" />
        <stop offset="100%" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#igGradient)" strokeWidth="2" />
    <circle cx="12" cy="12" r="4.5" stroke="url(#igGradient)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="url(#igGradient)" />
  </svg>
  @{siteConfig.instagramHandle}
</a>
    </div>
  )
}