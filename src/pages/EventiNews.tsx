import { useState } from 'react'
import { EventCard, NewsCard } from '../components/Cards'
import { Empty, PageHero, Section, Spinner } from '../components/ui'
import { archive, fetchEvents, fetchNews, upcoming, useAsync } from '../lib/data'
import type { EventItem, NewsItem } from '../lib/types'

export function EventiNews() {
  const { data: events, loading: l1 } = useAsync(() => fetchEvents(), [] as EventItem[])
  const { data: news, loading: l2 } = useAsync(() => fetchNews(), [] as NewsItem[])
  const [tab, setTab] = useState<'prossimi' | 'archivio'>('prossimi')
  const list = tab === 'prossimi' ? upcoming(events) : archive(events)

  return (
    <>
      <PageHero eyebrow="Eventi e News" title="Ci vediamo ai prossimi eventi!"
        text="Giornate di donazione, spettacoli, tornei e tutte le comunicazioni dell’associazione." />

      <Section>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="section-title">Eventi</h2>
          <div className="inline-flex rounded-full bg-mist p-1" role="tablist" aria-label="Filtra eventi">
            {(['prossimi', 'archivio'] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={`rounded-full px-6 py-3 font-display text-sm font-bold transition ${tab === t ? 'bg-avis text-white shadow-lift' : 'text-navy'}`}>
                {t === 'prossimi' ? 'Prossimi eventi' : 'Eventi passati'}
              </button>
            ))}
          </div>
        </div>
        {l1 ? <Spinner /> : list.length === 0 ? (
          <Empty title={tab === 'prossimi' ? 'Nessun evento in programma' : 'L’archivio è ancora vuoto'}
            text={tab === 'prossimi' ? 'Torna a trovarci presto: stiamo preparando nuovi appuntamenti.' : 'Gli eventi conclusi resteranno consultabili qui.'} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((ev) => <EventCard key={ev.id} ev={ev} past={tab === 'archivio'} />)}
          </div>
        )}
      </Section>

      <Section tone="mist" className="scroll-mt-20">
        <h2 id="news" className="section-title mb-8">News e comunicazioni</h2>
        {l2 ? <Spinner /> : news.length === 0 ? (
          <Empty title="Nessuna news al momento" text="Le comunicazioni dell’associazione compariranno qui." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => <NewsCard key={n.id} item={n} />)}
          </div>
        )}
      </Section>
    </>
  )
}
