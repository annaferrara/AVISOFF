import { Link } from 'react-router-dom'
import { PageHero, Paragraphs, Section, usePageText } from '../components/ui'
import { useSettings } from '../lib/settings'

const PERCHE =
  'Donare il sangue è un gesto di solidarietà: significa dire con i fatti che la vita di chi sta soffrendo ci preoccupa.\n\n' +
  'Il sangue non è riproducibile in laboratorio ma è indispensabile alla vita: serve nei servizi di primo soccorso, in chirurgia, nella cura di alcune malattie, tra cui quelle oncologiche, e nei trapianti.\n\n' +
  'Tutti, domani, potremmo avere bisogno di sangue. La disponibilità di sangue è un patrimonio collettivo di solidarietà da cui ognuno può attingere nei momenti di necessità. Le donazioni di donatori periodici, volontari, anonimi, non retribuiti e consapevoli rappresentano una garanzia per la salute di chi riceve e di chi dona.'

export function ComeDonare() {
  const { settings: s } = useSettings()
  const perche = usePageText('come-donare', 'Perché donare', PERCHE)
  const tel = s.contacts.phone.replace(/[^\d+]/g, '')

  return (
    <>
      <PageHero eyebrow="Diventa donatore" title="Come e perché donare" text="Un piccolo gesto che può salvare una vita. Ecco tutto quello che c’è da sapere." />

      <Section>
        <h2 className="section-title mb-6">{perche.title}</h2>
        <Paragraphs text={perche.body} className="max-w-3xl text-lg text-ink/85" />
      </Section>

      <Section tone="mist">
        <h2 className="section-title mb-10">Come diventare donatore</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n: 1, t: 'Chi può donare', x: 'Possono donare le persone tra i 18 e i 65 anni in buona salute.' },
            { n: 2, t: 'Visita e analisi gratuite', x: 'Prima di donare servono indagini cliniche e di laboratorio gratuite: contattaci e prenoteremo la visita.' },
            { n: 3, t: 'La prima donazione', x: 'Con esito favorevole dei controlli si può donare sangue o plasma presso il Servizio Immunotrasfusionale.' },
          ].map((s2) => (
            <div key={s2.n} className="card p-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-avis font-display text-xl font-extrabold text-white">{s2.n}</div>
              <h3 className="text-xl font-bold">{s2.t}</h3>
              <p className="mt-2 text-ink/80">{s2.x}</p>
            </div>
          ))}
        </div>
        <div className="card mt-8 p-7">
          <h3 className="mb-3 text-xl font-bold">Dove si fanno visita e analisi</h3>
          <ul className="list-disc space-y-2 pl-5 text-ink/85">
            <li><strong>Autoemoteca AVIS Milano</strong>, periodicamente presso la nostra sede all’interno dell’Ospedale Carlo Mira di Casorate Primo.</li>
            <li><strong>Servizio Immunotrasfusionale (S.I.M.T.) del Policlinico di Pavia</strong>, V.le Golgi 19, Padiglione 12: controllo completo dello stato di salute con esami del sangue, visita medica ed elettrocardiogramma, gratuiti.</li>
          </ul>
        </div>
      </Section>

      <Section>
        <h2 className="section-title mb-10">Informazioni utili</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-7">
            <h3 className="text-xl font-bold">Orari di donazione al S.I.M.T. di Pavia</h3>
            <ul className="mt-3 space-y-2 text-ink/85">
              <li><strong>Aferesi:</strong> lunedì–venerdì 8,00/12.30 - 14.00; sabato 8.00/9.30</li>
              <li><strong>Sangue intero:</strong> lunedì–venerdì 9.00/11.00; sabato 8.00/10.00</li>
            </ul>
            <p className="mt-3 text-sm text-ink/65">Orari come pubblicati da AVIS Casorate Primo: per conferma contattaci prima di recarti.</p>
          </div>
          <div className="card p-7">
            <h3 className="text-xl font-bold">Ogni quanto si può donare</h3>
            <p className="mt-3 text-ink/85">
              Ogni tre mesi gli uomini e le donne non più in età fertile; ogni sei mesi le donne in età fertile. Con aferesi o plasmaferesi gli intervalli sono inferiori.
            </p>
            <p className="mt-3 text-ink/85">Ad ogni donazione si eseguono gratuitamente esami del sangue; per chi dona sangue intero l’esame completo gratuito si rinnova ogni anno.</p>
          </div>
          <div className="card p-7">
            <h3 className="text-xl font-bold">Servizio di accompagnamento</h3>
            <p className="mt-3 text-ink/85">Per chi ne ha necessità offriamo un servizio gratuito di accompagnamento. Siamo inoltre convenzionati con gli Ospedali San Paolo e San Carlo di Milano.</p>
          </div>
          <div className="card p-7">
            <h3 className="text-xl font-bold">Modulo di iscrizione</h3>
            <p className="mt-3 text-ink/85">Scarica il modulo, compilalo e inviacelo.</p>
            <a className="btn-navy mt-4" href="https://drive.google.com/file/d/1q2o4tb-rZJx8MA1-yqLnYZKM0Nhsv5Xz/view" target="_blank" rel="noopener noreferrer">Scarica il modulo</a>
          </div>
        </div>
        <p className="mt-8 rounded-3xl bg-blush p-5 text-sm text-ink/75">
          Le informazioni riportate provengono dalle pagine pubblicate da AVIS Casorate Primo. L’idoneità alla donazione viene sempre stabilita dal medico durante la visita.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`tel:${tel}`} className="btn-red">Chiamaci: {s.contacts.phone}</a>
          <Link to="/tipi-di-donazione" className="btn-outline">Scopri i tipi di donazione</Link>
        </div>
      </Section>
    </>
  )
}

