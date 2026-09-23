'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/app/config/site'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/resources', label: 'Free Resources' },
  { href: '/Blog', label: 'Learn' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [isFloating, setIsFloating] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setIsFloating(window.scrollY > 320)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return <nav className={`site-nav ${isFloating ? 'site-nav--floating' : ''}`}>
    <div className="nav-inner">
      <Link href="/" className="nav-brand" onClick={() => setOpen(false)}><span>INSTA</span>YOG<em>®</em></Link>
      <button className="nav-toggle" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}><span /><span /></button>
      <div className={`nav-links ${open ? 'nav-links--open' : ''}`}>
        {links.map((link) => <Link key={link.href} href={link.href} className="nav-link" onClick={() => setOpen(false)}>{link.label}</Link>)}
        <Link href="/book" className="nav-book" onClick={() => setOpen(false)}>Begin your practice <span>↗</span></Link>
        <Link href="/dashboard" className="nav-dashboard" title={`Sign in to ${siteConfig.coachName}'s dashboard`} aria-label="Coach dashboard" onClick={() => setOpen(false)}>✦</Link>
      </div>
    </div>
  </nav>
}
