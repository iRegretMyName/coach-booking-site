import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { services } from '@/app/content/services'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character))

export async function POST(request: Request) {
  try {
    const { serviceId, date, time, name, email, notes = '', timezone } = await request.json()
    const service = services.find((item) => item.id === Number(serviceId))
    if (!service) return NextResponse.json({ error: 'Please choose a valid service.' }, { status: 400 })
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({ error: 'Please choose a valid date and time.' }, { status: 400 })
    if (timezone !== 'Asia/Kolkata') return NextResponse.json({ error: 'Please choose a time in India Standard Time.' }, { status: 400 })
    if (typeof name !== 'string' || name.trim().length < 2 || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please provide your name and a valid email address.' }, { status: 400 })
    if (new Date(`${date}T${time}:00+05:30`).getTime() <= Date.now()) return NextResponse.json({ error: 'Please choose a future appointment time.' }, { status: 400 })

    const dayOfWeek = new Date(`${date}T00:00:00`).getDay()
    const [{ data: availability }, { data: bookings }] = await Promise.all([
      supabase.from('availability').select('start_time,end_time').eq('day_of_week', dayOfWeek),
      supabase.from('bookings').select('booking_time').eq('booking_date', date),
    ])
    const minutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
    const allowed = (availability || []).some((row) => { const [sh, sm] = row.start_time.split(':').map(Number); const [eh, em] = row.end_time.split(':').map(Number); return minutes >= sh * 60 + sm && minutes < eh * 60 + em })
    if (!allowed) return NextResponse.json({ error: 'That time is no longer available. Please choose another time.' }, { status: 409 })
    if ((bookings || []).some((booking) => booking.booking_time.slice(0, 5) === time)) return NextResponse.json({ error: 'That time was just booked. Please choose another time.' }, { status: 409 })

    const cleanName = name.trim().slice(0, 120), cleanEmail = email.trim().toLowerCase(), cleanNotes = typeof notes === 'string' ? notes.trim().slice(0, 2000) : ''
    const { error: dbError } = await supabase.from('bookings').insert({ service_id: service.id, client_name: cleanName, client_email: cleanEmail, client_notes: cleanNotes, booking_date: date, booking_time: time })
    if (dbError) return NextResponse.json({ error: 'We could not hold that time. Please choose another slot and try again.' }, { status: 409 })

    await resend.emails.send({ from: 'Instayog Studio <onboarding@resend.dev>', to: cleanEmail, subject: 'Your Instayog booking request', html: `<h2>Your booking request is received</h2><p>Hi ${escapeHtml(cleanName)},</p><p><strong>${escapeHtml(service.name)}</strong><br>${escapeHtml(date)} at ${escapeHtml(time)} India Standard Time</p><p>We will send your confirmation and meeting details shortly.</p>${cleanNotes ? `<p><strong>Your note:</strong> ${escapeHtml(cleanNotes)}</p>` : ''}` })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'We could not complete your booking request. Please try again.' }, { status: 500 }) }
}
