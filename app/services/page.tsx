import { supabase } from '@/lib/supabase'
import ScrollReveal from '@/app/components/ScrollReveal'
import Link from 'next/link'

type Service = {
  id: number
  name: string
  description: string
  duration_minutes: number
  price: number
}

export default async function ServicesPage() {
  const { data: services, error } = await supabase
    .from('services')
    .select('*')

  if (error) {
    return <div style={{ padding: '2rem' }}>Error loading services: {error.message}</div>
  }

  return (
    <ScrollReveal>
      <div style={{ padding: '5rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '2rem', color: '#1E2A3A' }}>
          Our Services
        </h1>
        {services.map((service: Service) => (
          <Link
            key={service.id}
            href={`/book?service=${service.id}`}
            className="service-card"
            style={{
              display: 'block',
              marginBottom: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E0D9C9',
              borderRadius: '8px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#1E2A3A' }}>
              {service.name}
            </h2>
            <p style={{ color: '#5C6B7A', marginBottom: '0.75rem' }}>{service.description}</p>
            <p style={{ color: '#1E2A3A', fontWeight: 600 }}>
              {service.duration_minutes} minutes — ${service.price}
            </p>
          </Link>
        ))}
      </div>
    </ScrollReveal>
  )
}