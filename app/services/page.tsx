import Link from 'next/link'
import ScrollReveal from '@/app/components/ScrollReveal'
import { services } from '@/app/content/services'

const startingIds = [1, 3, 5, 7]

function ServiceRow({ service, featured = false }: { service: (typeof services)[number]; featured?: boolean }) {
  return <Link href={`/services/${service.slug}`} className={featured ? 'service-card service-card--start' : 'service-card'}><span className="offering-number">{service.number}</span><div><p className="service-eyebrow">{featured ? 'START HERE · ' : ''}{service.eyebrow}</p><h2>{service.name}</h2><p>{service.description}</p>{featured && <span className="service-fit">Best for: {service.for}</span>}</div><div className="offering-meta"><span>{service.format}</span><b>{service.price}</b><em>↗</em></div></Link>
}

export const metadata = { title: 'Ways to Work Together | Instayog Studio', description: 'Explore one-to-one, relationship, group and deeper spiritual support with Instayog Studio.' }

export default function ServicesPage() {
  const starts = services.filter((service) => startingIds.includes(service.id))
  const all = services.filter((service) => !startingIds.includes(service.id))
  return <main className="section-page offerings-page"><header className="page-intro"><p className="eyebrow">WAYS TO WORK TOGETHER</p><h1>Find a place<br />to start.</h1><p>You do not need to understand every offering before you begin. These four pathways are the clearest starting points; the rest are here when you are ready to go deeper.</p></header><ScrollReveal><section className="service-pathway"><header><p className="eyebrow">START HERE</p><h2>Choose the support that feels closest to your life right now.</h2></header><div className="offerings-list">{starts.map((service) => <ServiceRow key={service.id} service={service} featured />)}</div></section></ScrollReveal><section className="services-guidance"><p className="eyebrow">NOT SURE?</p><h2>You do not need to choose perfectly.</h2><p>Book a first conversation and we can understand what kind of support makes most sense together.</p><Link href="/book" className="button button--ink">Get guided support <span>↗</span></Link></section><section className="service-pathway service-pathway--all"><header><p className="eyebrow">EXPLORE ALL SERVICES</p><h2>Programs, group spaces and specialist support.</h2></header><div className="offerings-list">{all.map((service) => <ServiceRow key={service.id} service={service} />)}</div></section></main>
}
