import { PageHero, Paragraphs, Section, usePageText } from '../components/ui'
import { useSettings } from '../lib/settings'

// Testi base ("bozza"): vanno fatti verificare dall'associazione prima della pubblicazione definitiva
// e si possono sostituire dal pannello admin (Pagine di testo → privacy / cookie).
const privacy = (email: string) =>
  `Titolare del trattamento è AVIS Comunale Casorate Primo (codice fiscale 96030470189). Per qualsiasi richiesta puoi scrivere a ${email}.\n\n` +
  'Dati trattati: se usi il modulo di contatto raccogliamo nome, email e testo del messaggio, esclusivamente per risponderti. I dati di accesso degli amministratori (email e password gestite da Supabase) servono solo per l’area riservata.\n\n' +
  'I dati non vengono venduti né usati per profilazione. Puoi chiedere accesso, rettifica o cancellazione dei tuoi dati in qualsiasi momento e proporre reclamo al Garante per la protezione dei dati personali.\n\n' +
  'Servizi di terze parti: il sito carica i caratteri da Google Fonts e, nella pagina Contatti, la mappa di Google Maps; i dati sono conservati su Supabase.'

const cookie =
  'Questo sito non utilizza cookie di profilazione né strumenti di analisi o pubblicità.\n\n' +
  'Usa solo dati tecnici strettamente necessari, ad esempio la sessione di accesso dell’area riservata (memorizzata nel browser degli amministratori).\n\n' +
  'Contenuti di terze parti incorporati (mappa di Google Maps nella pagina Contatti, caratteri di Google Fonts) possono impostare i propri cookie o registrare l’indirizzo IP secondo le informative di Google.'

export function Legal({ kind }: { kind: 'privacy' | 'cookie' }) {
  const { settings } = useSettings()
  const title = kind === 'privacy' ? 'Privacy Policy' : 'Cookie Policy'
  const page = usePageText(kind, title, kind === 'privacy' ? privacy(settings.contacts.emails[0] ?? '') : cookie)
  return (
    <>
      <PageHero title={title} />
      <Section><Paragraphs text={page.body} className="max-w-3xl text-lg text-ink/85" /></Section>
    </>
  )
}
