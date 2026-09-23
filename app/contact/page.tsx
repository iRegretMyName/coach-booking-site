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

  if (submitted) {
    return (
      <div className="section-page contact-success">
        <p className="eyebrow">MESSAGE RECEIVED</p><h1>Thank you<br />for reaching out.</h1>
        <p>Thanks for the note — I&apos;ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <div className="section-page contact-page"><div><p className="eyebrow">A CONVERSATION STARTS HERE</p><h1>Let&apos;s make<br />a little space.</h1><p className="contact-lede">Have a question before booking? Share what&apos;s on your mind and I&apos;ll be in touch.</p></div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div>
          <label>Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label>Your Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        {errorMsg && <p className="form-error">{errorMsg}</p>}

        <button type="submit">Send your message <span>↗</span></button>
      </form>

      <a
        href={siteConfig.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-link"
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
