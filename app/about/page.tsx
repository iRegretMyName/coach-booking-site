import { siteConfig } from '@/app/config/site'

export default function About() {
  return (
    <div className="about-layout">
      {/* Desktop: full-height side photo */}
      <div className="about-photo-wrap">
        <img
          src="/about-photo.jpeg"
          alt={siteConfig.coachName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(245,237,220,0), rgba(245,237,220,1))',
          }}
        />
      </div>

      {/* Mobile: circular photo with accent blob */}
      <div className="about-mobile-photo">
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
          <div
            style={{
              position: 'absolute',
              width: '160px',
              height: '160px',
              backgroundColor: '#3611d2',
              opacity: 0.15,
              borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
              top: '8px',
              left: '8px',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #FFFFFF',
              boxShadow: '0 8px 20px rgba(30, 42, 58, 0.15)',
            }}
          >
            <img
              src="/about-photo.jpeg"
              alt={siteConfig.coachName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <div
        className="about-text-wrap"
        style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#5C6B7A' }}
      >
        <h1 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', color: '#1E2A3A' }}>
          About Me
        </h1>
        <div dangerouslySetInnerHTML={{ __html: siteConfig.aboutText }} />
      </div>
    </div>
  )
}