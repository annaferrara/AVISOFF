import { useParams } from 'react-router-dom'
import {
  BackLink, Empty, ExtLink, Img, Lightbox, Paragraphs, Section, Spinner, useLightbox,
} from '../components/ui'
import { fetchEvent, fetchNewsItem, useAsync } from '../lib/data'
import { fmtDate, isPast, whenLabel } from '../lib/format'
import type { EventItem, NewsItem } from '../lib/types'

/** Anche l'anteprima dell'admin usa questi componenti. */
export function EventView({ ev }: { ev: EventItem }) {
  const lb = useLightbox()
  const photos = ev.gallery.map((url) => ({ url }))
  return (
    <>
      <Section>
        <BackLink to="/eventi">Tutti gli eventi</BackLink>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-5xl shadow-soft">
            {ev.poster_url
              ? <button className="block w-full" onClick={() => window.open(ev.poster_url!, '_blank', 'noopener')} aria-label="Apri locandina a schermo intero">
                  <img src={ev.poster_url} alt={`Locandina: ${ev.title}`} className="w-full" />
                </button>
              : <div className="aspect-[4/3]"><Img src={null} alt={ev.title} /></div>}
          </div>
          <div>
            {isPast(ev) && <span className="chip mb-4">Evento concluso</span>}
            <h1 className="text-4xl font-extrabold sm:text-5xl">{ev.title}</h1>
            <dl className="mt-6 space-y-3 rounded-4xl bg-mist p-6">
              <div><dt className="label">Quando</dt><dd className="text-lg font-bold">{whenLabel(ev)}{ev.ends_at ? ` → ${fmtDate(ev.ends_at)}` : ''}</dd></div>
              {ev.location && <div><dt className="label">Dove</dt><dd className="text-lg font-bold">{ev.location}</dd></div>}
            </dl>
            <Paragraphs text={ev.description} className="mt-6 text-lg text-ink/85" />
            {ev.external_url && (
              <ExtLink href={ev.external_url} className="btn-red mt-8">Maggiori informazioni</ExtLink>
            )}
          </div>
        </div>
        {photos.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 text-2xl font-bold">Fotografie</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {photos.map((p, i) => (
                <button key={p.url} onClick={() => lb.open(i)} className="aspect-square overflow-hidden rounded-4xl shadow-soft" aria-label="Apri foto">
                  <img src={p.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <Lightbox photos={photos} index={lb.index} onClose={lb.close} onChange={lb.setIndex} />
          </div>
        )}
      </Section>
    </>
  )
}

export function NewsView({ item }: { item: NewsItem }) {
  return (
    <Section>
      <BackLink to="/eventi">Eventi e News</BackLink>
      <article className="mx-auto mt-8 max-w-3xl">
        <span className="chip">{fmtDate(item.publish_at ?? item.created_at)}</span>
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">{item.title}</h1>
        {item.image_url && <img src={item.image_url} alt="" className="mt-8 w-full rounded-5xl shadow-soft" />}
        <Paragraphs text={item.body} className="mt-8 text-lg text-ink/85" />
        {item.attachments.length > 0 && (
          <div className="mt-8 rounded-4xl bg-mist p-6">
            <h2 className="mb-3 text-lg font-bold">Allegati</h2>
            <ul className="space-y-2">
              {item.attachments.map((a) => (
                <li key={a.url}><ExtLink href={a.url} className="font-bold text-avis underline">{a.name || a.url}</ExtLink></li>
              ))}
            </ul>
          </div>
        )}
        {item.external_url && <ExtLink href={item.external_url} className="btn-red mt-8">Apri il link</ExtLink>}
      </article>
    </Section>
  )
}

export function EventoDettaglio() {
  const { id = '' } = useParams()
  const { data, loading } = useAsync(() => fetchEvent(id), null as EventItem | null, [id])
  if (loading) return <Spinner />
  if (!data || data.status !== 'published') {
    return <Section><Empty title="Evento non trovato" action={<BackLink to="/eventi">Tutti gli eventi</BackLink>} /></Section>
  }
  return <EventView ev={data} />
}

export function NewsDettaglio() {
  const { id = '' } = useParams()
  const { data, loading } = useAsync(() => fetchNewsItem(id), null as NewsItem | null, [id])
  if (loading) return <Spinner />
  if (!data) return <Section><Empty title="News non trovata" action={<BackLink to="/eventi">Eventi e News</BackLink>} /></Section>
  return <NewsView item={data} />
}
