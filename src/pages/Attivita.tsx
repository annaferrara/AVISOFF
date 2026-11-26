import { Link } from 'react-router-dom'
import { ExtLink, Paragraphs, PageHero, Section, usePageText } from '../components/ui'
import { TORNEO } from '../lib/content'

const CORO =
  'Il Coro AVIS Casorate Primo e la rassegna canora “Gocce d’Amore” sono nati dall’idea di un gruppo di amici che cercavano un modo speciale per festeggiare il 40° anniversario della fondazione di AVIS Casorate Primo. L’obiettivo: coinvolgere i giovani in qualcosa di divertente, educativo e aggregante, senza alcun costo per le famiglie.\n\n' +
  'Le canzoni scelte sviluppano i valori importanti della vita: solidarietà, amicizia, pace, amore, uguaglianza. Tutti temi che riconducono al valore del donare gratuitamente.\n\n' +
  'Il coro è nato nel novembre 2003 con un grande successo di iscrizioni di bambini dai 4 anni in su; il primo spettacolo si è tenuto nell’aprile 2004. Ha raggiunto oltre 40 iscritti e svolge gratuitamente la propria attività per manifestazioni culturali e benefiche.\n\n' +
  'Dall’unione con il Piccolo Coro dell’Arcobaleno di Motta Visconti è nato il Piccolo Coro Arcobaleno AVIS; dopo l’interruzione per la pandemia è ripartito nel 2022 con il nome Coro AVIS Casorate Primo “Gocce d’Amore”. Il primo spettacolo con il nuovo nome è stato “Note in Armonia di Natale”, il 17 dicembre 2022.\n\n' +
  'Una direttrice speciale: la Professoressa Lidia Vignoni, che in tutti questi anni si è sempre prodigata a titolo gratuito, ripagata dall’affetto del coro e dei giovani coristi.'

export function Coro() {
  const t = usePageText('coro-gocce-d-amore', 'La nostra storia', CORO)
  return (
    <>
      <PageHero eyebrow="Le nostre attività" title="Coro Gocce d’Amore" text="Il coro giovanile di AVIS Casorate Primo: la musica come modo di donare." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="section-title mb-6">{t.title}</h2>
            <Paragraphs text={t.body} className="text-lg text-ink/85" />
          </div>
          <aside className="space-y-5">
            <div className="card p-7">
              <h3 className="mb-3 text-xl font-bold">Date importanti</h3>
              <ul className="space-y-3 text-ink/85">
                <li><strong>Novembre 2003</strong> — nasce il coro</li>
                <li><strong>18 gennaio 2011</strong> — riconosciuto dal Comune di Casorate Primo come “Gruppo di Musica Popolare e Amatoriale di Interesse Comunale”</li>
                <li><strong>23 novembre 2011</strong> — riconoscimento di interesse nazionale dal Ministero per i Beni e le attività Culturali</li>
                <li><strong>2022</strong> — la ripartenza come “Gocce d’Amore”</li>
              </ul>
            </div>
            <div className="card space-y-3 p-7">
              <h3 className="text-xl font-bold">Video e foto</h3>
              <ExtLink href="https://www.youtube.com/watch?v=8QyO-MzKpgY" className="btn-red w-full">Spettacolo del 2009 (YouTube)</ExtLink>
              <ExtLink href="https://sites.google.com/site/arcobalenocoro" className="btn-outline w-full">Sito del coro</ExtLink>
              <Link to="/galleria" className="btn-navy w-full">Galleria fotografica</Link>
            </div>
          </aside>
        </div>
        <p className="mt-10 rounded-3xl bg-mist p-6">Vuoi sapere quando si esibisce il coro? Guarda i <Link to="/eventi" className="font-bold text-avis underline">prossimi eventi</Link>.</p>
      </Section>
    </>
  )
}

const SCUOLA =
  'Svolgiamo attività di sensibilizzazione nelle scuole della zona, per far conoscere ai ragazzi il valore del dono e del volontariato.'

export function Scuola() {
  const t = usePageText('progetto-scuola', 'Il progetto', SCUOLA)
  const resp = [
    ['Lidia Vignoni', 'Professoressa'], ['Paolo Forneris', 'Professore'], ['Laura Bersani', 'Dottoressa'],
    ['Giovanni Indaco', 'Vicepresidente'], ['Benedetta Maiocchi', 'Presidente'],
  ]
  return (
    <>
      <PageHero eyebrow="Le nostre attività" title="Progetto Scuola" text="Incontri di sensibilizzazione nelle scuole del territorio." />
      <Section>
        <h2 className="section-title mb-6">{t.title}</h2>
        <Paragraphs text={t.body} className="max-w-3xl text-lg text-ink/85" />
        <h3 className="mb-5 mt-12 text-2xl font-bold">Responsabili del progetto</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resp.map(([n, r]) => (
            <div key={n} className="card p-5">
              <p className="font-display text-lg font-bold text-navy">{n}</p>
              <p className="text-sm font-bold text-avis">{r}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/documenti" className="btn-red">Materiali e documenti</Link>
          <Link to="/galleria" className="btn-outline">Fotografie</Link>
        </div>
      </Section>
    </>
  )
}

const TORNEO_TXT =
  'Da diversi anni organizziamo insieme alla Virtus Pallavolo di Casorate Primo un grande torneo giovanile di pallavolo femminile.'

export function Torneo() {
  const t = usePageText('torneo-pallavolo', 'Il torneo', TORNEO_TXT)
  return (
    <>
      <PageHero eyebrow="Sport e territorio" title="Torneo di pallavolo AVIS" text="Il torneo giovanile organizzato con la Virtus Pallavolo di Casorate Primo." />
      <Section>
        <h2 className="section-title mb-6">{t.title}</h2>
        <Paragraphs text={t.body} className="max-w-3xl text-lg text-ink/85" />
        <h3 className="mb-6 mt-12 text-2xl font-bold">Archivio delle edizioni</h3>
        <div className="grid gap-5 md:grid-cols-2">
          {TORNEO.map((ed) => (
            <div key={ed.label} className="card p-7">
              <h4 className="font-display text-xl font-bold text-navy">{ed.label}</h4>
              <ul className="mt-3 space-y-2">
                {ed.links.map((l) => (
                  <li key={l.url}><ExtLink href={l.url} className="font-bold text-avis underline">{l.name}</ExtLink></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 rounded-3xl bg-mist p-6 text-ink/80">Locandine e risultati delle edizioni verranno pubblicati qui man mano che l’archivio viene completato.</p>
      </Section>
    </>
  )
}
