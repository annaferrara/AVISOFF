import { useState } from 'react'
import { Img, Lightbox, PageHero, Paragraphs, Section, Spinner, useLightbox, usePageText } from '../components/ui'
import { FOUNDERS, VALUES } from '../lib/content'
import { fetchAlbums, fetchPhotos, fetchTeam, useAsync } from '../lib/data'
import type { Album, Photo, TeamMember } from '../lib/types'

const STORIA =
  'Il 10 marzo 1963, sotto la guida del Dott. Piero Mergati, un gruppo di cittadini sensibili alle esigenze di sangue dell’Ospedale Carlo Mira fondò AVIS Casorate Primo.\n\n' +
  'Da allora l’associazione promuove la donazione volontaria, periodica, anonima e non retribuita. Nel 2010, in occasione del bilancio d’esercizio, ha realizzato il primo Bilancio Sociale, con l’obiettivo di rendere sempre più chiaro e trasparente il proprio operato.\n\n' +
  'Nel 2003, per festeggiare il 40° anniversario, è nato il Coro AVIS, oggi Gocce d’Amore. Nel 2022 l’associazione ha aggiornato il proprio Statuto.'

function Person({ p }: { p: TeamMember }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl">
        <Img src={p.photo_url} alt={p.photo_url ? p.full_name : ''} tone="navy" />
      </div>
      <div>
        <p className="font-display text-lg font-bold text-navy">{p.full_name}</p>
        <p className="text-sm font-bold text-avis">{p.role}</p>
        {p.bio && <p className="mt-1 text-sm text-ink/75">{p.bio}</p>}
      </div>
    </div>
  )
}

export function ChiSiamo() {
  const storia = usePageText('chi-siamo', 'La nostra storia', STORIA)
  const { data: team, loading } = useAsync(() => fetchTeam(), [] as TeamMember[])
  const { data: albums } = useAsync(() => fetchAlbums(), [] as Album[])
  const { data: photos } = useAsync(() => fetchPhotos(), [] as Photo[])
  const lb = useLightbox()
  const [showFounders, setShowFounders] = useState(false)

  const direttivo = team.filter((t) => t.group_name === 'direttivo')
  const consiglieri = team.filter((t) => t.group_name === 'consigliere')
  const collaboratori = team.filter((t) => t.group_name === 'collaboratore')
  const comunita = photos.filter((p) => albums.find((a) => a.id === p.album_id)?.category === 'attivita').slice(0, 8)

  return (
    <>
      <PageHero eyebrow="Chi siamo" title="Persone che scelgono di donare, da più di sessant’anni."
        text="La storia, i valori e le persone di AVIS Casorate Primo." />

      <Section>
        <h2 className="section-title mb-6">{storia.title}</h2>
        <Paragraphs text={storia.body} className="max-w-3xl text-lg text-ink/85" />
      </Section>

      <Section tone="mist">
        <h2 className="section-title mb-10">I nostri valori</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <div key={v.title} className="card p-7">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-extrabold text-white ${i % 2 ? 'bg-navy' : 'bg-avis'}`}>{i + 1}</div>
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p className="mt-2 text-ink/75">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="section-title mb-10">Il consiglio direttivo 2025/2028</h2>
        {loading ? <Spinner /> : (
          <div className="space-y-10">
            <div className="grid gap-4 md:grid-cols-2">{direttivo.map((p) => <Person key={p.id} p={p} />)}</div>
            {consiglieri.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-bold">Consiglieri</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{consiglieri.map((p) => <Person key={p.id} p={p} />)}</div>
              </div>
            )}
            {collaboratori.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-bold">Collaboratori</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{collaboratori.map((p) => <Person key={p.id} p={p} />)}</div>
              </div>
            )}
          </div>
        )}
      </Section>

      <Section tone="blush">
        <h2 className="section-title">I soci fondatori</h2>
        <p className="mt-4 max-w-3xl text-lg text-ink/80">
          Li ricordiamo con gratitudine: il 10 marzo 1963, sensibili alle esigenze di sangue dell’Ospedale Carlo Mira e sotto la guida del
          Dott. Piero Mergati, fondarono la nostra associazione.
        </p>
        <button className="btn-navy mt-6" onClick={() => setShowFounders((s) => !s)} aria-expanded={showFounders}>
          {showFounders ? 'Nascondi i nomi' : `Leggi i ${FOUNDERS.length} nomi`}
        </button>
        {showFounders && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FOUNDERS.map((n) => <li key={n} className="rounded-full bg-white px-5 py-3 font-bold text-navy shadow-soft">{n}</li>)}
          </ul>
        )}
      </Section>

      <Section>
        <h2 className="section-title mb-8">La nostra comunità</h2>
        {comunita.length === 0 ? (
          <p className="rounded-4xl bg-mist p-8 text-ink/75">Le fotografie delle nostre attività arriveranno presto. Nel frattempo trovi tutto nella <a className="font-bold text-avis underline" href="/galleria">galleria</a>.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {comunita.map((p, i) => (
              <button key={p.id} onClick={() => lb.open(i)} className="aspect-square overflow-hidden rounded-4xl shadow-soft transition hover:scale-[1.02]" aria-label="Apri foto">
                <Img src={p.url} alt={p.caption ?? 'Foto della comunità AVIS'} />
              </button>
            ))}
          </div>
        )}
        <Lightbox photos={comunita} index={lb.index} onClose={lb.close} onChange={lb.setIndex} />
      </Section>
    </>
  )
}
