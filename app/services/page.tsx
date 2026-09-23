import Link from 'next/link'
import ScrollReveal from '@/app/components/ScrollReveal'
import { services } from '@/app/content/services'

export default function ServicesPage() {
  return <main className="section-page offerings-page"><header className="page-intro"><p className="eyebrow">WAYS TO WORK TOGETHER</p><h1>Healing that meets<br />your real life.</h1><p>Eight distinct pathways for nervous system regulation, spiritual growth, sound, relationships, karma and daily presence.</p></header><ScrollReveal><div className="offerings-list">{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} className="service-card"><span className="offering-number">{service.number}</span><div><p className="service-eyebrow">{service.eyebrow}</p><h2>{service.name}</h2><p>{service.description}</p></div><div className="offering-meta"><span>{service.format}</span><b>{service.price}</b><em>↗</em></div></Link>)}</div></ScrollReveal></main>
}
