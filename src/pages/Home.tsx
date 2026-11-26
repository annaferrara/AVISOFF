import { Link } from 'react-router-dom'
import { EventCard } from '../components/Cards'
import { Empty, Img, Section, Spinner } from '../components/ui'
import { fetchEvents, upcoming, useAsync } from '../lib/data'
import { useSettings } from '../lib/settings'
import type { EventItem } from '../lib/types'

const activities = [
  { to: '/coro-gocce-d-amore', title: 'Coro Gocce d’Amore', text: 'Il coro giovanile che canta solidarietà, amicizia e pace.' },
  { to: '/progetto-scuola', title: 'Progetto Scuola', text: 'Incontri di sensibilizzazione nelle scuole della zona.' },
  { to: '/torneo-pallavolo', title: 'Sport e territorio', text: 'Il torneo giovanile di pallavolo femminile con la Virtus Pallavolo.' },
  { to: '/galleria', title: 'Iniziative associative', text: 'Foto e ricordi dei momenti che viviamo insieme.' },
]

export function Home() {
  const { settings } = useSettings()
  const { data: events, loading } = useAsync(() => fetchEvents(), [] as EventItem[])
  const next = upcoming(events).slice(0, 3)

  return (
    <>
      {/* 1 — HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blush" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-mist" />
        <div className="wrap relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="chip mb-5">Dal 1963 a Casorate Primo</span>
            <h1 className="text-5xl font-extrabold sm:text-6xl">
              Un piccolo gesto.<br /><span className="text-avis">Una grande vita.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/75">
              AVIS Casorate Primo: insieme per diffondere la cultura del dono, della solidarietà e del volontariato.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/chi-siamo" className="btn-red">Scopri chi siamo</Link>
              <Link to="/eventi" className="btn-outline">Prossimi eventi</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-navy" />
            <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-avis" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-5xl border-8 border-white shadow-lift">
              <Img src={settings.home.hero_image_url} alt="Volontari e donatori AVIS Casorate Primo" />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — CHI SIAMO */}
      <Section tone="mist">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-[5/4] overflow-hidden rounded-5xl shadow-soft">
            <Img src={settings.home.about_image_url} alt="La comunità di AVIS Casorate Primo" tone="navy" />
          </div>
          <div>
            <h2 className="section-title">Una comunità che sceglie di donare.</h2>
            <p className="mt-5 text-lg text-ink/80">
              Il 10 marzo 1963 un gruppo di cittadini, sensibili alle esigenze di sangue dell’Ospedale Carlo Mira, ha fondato AVIS
              Casorate Primo. Da allora promuoviamo la donazione di sangue e i valori della solidarietà.
            </p>
            <Link to="/chi-siamo" className="btn-navy mt-7">La nostra storia</Link>
          </div>
        </div>
      </Section>

      {/* 3 — EVENTI */}
      <Section>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">Ci vediamo ai prossimi eventi!</h2>
          <Link to="/eventi" className="btn-outline">Scopri tutti gli eventi</Link>
        </div>
        {loading ? <Spinner /> : next.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {next.map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        ) : (
          <Empty title="Stiamo preparando nuovi appuntamenti"
            text="Al momento non ci sono eventi in programma. Seguici sui social o scrivici: ti avviseremo appena ci sono novità."
            action={<Link to="/contatti" className="btn-red">Contattaci</Link>} />
        )}
      </Section>

      {/* 4 — ATTIVITÀ */}
      <Section tone="blush">
        <h2 className="section-title mb-10 max-w-2xl">AVIS è molto più di una donazione.</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a, i) => (
            <Link key={a.to} to={a.to} className="card group flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <div className="h-full w-full transition duration-500 group-hover:scale-105">
                  <Img src={settings.home.activity_images[i] ?? null} alt={a.title} tone={i % 2 ? 'navy' : 'red'} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{a.title}</h3>
                <p className="mt-2 text-ink/75">{a.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 5 — CALL TO ACTION */}
      <section className="relative overflow-hidden bg-avis py-20 text-center text-white sm:py-28">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-navy/30" />
        <div className="wrap relative">
          <h2 className="mx-auto max-w-3xl text-4xl font-extrabold !text-white sm:text-5xl">Il futuro ha bisogno di persone come te.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
            Ogni gesto di solidarietà può fare la differenza. Entra anche tu nella famiglia AVIS.
          </p>
          <Link to="/contatti" className="btn-white mt-9">Contattaci</Link>
        </div>
      </section>
    </>
  )
}
