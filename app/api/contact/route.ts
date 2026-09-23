import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character))

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    if (typeof name !== 'string' || name.trim().length < 2 || typeof message !== 'string' || message.trim().length < 3 || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please provide your name, a valid email and a short message.' }, { status: 400 })
    await resend.emails.send({ from: 'Instayog Studio <onboarding@resend.dev>', to: 'aadityabali2405@gmail.com', subject: `New Instayog message from ${name.trim().slice(0, 120)}`, html: `<h2>New message</h2><p><strong>Name:</strong> ${escapeHtml(name.trim().slice(0, 120))}</p><p><strong>Email:</strong> ${escapeHtml(email.trim().slice(0, 254))}</p><p>${escapeHtml(message.trim().slice(0, 4000)).replace(/\n/g, '<br>')}</p>` })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'We could not send your message. Please try again.' }, { status: 500 }) }
}
