import Link from 'next/link'
import { notFound } from 'next/navigation'
import { services } from '@/app/content/services'

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services.find((item) => item.slug === slug)
  if (!service) notFound()
  return <main className="service-detail"><header><p className="eyebrow">{service.eyebrow}</p><span className="service-detail-number">{service.number}</span><h1>{service.name}</h1><p>{service.description}</p><div className="service-detail-meta"><span>{service.format}</span><b>{service.price}</b></div><Link href="/book" className="button button--ink">Begin with this offering <span>↗</span></Link></header><section className="service-detail-body"><div><p className="eyebrow">WHO THIS IS FOR</p><h2>{service.for}</h2><p>This is a space for practical, personalised guidance. Your pace, circumstances and capacity are part of the work—not obstacles to it.</p></div><div><p className="eyebrow">WHAT YOU RECEIVE</p><ul>{service.receive.map((item) => <li key={item}>{item}</li>)}</ul></div></section><section className="service-detail-cta"><p className="eyebrow">A GENTLE NEXT STEP</p><h2>You do not have to hold the whole journey at once.</h2><p>Start with a conversation about what is present for you now.</p><Link href="/contact" className="button button--light">Ask a question <span>→</span></Link></section></main>
}
