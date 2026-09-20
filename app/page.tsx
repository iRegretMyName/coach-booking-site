import { siteConfig } from '@/app/config/site'
import ScrollReveal from '@/app/components/ScrollReveal'

export default function Home() {
  return (
    <div
      style={{
        padding: '5rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '3rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Left: Text */}
      <div style={{ flex: '1 1 400px' }}>
        <ScrollReveal>
          <h1 style={{ fontSize: '2.75rem', marginBottom: '1.2rem', color: '#1E2A3A' }}>
            Hi, I'm {siteConfig.coachName}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#5C6B7A', marginBottom: '2rem', lineHeight: '1.6' }}>
            {siteConfig.tagline} {siteConfig.heroIntro}
          </p>
          <a
            href="/book"
            style={{
              display: 'inline-block',
              backgroundColor: '#1E2A3A',
              color: '#F7F3EC',
              padding: '0.85rem 1.75rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Book a Session
          </a>
        </ScrollReveal>
      </div>

      {/* Right: Photo with accent shape */}
      <div
        style={{
          flex: '1 1 280px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Accent shape behind photo */}
        <div
          style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            backgroundColor: '#3611d2',
            opacity: 0.15,
            borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
            top: '10px',
            left: '10px',
          }}
        />

        {/* Photo */}
        <div
          className="floating-photo"
          style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
            overflow: 'hidden',
            border: '4px solid #FFFFFF',
            boxShadow: '0 10px 30px rgba(30, 42, 58, 0.15)',
          }}
        >
          <img
            src="/about-photo.jpeg"
            alt={siteConfig.coachName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </div>
  )
}