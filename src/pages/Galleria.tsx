import { useState } from 'react'
import { Empty, Img, Lightbox, PageHero, Section, Spinner, useLightbox } from '../components/ui'
import { fetchAlbums, fetchPhotos, useAsync } from '../lib/data'
import type { Album, AlbumCategory, Photo } from '../lib/types'

export const CATEGORY_LABEL: Record<AlbumCategory, string> = {
  eventi: 'Eventi', manifestazioni: 'Manifestazioni', coro: 'Coro Gocce d’Amore',
  scuola: 'Progetto Scuola', attivita: 'Attività associative', storici: 'Eventi storici',
}

export function Galleria() {
  const { data: albums, loading } = useAsync(() => fetchAlbums(), [] as Album[])
  const { data: photos } = useAsync(() => fetchPhotos(), [] as Photo[])
  const [cat, setCat] = useState<AlbumCategory | 'tutte'>('tutte')
  const lb = useLightbox()

  const albumIds = new Set(albums.filter((a) => cat === 'tutte' || a.category === cat).map((a) => a.id))
  const shown = photos.filter((p) => albumIds.has(p.album_id))
  const albumOf = (id: string) => albums.find((a) => a.id === id)?.title ?? ''

  return (
    <>
      <PageHero eyebrow="Galleria" title="I nostri momenti" text="Eventi, manifestazioni, il coro, la scuola e la storia dell’associazione in fotografie." />
      <Section>
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorie">
          {(['tutte', ...Object.keys(CATEGORY_LABEL)] as (AlbumCategory | 'tutte')[]).map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`rounded-full px-5 py-3 font-display text-sm font-bold transition ${cat === c ? 'bg-avis text-white shadow-lift' : 'bg-mist text-navy hover:bg-blush'}`}>
              {c === 'tutte' ? 'Tutte' : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        {loading ? <Spinner /> : shown.length === 0 ? (
          <Empty title="Nessuna fotografia in questa categoria" text="Le fotografie vengono aggiunte dall’associazione: torna a trovarci presto." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((p, i) => (
              <button key={p.id} onClick={() => lb.open(i)} className="group aspect-square overflow-hidden rounded-4xl shadow-soft" aria-label={`Apri foto ${albumOf(p.album_id)}`}>
                <div className="h-full w-full transition duration-500 group-hover:scale-105"><Img src={p.url} alt={p.caption ?? albumOf(p.album_id)} /></div>
              </button>
            ))}
          </div>
        )}
        <Lightbox photos={shown} index={lb.index} onClose={lb.close} onChange={lb.setIndex} />
      </Section>
    </>
  )
}
