import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { paragraphs } from '../lib/format'
import { fetchPage, useAsync } from '../lib/data'
import type { PageText } from '../lib/types'

/** Goccia stilizzata usata come segno grafico quando non c'è ancora il logo ufficiale caricato. */
export function Drop({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#E31E24" />
      <path d="M32 12c8 11 14 18 14 26a14 14 0 0 1-28 0c0-8 6-15 14-26z" fill="#fff" />
    </svg>
  )
}

/** Immagine con bordi morbidi; se manca l'URL mostra un riquadro colorato con la goccia. */
export function Img({
  src, alt, className = '', tone = 'red',
}: { src?: string | null; alt: string; className?: string; tone?: 'red' | 'navy' | 'mist' }) {
  const bg = tone === 'navy' ? 'from-navy to-navy-dark' : tone === 'mist' ? 'from-mist to-blush' : 'from-avis to-avis-dark'
  if (src) return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  return (
    <div role="img" aria-label={alt} className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${bg} ${className}`}>
      <Drop className="h-1/3 w-1/3 max-h-24 max-w-24 opacity-90" />
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Caricamento">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blush border-t-avis" />
    </div>
  )
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-4xl bg-mist px-6 py-12 text-center">
      <Drop className="mx-auto mb-4 h-12 w-12" />
      <p className="font-display text-xl font-bold text-navy">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-ink/70">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function PageHero({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-blush">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-avis/15" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-navy/10" />
      <div className="wrap relative py-14 sm:py-20">
        {eyebrow && <span className="chip mb-4">{eyebrow}</span>}
        <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-lg text-ink/75">{text}</p>}
      </div>
    </section>
  )
}

export function Section({
  tone = 'white', children, className = '',
}: { tone?: 'white' | 'mist' | 'blush'; children: ReactNode; className?: string }) {
  const bg = tone === 'mist' ? 'bg-mist' : tone === 'blush' ? 'bg-blush' : 'bg-white'
  return (
    <section className={`${bg} py-16 sm:py-24 ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  )
}

export function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs(text).map((p, i) => <p key={i}>{p}</p>)}
    </div>
  )
}

/** Testo modificabile da admin (tabella `pages`) con testo di riserva. */
export function usePageText(slug: string, fallbackTitle: string, fallbackBody: string): PageText {
  const { data } = useAsync(() => fetchPage(slug), null as PageText | null, [slug])
  return data && data.body.trim() ? data : { slug, title: fallbackTitle, body: fallbackBody }
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-bold text-navy hover:text-avis">
      <span aria-hidden="true">←</span> {children}
    </Link>
  )
}

export function ExtLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
}

/** Lightbox semplice a schermo intero con navigazione da tastiera. */
export function Lightbox({
  photos, index, onClose, onChange,
}: { photos: { url: string; caption?: string | null }[]; index: number | null; onClose: () => void; onChange: (i: number) => void }) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, photos.length, onClose, onChange])
  if (index === null || !photos[index]) return null
  const p = photos[index]
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-dark/90 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-navy" onClick={onClose} aria-label="Chiudi">×</button>
      {photos.length > 1 && (
        <>
          <button className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-navy"
            onClick={(e) => { e.stopPropagation(); onChange((index - 1 + photos.length) % photos.length) }} aria-label="Precedente">‹</button>
          <button className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-navy"
            onClick={(e) => { e.stopPropagation(); onChange((index + 1) % photos.length) }} aria-label="Successiva">›</button>
        </>
      )}
      <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img src={p.url} alt={p.caption ?? ''} className="max-h-[80vh] rounded-3xl object-contain" />
        {p.caption && <figcaption className="mt-3 text-center text-white">{p.caption}</figcaption>}
      </figure>
    </div>
  )
}

export function useLightbox() {
  const [index, setIndex] = useState<number | null>(null)
  return { index, open: setIndex, close: () => setIndex(null), setIndex }
}
