import { useState, type FormEvent } from 'react'
import { PageHero, Section } from '../components/ui'
import { useSettings } from '../lib/settings'
import { supabase } from '../lib/supabase'

export function Contatti() {
  const { settings: s } = useSettings()
  const c = s.contacts
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const tel = c.phone.replace(/[^\d+]/g, '')
  const social = [
    { label: 'Instagram', href: s.socials.instagram },
    { label: 'Facebook', href: s.socials.facebook },
    { label: 'YouTube', href: s.socials.youtube },
  ].filter((x) => x.href)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()
    const email = String(f.get('email') ?? '').trim()
    const message = String(f.get('message') ?? '').trim()
    if (String(f.get('website') ?? '')) return // honeypot anti-spam
    if (!supabase) {
      // Senza database il messaggio si invia dal programma di posta dell'utente.
      window.location.href = `mailto:${c.emails[0]}?subject=${encodeURIComponent('Messaggio dal sito')}&body=${encodeURIComponent(`${message}\n\n${name} — ${email}`)}`
      return
    }
    setState('sending')
    const { error } = await supabase.from('contact_messages').insert({ name, email, message })
    setState(error ? 'error' : 'ok')
    if (!error) e.currentTarget.reset()
  }

  return (
    <>
      <PageHero eyebrow="Contatti" title="Parliamone!" text="Per prenotare una visita, diventare donatore o chiedere informazioni scrivici o chiamaci." />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${tel}`} className="btn-red">Chiama ora</a>
              <a href={`mailto:${c.emails[0]}`} className="btn-navy">Scrivi una email</a>
            </div>
            <div className="card space-y-5 p-7">
              <div><p className="label">Telefono</p><a href={`tel:${tel}`} className="text-lg font-bold hover:text-avis">{c.phone}</a></div>
              <div><p className="label">Email</p>
                {c.emails.map((e) => <a key={e} href={`mailto:${e}`} className="block break-all text-lg font-bold hover:text-avis">{e}</a>)}</div>
              {c.pec && <div><p className="label">PEC</p><p className="break-all text-lg font-bold">{c.pec}</p></div>}
              <div><p className="label">Orari</p><p className="text-lg font-bold">{c.hours}</p></div>
              {c.address && <div><p className="label">Sede</p><p className="text-lg font-bold">{c.address}</p></div>}
              <div><p className="label">Codice fiscale</p><p className="text-lg font-bold">{c.fiscal_code}</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {social.map((x) => (
                <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer" className="btn-outline !min-h-[44px] !px-5 !py-2">{x.label}</a>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="card space-y-5 p-7" aria-label="Modulo di contatto">
            <h2 className="text-2xl font-bold">Scrivici un messaggio</h2>
            <div><label className="label" htmlFor="name">Nome e cognome</label><input id="name" name="name" required maxLength={120} className="field" autoComplete="name" /></div>
            <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required maxLength={200} className="field" autoComplete="email" /></div>
            <div><label className="label" htmlFor="message">Messaggio</label><textarea id="message" name="message" required rows={5} maxLength={4000} className="field" /></div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <p className="text-sm text-ink/65">Inviando il messaggio accetti il trattamento dei dati descritto nella <a href="/privacy" className="font-bold text-avis underline">Privacy Policy</a>.</p>
            <button className="btn-red w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Invio…' : 'Invia messaggio'}</button>
            {state === 'ok' && <p role="status" className="rounded-2xl bg-mist p-4 font-bold text-navy">Grazie! Il messaggio è stato inviato, ti risponderemo presto.</p>}
            {state === 'error' && <p role="alert" className="rounded-2xl bg-blush p-4 font-bold text-avis-dark">Non siamo riusciti a inviare il messaggio. Riprova o scrivici direttamente via email.</p>}
          </form>
        </div>
      </Section>

      <Section tone="mist">
        <h2 className="section-title mb-6">Dove siamo</h2>
        <div className="overflow-hidden rounded-5xl shadow-soft">
          <iframe title="Mappa della sede AVIS Casorate Primo" className="h-[420px] w-full border-0" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.map_query)}&output=embed`} />
        </div>
      </Section>
    </>
  )
}
