import { siteConfig } from '@/app/config/site'

export default function About() {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
      {/* Left: Photo with fade */}
      <div
        style={{
          position: 'relative',
          width: '33%',
          minWidth: '280px',
          flexShrink: 0,
        }}
      >
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
        {/* Fade overlay into beige */}
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

      {/* Right: Text content */}
      <div
        style={{
          flex: 1,
          padding: '5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          maxWidth: '700px',
        }}
      >
        <h1 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', color: '#23395d' }}>
          About Me
        </h1>
        <div
          style={{ fontSize: '1.1rem', color: '#5C6B7A', lineHeight: '1.7' }}
          dangerouslySetInnerHTML={{ __html: siteConfig.aboutText }}
        />
      </div>
    </div>
  )
}