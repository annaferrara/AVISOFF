import { Link } from 'react-router-dom'
import { dayOf, fmtDate, monthShort, whenLabel } from '../lib/format'
import type { EventItem, NewsItem } from '../lib/types'
import { Img } from './ui'

export function EventCard({ ev, past = false }: { ev: EventItem; past?: boolean }) {
  return (
    <Link to={`/eventi/${ev.id}`} className={`card group flex h-full flex-col ${past ? 'opacity-90' : ''}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition duration-500 group-hover:scale-105">
          <Img src={ev.poster_url} alt={ev.poster_url ? `Locandina: ${ev.title}` : ev.title} tone={past ? 'navy' : 'red'} />
        </div>
        <div className="absolute left-4 top-4 rounded-3xl bg-white px-4 py-2 text-center shadow-soft">
          <div className="font-display text-2xl font-extrabold leading-none text-avis">{dayOf(ev.starts_at)}</div>
          <div className="text-xs font-bold tracking-widest text-navy">{monthShort(ev.starts_at)}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold">{ev.title}</h3>
        <p className="mt-1 text-sm font-bold text-avis">{whenLabel(ev)}</p>
        {ev.location && <p className="text-sm text-ink/70">{ev.location}</p>}
        {ev.summary && <p className="mt-3 line-clamp-3 text-ink/80">{ev.summary}</p>}
        <span className="btn-outline mt-auto !min-h-[44px] self-start !px-5 !py-2 !text-xs">Scopri di più</span>
      </div>
    </Link>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link to={`/news/${item.id}`} className="card group flex h-full flex-col">
      <div className="aspect-[16/10] overflow-hidden">
        <div className="h-full w-full transition duration-500 group-hover:scale-105">
          <Img src={item.image_url} alt={item.title} tone="navy" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="chip self-start">{fmtDate(item.publish_at ?? item.created_at)}</span>
        <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
        {item.summary && <p className="mt-2 line-clamp-3 text-ink/80">{item.summary}</p>}
        <span className="mt-auto pt-4 font-display text-sm font-bold text-avis">Leggi →</span>
      </div>
    </Link>
  )
}