const TIPI = [
  { t: 'Sangue intero', icon: '🩸', x: 'Il prelievo è innocuo per il donatore e dura circa 5–8 minuti. Il volume massimo prelevato, stabilito per legge, è 450 cc ±10%.' },
  { t: 'Plasma (plasmaferesi)', icon: '💧', x: 'Con un separatore cellulare si preleva solo il plasma, restituendo al donatore le altre componenti. Dura circa 35–50 minuti, si fa preferibilmente su appuntamento presso strutture trasfusionali abilitate. L’intervallo tra due donazioni di solo plasma può essere anche di soli 14 giorni.' },
  { t: 'Piastrine (piastrinoaferesi)', icon: '✨', x: 'Si prelevano solo le piastrine; serve un normale assetto emocoagulativo. Dura circa un’ora e mezza. Di norma non più di 6 l’anno; tra due piastrinoaferesi (o tra una piastrinoaferesi e una donazione di sangue intero) almeno 14 giorni, tra sangue intero e piastrinoaferesi un mese. Le piastrine si usano entro 5 giorni, ad esempio per leucemie, chemioterapia e trapianti di midollo.' },
  { t: 'Donazione multipla', icon: '🔁', x: 'I separatori cellulari permettono di donare più emocomponenti insieme, per esempio plasma e globuli rossi, globuli rossi e piastrine, o plasma e piastrine.' },
  { t: 'Autotrasfusione', icon: '🏥', x: 'Si preleva il sangue a chi sarà anche il ricevente, per compensare le perdite in interventi chirurgici programmati (il metodo più usato è il predeposito). Elimina le reazioni di incompatibilità e il rischio di trasmissione di malattie infettive.' },
]

export function TipiDonazione() {
  return (
    <>
      <PageHero eyebrow="Diventa donatore" title="Tipi di donazione" text="Sangue intero, plasma, piastrine: ogni donazione risponde a bisogni diversi." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {TIPI.map((t, i) => (
            <div key={t.t} className="card p-7">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${i % 2 ? 'bg-mist' : 'bg-blush'}`} aria-hidden="true">{t.icon}</div>
              <h2 className="text-2xl font-bold">{t.t}</h2>
              <p className="mt-2 text-ink/80">{t.x}</p>
            </div>
          ))}
        </div>
        <div className="card mt-8 p-7">
          <h2 className="text-2xl font-bold">A cosa serve il plasma</h2>
          <p className="mt-2 text-ink/80">
            Il plasma è la parte liquida del sangue (oltre il 90% acqua) e da esso si ottengono, tra le altre, albumina, immunoglobuline e fattori della coagulazione VIII e IX,
            fondamentali per chi soffre di emofilia A e B.
          </p>
        </div>
        <p className="mt-8 rounded-3xl bg-blush p-5 text-sm text-ink/75">
          Fonte: pagine del sito di AVIS Nazionale riprese dal sito di AVIS Casorate Primo. Per indicazioni mediche sul tuo caso rivolgiti al medico del servizio trasfusionale.
        </p>
        <Link to="/come-donare" className="btn-red mt-8">Come diventare donatore</Link>
      </Section>
    </>
  )
}
