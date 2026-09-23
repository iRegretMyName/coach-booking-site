import Link from 'next/link'
import { siteConfig } from '@/app/config/site'

export default function Footer() {
  return <footer className="site-footer">
    <div className="site-footer__top"><div><Link href="/" className="site-footer__brand"><span>INSTA</span>YOG<sup>®</sup></Link><p>A studio for meeting life with more clarity, steadiness and care.</p></div><div className="site-footer__links"><div><b>Explore</b><Link href="/about">About Pragati</Link><Link href="/services">Ways to work together</Link><Link href="/Blog">The Journal</Link></div><div><b>Begin</b><Link href="/book">Book a session</Link><Link href="/resources">Free reflection tool</Link><Link href="/contact">Ask a question</Link></div><div><b>Connect</b><a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a><a href={`mailto:${siteConfig.email}`}>Email the studio ↗</a></div></div></div>
    <div className="site-footer__bottom"><span>© {new Date().getFullYear()} Instayog Studio</span><span>Sessions are a supportive space for reflection and practice; they are not emergency or medical care.</span><span>Privacy · Terms · Booking policy available on request</span></div>
  </footer>
}
