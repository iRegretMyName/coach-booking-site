'use client'

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DatePicker from '@/app/components/DatePicker'
import { services } from '@/app/content/services'

const supportOptions = [
  { label: 'I feel overwhelmed', serviceIds: [1, 8] },
  { label: 'I want to understand my patterns', serviceIds: [1, 3] },
  { label: 'I want deeper spiritual growth', serviceIds: [7, 4] },
  { label: 'I need support in my relationships', serviceIds: [5, 1] },
  { label: 'I want to work with sound & mantra', serviceIds: [4, 8] },
  { label: 'I want more calm in my environment', serviceIds: [6, 1] },
  { label: 'I’m not sure yet', serviceIds: [1] },
] as const

function BookForm() {
  const searchParams = useSearchParams()
  const [focus, setFocus] = useState<string | null>(null)
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scrollTarget, setScrollTarget] = useState<{ id: string; request: number } | null>(null)
  const scrollFrame = useRef<number | null>(null)

  useEffect(() => {
    const preselectedId = Number(searchParams.get('service'))
    if (services.some((service) => service.id === preselectedId)) setSelectedService(preselectedId)
  }, [searchParams])

  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { setAvailableSlots([]); setTime(''); return }
    let cancelled = false
    const fetchAvailability = async () => {
      setLoadingSlots(true); setTime('')
      const dayOfWeek = new Date(`${date}T00:00:00`).getDay()
      const { data: availabilityRows } = await supabase.from('availability').select('*').eq('day_of_week', dayOfWeek)
      if (cancelled) return
      const slots: string[] = []
      availabilityRows?.forEach((row) => {
        const [startH, startM] = row.start_time.split(':').map(Number)
        const [endH, endM] = row.end_time.split(':').map(Number)
        for (let current = startH * 60 + startM; current < endH * 60 + endM; current += 30) slots.push(`${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`)
      })
      const { data: existingBookings } = await supabase.from('bookings').select('booking_time').eq('booking_date', date)
      if (!cancelled) {
        const booked = new Set((existingBookings || []).map((booking) => booking.booking_time.slice(0, 5)))
        setAvailableSlots(slots.filter((slot) => !booked.has(slot))); setLoadingSlots(false)
      }
    }
    fetchAvailability()
    return () => { cancelled = true }
  }, [date])

  const suggestedIds = useMemo(() => supportOptions.find((option) => option.label === focus)?.serviceIds || [], [focus])
  const currentStep = !selectedService ? 1 : !date || !time ? 3 : !name || !email ? 4 : 5
  const selected = services.find((service) => service.id === selectedService)
  const requestStep = useCallback((id: string) => setScrollTarget((current) => ({ id, request: (current?.request || 0) + 1 })), [])

  useLayoutEffect(() => {
    if (!scrollTarget) return
    const target = scrollTarget.id === 'active-booking-service'
      ? document.querySelector<HTMLElement>('.booking-service--active')
      : document.getElementById(scrollTarget.id)
    if (!target) return
    let cancelled = false
    const align = () => {
      if (cancelled) return
      if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current)
      scrollFrame.current = requestAnimationFrame(() => {
        scrollFrame.current = requestAnimationFrame(() => {
          const navigation = document.querySelector<HTMLElement>('.site-nav')
          const navigationHeight = navigation?.getBoundingClientRect().height || 0
          const targetTop = target.getBoundingClientRect().top + window.scrollY - navigationHeight
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
        })
      })
    }
    align()
    const observer = new ResizeObserver(align)
    observer.observe(target)
    const navigation = document.querySelector<HTMLElement>('.site-nav')
    if (navigation) observer.observe(navigation)
    target.addEventListener('transitionend', align)
    document.fonts?.ready.then(align)
    return () => { cancelled = true; if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current); observer.disconnect(); target.removeEventListener('transitionend', align) }
  }, [scrollTarget])

  const handleBookingClick = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.target as HTMLElement
    const link = element.closest<HTMLAnchorElement>('a[href^="#"]')
    if (link) { const id = link.getAttribute('href')?.slice(1); if (id) { event.preventDefault(); requestStep(id) }; return }
    if (element.closest('.time-slot')) requestStep('booking-details')
  }

  const chooseFocus = (label: string) => {
    setFocus(label)
    if (label === 'I’m not sure yet') setSelectedService(null)
    else {
      const suggestion = supportOptions.find((option) => option.label === label)?.serviceIds[0]
      if (suggestion) setSelectedService(suggestion)
    }
    requestStep(label === 'I’m not sure yet' ? 'session-selection' : 'active-booking-service')
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setErrorMsg('')
    if (isSubmitting) return
    if (!selectedService || !date || !time || !name || !email) { setErrorMsg('Choose a session, date and time, then add your details to continue.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMsg('Please enter a valid email address.'); return }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serviceId: selectedService, date, time, name, email, notes, timezone: 'Asia/Kolkata' }) })
      const result = await response.json()
      if (!response.ok) { setErrorMsg(result.error || 'Something went wrong. Please try again.'); return }
      setSubmitted(true)
    } catch { setErrorMsg('We could not send your request. Please check your connection and try again.') } finally { setIsSubmitting(false) }
  }

  if (submitted) return <main className="booking-confirmation"><div className="booking-confirmation__orb">✦</div><p className="eyebrow">YOUR SPACE IS HELD</p><h1>Beautiful. You’re on your way.</h1><p>We’ve received your request for <strong>{selected?.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong> (India Standard Time).</p><p>A confirmation with the next steps and meeting information will arrive at <strong>{email}</strong>. If you need to change something, contact the studio before your session.</p><div><Link className="button button--ink" href="/">Return home <span>↗</span></Link><Link className="text-link" href="/Blog">Read while you wait <span>→</span></Link></div></main>

  return <main className="booking-experience" onClick={handleBookingClick}>
    <section className="booking-hero"><div className="booking-hero__copy"><p className="eyebrow">A GENTLE FIRST STEP</p><h1>Ready to <i>begin?</i></h1><p>You don’t need to arrive with everything figured out. This is simply a place to pause, be heard and find the kind of support that meets you now.</p><div className="booking-hero__actions"><a className="button button--ink" href="#booking-flow">Book your session <span>↓</span></a><Link className="text-link" href="/services">Explore services <span>→</span></Link></div></div><div className="booking-hero__image"><span>WITH PRAGATI<br />SINGH</span><img src="/about-photo.jpeg" alt="Pragati Singh" /><b>START<br />WHERE<br />YOU ARE</b></div></section>
    <section className="booking-intention" id="booking-flow"><div><p className="eyebrow">01 — CHOOSE YOUR FOCUS</p><h2>What would you like support with?</h2><p>There is no wrong answer. Choose the closest feeling and we’ll gently point you toward a place to begin.</p></div><div className="focus-options">{supportOptions.map((option, index) => <button type="button" key={option.label} onClick={() => chooseFocus(option.label)} className={focus === option.label ? 'focus-option focus-option--active' : 'focus-option'}><span>0{index + 1}</span>{option.label}<b>↗</b></button>)}</div></section>
    <section className="booking-flow" id="session-selection"><header className="booking-flow__header"><p className="eyebrow">02 — CHOOSE YOUR SESSION</p><h2>A session that meets the moment.</h2><p>{focus ? `A thoughtful starting point for “${focus.toLowerCase()}”. You can choose another option at any time.` : 'Choose the space that feels most useful today. Each one opens with a real conversation, not a performance.'}</p></header><div className="service-selector">{services.map((service) => { const active = selectedService === service.id; const suggested = (suggestedIds as readonly number[]).includes(service.id); return <article key={service.id} className={`booking-service ${active ? 'booking-service--active' : ''} ${suggested ? 'booking-service--suggested' : ''}`}><button type="button" onClick={() => setSelectedService(service.id)} aria-pressed={active}><span className="booking-service__number">{service.number}</span><span className="booking-service__name">{service.name}</span><span className="booking-service__arrow">{active ? '—' : '↘'}</span></button>{active && <div className="booking-service__detail"><p>{service.description}</p><dl><div><dt>Format</dt><dd>{service.format}</dd></div><div><dt>Investment</dt><dd>{service.price}</dd></div><div><dt>For</dt><dd>{service.for}</dd></div></dl><p className="booking-service__receive">You’ll receive: {service.receive.join(' · ')}</p><a href="#time-selection" className="text-link">Choose a time <span>↓</span></a></div>}{suggested && !active && <span className="booking-service__tag">Suggested for you</span>}</article> })}</div></section>
    <section className="booking-scheduling" id="time-selection"><aside><p className="eyebrow">03 — CHOOSE YOUR TIME</p><h2>Make room for yourself.</h2><p>Availability is shown in 30-minute windows. Select the time that lets you arrive unhurried.</p><div className="booking-summary">{selected ? <><span>YOUR SESSION</span><strong>{selected.name}</strong><small>{selected.format} · {selected.price}</small></> : <span>Choose a session above to continue.</span>}</div></aside><div className="booking-scheduling__control"><label>Choose a date</label><DatePicker value={date} onChange={setDate} />{loadingSlots && <p className="booking-status">Finding open spaces…</p>}{!loadingSlots && date && availableSlots.length === 0 && <p className="booking-status">There are no open times on this day. Try another date.</p>}{availableSlots.length > 0 && <div className="time-grid">{availableSlots.map((slot) => <button className={time === slot ? 'time-slot time-slot--active' : 'time-slot'} type="button" key={slot} onClick={() => setTime(slot)}>{slot}</button>)}</div>}</div></section>
    <section className="booking-details"><div><p className="eyebrow">04 — YOUR DETAILS</p><h2>A little about you.</h2><p>Just enough for Pragati to welcome you well. You can share more when you meet.</p></div><form onSubmit={handleSubmit}><div className="booking-steps" aria-label="Booking progress">{['Focus', 'Session', 'Time', 'Details', 'Confirm'].map((step, index) => <span key={step} className={index + 1 <= currentStep ? 'booking-step booking-step--complete' : 'booking-step'}><b>0{index + 1}</b>{step}</span>)}</div><div className="booking-fields"><label>Your name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label><label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></label><label className="booking-fields__wide">Anything you’d like Pragati to know? <em>Optional</em><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} /></label></div>{errorMsg && <p className="form-error">{errorMsg}</p>}<button className="booking-submit" type="submit">Confirm my session <span>↗</span></button></form></section>
    <section className="booking-founder"><div className="booking-founder__photo"><img src="/about-photo.jpeg" alt="Pragati Singh" /></div><div><p className="eyebrow">A NOTE FROM PRAGATI</p><h2>You don’t need to arrive with all the answers.</h2><p>Our first conversation is a space to understand what is happening, without rushing to label or fix it. We’ll listen for what your system has been holding and discover what support makes sense.</p><span>— Pragati Singh</span></div></section>
    <section className="booking-final"><p className="eyebrow">YOUR NEXT SMALL STEP</p><h2>Start where<br /><i>you are.</i></h2><p>One honest conversation can create room for a different way forward.</p><a className="button button--light" href="#booking-flow">Book your session <span>↑</span></a><Link className="text-link" href="/services">Explore the work <span>→</span></Link></section>
  </main>
}

export default function BookPage() { return <Suspense fallback={<main className="booking-loading">Opening your booking space…</main>}><BookForm /></Suspense> }
