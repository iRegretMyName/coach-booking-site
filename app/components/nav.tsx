'use client'

import { siteConfig } from '@/app/config/site'
import Link from 'next/link'

export default function Nav() {
  const linkStyle = {
    color: '#F7F3EC',
    textDecoration: 'none',
    marginRight: '1.5rem',
    fontSize: '0.95rem',
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 2rem', backgroundColor: '#23395d' }}>
      <Link href="/about" style={{ ...linkStyle, fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '1.2rem', marginRight: 0 }}>
        {siteConfig.coachName}
      </Link>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={linkStyle} className="nav-link">Home</Link>
        <Link href="/about" style={linkStyle} className="nav-link">About</Link>
        <Link href="/services" style={linkStyle} className="nav-link">Services</Link>
        <Link href="/contact" style={linkStyle} className="nav-link">Contact</Link>
        <Link href="/book" style={{ backgroundColor: '#F7F3EC', color: '#23395d', padding: '0.5rem 1.2rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          Book Now
        </Link>
        <Link
          href="/dashboard"
          style={{
            marginLeft: '1rem',
            color: '#8A93A0',
            fontSize: '1.1rem',
            textDecoration: 'none',
          }}
          title="Coach Login"
        >
          ⚙️
        </Link>
      </div>
    </nav>
  )
}