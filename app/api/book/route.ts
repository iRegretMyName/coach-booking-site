import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceId, serviceName, date, time, name, email, notes } = body

    // 1. Save the booking to Supabase
    const { error: dbError } = await supabase.from('bookings').insert({
      service_id: serviceId,
      client_name: name,
      client_email: email,
      client_notes: notes,
      booking_date: date,
      booking_time: time,
    })

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    // 2. Send confirmation email
    await resend.emails.send({
      from: 'Booking Confirmation <onboarding@resend.dev>',
      to: email,
      subject: 'Your booking is confirmed!',
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Your session has been booked:</p>
        <ul>
          <li><strong>Service:</strong> ${serviceName}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
        </ul>
        ${notes ? `<p><strong>Your notes:</strong> ${notes}</p>` : ''}
        <p>We look forward to seeing you!</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}