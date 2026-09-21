'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DatePicker from '@/app/components/DatePicker'

type Service = {
  id: number
  name: string
  duration_minutes: number
  price: number
}

function BookForm() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*')
      if (data) {
        setServices(data)
        const preselectedId = searchParams.get('service')
        if (preselectedId) {
          setSelectedService(Number(preselectedId))
        }
      }
    }
    fetchServices()
  }, [searchParams])

  useEffect(() => {
    const isCompleteDate = /^\d{4}-\d{2}-\d{2}$/.test(date)

    if (!isCompleteDate) {
      setAvailableSlots([])
      setTime('')
      return
    }

    let cancelled = false

    const fetchAvailability = async () => {
      setLoadingSlots(true)
      setTime('')
      setAvailableSlots([])

      const dayOfWeek = new Date(date + 'T00:00:00').getDay()

      const { data: availabilityRows } = await supabase
        .from('availability')
        .select('*')
        .eq('day_of_week', dayOfWeek)

      if (cancelled) return

      if (!availabilityRows || availabilityRows.length === 0) {
        setAvailableSlots([])
        setLoadingSlots(false)
        return
      }

      const slots: string[] = []
      availabilityRows.forEach((row) => {
        const [startH, startM] = row.start_time.split(':').map(Number)
        const [endH, endM] = row.end_time.split(':').map(Number)

        let current = startH * 60 + startM
        const end = endH * 60 + endM

        while (current < end) {
          const h = Math.floor(current / 60)
          const m = current % 60
          const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          slots.push(formatted)
          current += 30
        }
      })

      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', date)

      if (cancelled) return

      const bookedTimes = (existingBookings || []).map((b) =>
        b.booking_time.slice(0, 5)
      )

      const openSlots = slots.filter((slot) => !bookedTimes.includes(slot))

      setAvailableSlots(openSlots)
      setLoadingSlots(false)
    }

    fetchAvailability()

    return () => {
      cancelled = true
    }
  }, [date])

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!selectedService || !date || !time || !name || !email) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@example.com).')
      return
    }

    const selectedServiceObj = services.find((s) => s.id === selectedService)

    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: selectedService,
        serviceName: selectedServiceObj?.name || '',
        date,
        time,
        name,
        email,
        notes,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setErrorMsg('Something went wrong: ' + result.error)
      return
    }

    setSubmitted(true)
  }

  const inputStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #E0D9C9',
    backgroundColor: '#FFFFFF',
    color: '#1E2A3A',
    width: '100%',
  }

  if (submitted) {
    const confettiEmojis = ['🎉', '✨', '🎊', '⭐']
    return (
      <div style={{ padding: '5rem 2rem', maxWidth: '500px', margin: '0 auto', color: '#1E2A3A', position: 'relative', overflow: 'hidden' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            {confettiEmojis[i % confettiEmojis.length]}
          </span>
        ))}
        <h1>Booking Confirmed! 🎉</h1>
        <p style={{ color: '#5C6B7A', marginBottom: '2rem' }}>
          We've received your booking. You'll get a confirmation shortly.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#1E2A3A',
              color: '#F5EDDC',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Back to Home
          </a>

          <a
            href="/services"
            style={{
              display: 'inline-block',
              backgroundColor: '#FFFFFF',
              color: '#1E2A3A',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '1px solid #E0D9C9',
            }}
          >
            View Services
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '5rem 2rem', maxWidth: '500px', margin: '0 auto', color: '#1E2A3A' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '1.5rem' }}>Book a Session</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#1E2A3A', fontWeight: 500 }}>Service</label><br />
          <select
            style={inputStyle}
            value={selectedService ?? ''}
            onChange={(e) => setSelectedService(Number(e.target.value))}
          >
            <option value="">-- Select a service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.duration_minutes} min - ${s.price})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#1E2A3A', fontWeight: 500 }}>Date</label><br />
          <DatePicker value={date} onChange={setDate} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#1E2A3A', fontWeight: 500 }}>Time</label><br />
          {loadingSlots && <p style={{ color: '#5C6B7A' }}>Loading available times...</p>}
          {!loadingSlots && date && availableSlots.length === 0 && (
            <p style={{ color: '#5C6B7A' }}>No available slots on this date.</p>
          )}
          {!loadingSlots && availableSlots.length > 0 && (
            <select style={inputStyle} value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">-- Select a time --</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#1E2A3A', fontWeight: 500 }}>Your Name</label><br />
          <input
            style={inputStyle}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#1E2A3A', fontWeight: 500 }}>Your Email</label><br />
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#1E2A3A', fontWeight: 500 }}>Notes (optional)</label><br />
          <textarea
            style={inputStyle}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {errorMsg && <p style={{ color: '#B33A3A' }}>{errorMsg}</p>}

        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1E2A3A',
            color: '#F5EDDC',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Book Now
        </button>
      </form>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem 2rem', color: '#1E2A3A' }}>Loading...</div>}>
      <BookForm />
    </Suspense>
  )
}