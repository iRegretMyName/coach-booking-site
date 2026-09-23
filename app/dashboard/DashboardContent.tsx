'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ServicesManager from './ServicesManager'
import AvailabilityManager from './AvailabilityManager'
import BlogManager from './BlogManager'

type Booking = {
  id: string
  client_name: string
  client_email: string
  client_notes: string
  booking_date: string
  booking_time: string
  status: string
  service_id: number
}

type Service = {
  id: number
  name: string
}

export default function DashboardContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'availability' | 'blog'>('bookings')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true })

    const { data: servicesData } = await supabase
      .from('services')
      .select('id, name')

    if (bookingsData) setBookings(bookingsData)
    if (servicesData) setServices(servicesData)
    setLoading(false)
  }

  const updateStatus = async (bookingId: string, newStatus: string) => {
    await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    )
  }

  const deleteBooking = async (bookingId: string) => {
    await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    setBookings((prev) => prev.filter((b) => b.id !== bookingId))
  }

  const getServiceName = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId)
    return service ? service.name : 'Unknown service'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings.filter((b) => b.booking_date >= today)
  const past = bookings.filter((b) => b.booking_date < today)

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0D9C9',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1rem',
  }

  const statusColors: { [key: string]: string } = {
    confirmed: '#5C6B7A',
    attended: '#3B7A45',
    'no-show': '#B33A3A',
  }

  const statusLabels: { [key: string]: string } = {
    confirmed: 'Upcoming',
    attended: 'Attended',
    'no-show': 'No-show',
  }

  const renderBooking = (booking: Booking) => {
    const isPast = booking.booking_date < today

    return (
      <div key={booking.id} style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <strong style={{ color: '#3611d2', fontSize: '1.05rem' }}>
            {formatDate(booking.booking_date)} at {booking.booking_time.slice(0, 5)}
          </strong>
          <span style={{ color: '#5C6B7A', fontSize: '0.9rem' }}>
            {getServiceName(booking.service_id)}
          </span>
        </div>
        <p style={{ margin: '0.25rem 0', color: '#1E2A3A' }}>
          {booking.client_name} - {booking.client_email}
        </p>
        {booking.client_notes && (
          <p style={{ margin: '0.25rem 0', color: '#5C6B7A', fontStyle: 'italic' }}>
            {booking.client_notes}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: statusColors[booking.status] || '#5C6B7A',
            }}
          >
            {statusLabels[booking.status] || booking.status}
          </span>

          {isPast && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => updateStatus(booking.id, 'attended')}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #3B7A45',
                  backgroundColor: booking.status === 'attended' ? '#3B7A45' : '#FFFFFF',
                  color: booking.status === 'attended' ? '#FFFFFF' : '#3B7A45',
                  cursor: 'pointer',
                }}
              >
                Attended
              </button>
              <button
                onClick={() => updateStatus(booking.id, 'no-show')}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #B33A3A',
                  backgroundColor: booking.status === 'no-show' ? '#B33A3A' : '#FFFFFF',
                  color: booking.status === 'no-show' ? '#FFFFFF' : '#B33A3A',
                  cursor: 'pointer',
                }}
              >
                No-show
              </button>
            </div>
          )}

          <div style={{ marginLeft: 'auto' }}>
            {confirmingDelete === booking.id ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#B33A3A' }}>Delete this booking?</span>
                <button
                  onClick={() => {
                    deleteBooking(booking.id)
                    setConfirmingDelete(null)
                  }}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#B33A3A',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmingDelete(null)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '4px',
                    border: '1px solid #E0D9C9',
                    backgroundColor: '#FFFFFF',
                    color: '#5C6B7A',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingDelete(booking.id)}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #E0D9C9',
                  backgroundColor: '#FFFFFF',
                  color: '#5C6B7A',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ color: '#5C6B7A' }}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#3611d2' }}>
        Dashboard
      </h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #E0D9C9', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: activeTab === 'bookings' ? '#3611d2' : 'transparent',
            color: activeTab === 'bookings' ? '#F5EDDC' : '#5C6B7A',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: activeTab === 'services' ? '#3611d2' : 'transparent',
            color: activeTab === 'services' ? '#F5EDDC' : '#5C6B7A',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: activeTab === 'availability' ? '#3611d2' : 'transparent',
            color: activeTab === 'availability' ? '#F5EDDC' : '#5C6B7A',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Availability
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: activeTab === 'blog' ? '#3611d2' : 'transparent',
            color: activeTab === 'blog' ? '#F5EDDC' : '#5C6B7A',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Blog
        </button>
      </div>

      {activeTab === 'bookings' && (
        <>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1E2A3A' }}>
            Upcoming Bookings ({upcoming.length})
          </h2>
          {upcoming.length === 0 && (
            <p style={{ color: '#5C6B7A', marginBottom: '2rem' }}>No upcoming bookings.</p>
          )}
          {upcoming.map(renderBooking)}

          <h2 style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#1E2A3A' }}>
            Past Bookings ({past.length})
          </h2>
          {past.length === 0 && (
            <p style={{ color: '#5C6B7A' }}>No past bookings yet.</p>
          )}
          {past.map(renderBooking)}
        </>
      )}

      {activeTab === 'services' && <ServicesManager />}

      {activeTab === 'blog' && <BlogManager />}

      {activeTab === 'availability' && <AvailabilityManager />}
    </div>
  )
}
