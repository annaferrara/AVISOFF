import { useEffect, useState, type FormEvent } from 'react'
import { Empty, Spinner } from '../components/ui'
import { fetchMessages, fetchPage, fetchTeam, useAsync } from '../lib/data'
import { fmtDate, fmtTime } from '../lib/format'
import { useSettings } from '../lib/settings'
import { supabase } from '../lib/supabase'
import type { ContactMessage, Settings, TeamGroup, TeamMember } from '../lib/types'
import { AdminTitle, Area, ConfirmButton, ImageField, Notice, Select, Text, errMsg } from './kit'

type Msg = { k: 'ok' | 'error'; t: string } | null

/* ============================================================ DIRETTIVO */
const GROUPS: { value: TeamGroup; label: string }[] = [
  { value: 'direttivo', label: 'Direttivo (cariche)' },
  { value: 'consigliere', label: 'Consigliere' },
  { value: 'collaboratore', label: 'Collaboratore' },
]
const blankMember = (): TeamMember => ({ id: '', full_name: '', role: '', group_name: 'consigliere', bio: '', photo_url: null, sort: 50 })

export function TeamAdmin() {
  const { data, loading, reload } = useAsync(() => fetchTeam(true), [] as TeamMember[])
  const [edit, setEdit] = useState<TeamMember | null>(null)
  const [msg, setMsg] = useState<Msg>(null)

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !edit) return
    const { id, ...rest } = edit
    const payload = { ...rest, bio: rest.bio || null }
    const res = id ? await supabase.from('team_members').update(payload).eq('id', id) : await supabase.from('team_members').insert(payload)
    if (res.error) return setMsg({ k: 'error', t: errMsg(res.error) })
    setMsg({ k: 'ok', t: 'Salvato.' }); setEdit(null); reload()
  }
  async function remove(id: string) {
    const { error } = await supabase!.from('team_members').delete().eq('id', id)
    setMsg(error ? { k: 'error', t: errMsg(error) } : { k: 'ok', t: 'Persona eliminata.' }); reload()
  }

  if (edit) {
    const set = (p: Partial<TeamMember>) => setEdit({ ...edit, ...p })
    return (
      <>
        <AdminTitle title={edit.id ? 'Modifica persona' : 'Nuova persona'} />
        <form onSubmit={save} className="card max-w-2xl space-y-5 p-6">
          <Text label="Nome e cognome" value={edit.full_name} onChange={(v) => set({ full_name: v })} required />
          <Text label="Ruolo" value={edit.role} onChange={(v) => set({ role: v })} placeholder="Es. Presidente" />
          <Select label="Gruppo" value={edit.group_name} onChange={(v) => set({ group_name: v })} options={GROUPS} />
          <Area label="Breve descrizione" rows={3} value={edit.bio ?? ''} onChange={(v) => set({ bio: v })} />
          <ImageField label="Fotografia" value={edit.photo_url} onChange={(u) => set({ photo_url: u })} folder="direttivo" />
          <Text label="Ordine (numero più basso = prima)" type="number" value={String(edit.sort)} onChange={(v) => set({ sort: Number(v) || 0 })} />
          <div className="flex gap-3">
            <button className="btn-red">Salva</button>
            <button type="button" className="btn-outline" onClick={() => setEdit(null)}>Annulla</button>
          </div>
        </form>
      </>
    )
  }
  return (
    <>
      <AdminTitle title="Direttivo" action={<button className="btn-red" onClick={() => { setMsg(null); setEdit(blankMember()) }}>+ Aggiungi persona</button>} />
      {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
      {loading ? <Spinner /> : data.length === 0 ? (
        <Empty title="Nessuna persona in archivio"
          text="Finché l’elenco è vuoto il sito mostra il direttivo 2025/2028 preso dal vecchio sito. Aggiungi qui le persone per gestirle dal pannello (dovrai inserirle tutte)." />
      ) : (
        <div className="space-y-3">
          {data.map((m) => (
            <div key={m.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-lg font-bold text-navy">{m.full_name}</p>
                <p className="text-sm text-ink/70">{m.role} · {GROUPS.find((g) => g.value === m.group_name)?.label}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-navy !min-h-[44px] !px-5 !py-2 !text-xs" onClick={() => { setMsg(null); setEdit(m) }}>Modifica</button>
                <ConfirmButton label="Elimina" what={m.full_name} onConfirm={() => remove(m.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ============================================================ TESTI DELLE PAGINE */
const PAGES = [
  { slug: 'chi-siamo', label: 'Chi siamo — La nostra storia' },
  { slug: 'coro-gocce-d-amore', label: 'Coro Gocce d’Amore' },
  { slug: 'progetto-scuola', label: 'Progetto Scuola' },
  { slug: 'torneo-pallavolo', label: 'Torneo di pallavolo' },
  { slug: 'come-donare', label: 'Come donare — Perché donare' },
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'cookie', label: 'Cookie Policy' },
]

export function PagesAdmin() {
  const [slug, setSlug] = useState(PAGES[0].slug)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [msg, setMsg] = useState<Msg>(null)

  useEffect(() => {
    setLoaded(false); setMsg(null)
    fetchPage(slug).then((p) => { setTitle(p?.title ?? PAGES.find((x) => x.slug === slug)!.label); setBody(p?.body ?? ''); setLoaded(true) })
  }, [slug])

  async function save(e: FormEvent) {
    e.preventDefault()
    const { error } = await supabase!.from('pages').upsert({ slug, title, body, updated_at: new Date().toISOString() })
    setMsg(error ? { k: 'error', t: errMsg(error) } : { k: 'ok', t: 'Testo salvato.' })
  }

  return (
    <>
      <AdminTitle title="Testi delle pagine" />
      <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
        <Select label="Pagina da modificare" value={slug} onChange={setSlug} options={PAGES.map((p) => ({ value: p.slug, label: p.label }))} />
        {!loaded ? <Spinner /> : (
          <>
            <Text label="Titolo della sezione" value={title} onChange={setTitle} />
            <Area label="Testo" rows={14} value={body} onChange={setBody}
              hint="Una riga vuota crea un nuovo paragrafo. Se lasci il testo vuoto il sito usa il testo originale ripreso dal vecchio sito." />
            {msg && <Notice kind={msg.k}>{msg.t}</Notice>}
            <button className="btn-red">Salva</button>
          </>
        )}
      </form>
    </>
  )
}

/* ============================================================ CONTATTI, SOCIAL, HOME, LOGO */
export function SettingsAdmin() {
  const { settings, reload } = useSettings()
  const [s, setS] = useState<Settings>(settings)
  const [emails, setEmails] = useState(settings.contacts.emails.join('\n'))
  const [msg, setMsg] = useState<Msg>(null)
  useEffect(() => { setS(settings); setEmails(settings.contacts.emails.join('\n')) }, [settings])

  const c = (p: Partial<Settings['contacts']>) => setS({ ...s, contacts: { ...s.contacts, ...p } })
  const so = (p: Partial<Settings['socials']>) => setS({ ...s, socials: { ...s.socials, ...p } })
  const h = (p: Partial<Settings['home']>) => setS({ ...s, home: { ...s.home, ...p } })
  const act = (i: number, url: string | null) => {
    const arr = [...s.home.activity_images]; while (arr.length < 4) arr.push(null); arr[i] = url; h({ activity_images: arr })
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    const contacts = { ...s.contacts, emails: emails.split('\n').map((x) => x.trim()).filter(Boolean) }
    const rows = [
      { key: 'contacts', value: contacts }, { key: 'socials', value: s.socials },
      { key: 'home', value: s.home }, { key: 'logo', value: { url: s.logo_url } },
    ]
    const { error } = await supabase!.from('site_settings').upsert(rows)
    if (error) return setMsg({ k: 'error', t: errMsg(error) })
    setMsg({ k: 'ok', t: 'Impostazioni salvate.' }); reload()
  }

  const labels = ['Coro Gocce d’Amore', 'Progetto Scuola', 'Sport e territorio', 'Iniziative associative']
  return (
    <>
      <AdminTitle title="Contatti, social e home" />
      <form onSubmit={save} className="max-w-3xl space-y-8">
        <section className="card space-y-5 p-6">
          <h2 className="text-xl font-bold">Contatti</h2>
          <Area label="Email (una per riga)" rows={3} value={emails} onChange={setEmails} />
          <Text label="PEC" value={s.contacts.pec} onChange={(v) => c({ pec: v })} />
          <Text label="Telefono" value={s.contacts.phone} onChange={(v) => c({ phone: v })} />
          <Text label="Orari" value={s.contacts.hours} onChange={(v) => c({ hours: v })} />
          <Text label="Indirizzo della sede" value={s.contacts.address} onChange={(v) => c({ address: v })} />
          <Text label="Ricerca per la mappa" value={s.contacts.map_query} onChange={(v) => c({ map_query: v })} hint="Testo cercato su Google Maps, es. via e comune della sede." />
          <Text label="Codice fiscale" value={s.contacts.fiscal_code} onChange={(v) => c({ fiscal_code: v })} />
        </section>
        <section className="card space-y-5 p-6">
          <h2 className="text-xl font-bold">Social</h2>
          <Text label="Instagram" type="url" value={s.socials.instagram} onChange={(v) => so({ instagram: v })} />
          <Text label="Facebook" type="url" value={s.socials.facebook} onChange={(v) => so({ facebook: v })} />
          <Text label="YouTube" type="url" value={s.socials.youtube} onChange={(v) => so({ youtube: v })} />
        </section>
        <section className="card space-y-5 p-6">
          <h2 className="text-xl font-bold">Logo e immagini della home</h2>
          <ImageField label="Logo ufficiale AVIS" value={s.logo_url} onChange={(u) => setS({ ...s, logo_url: u })} folder="brand" />
          <ImageField label="Fotografia principale (hero)" value={s.home.hero_image_url} onChange={(u) => h({ hero_image_url: u })} folder="home" />
          <ImageField label="Fotografia “Chi siamo”" value={s.home.about_image_url} onChange={(u) => h({ about_image_url: u })} folder="home" />
          {labels.map((l, i) => (
            <ImageField key={l} label={`Card attività: ${l}`} value={s.home.activity_images[i] ?? null} onChange={(u) => act(i, u)} folder="home" />
          ))}
        </section>
        {msg && <Notice kind={msg.k}>{msg.t}</Notice>}
        <button className="btn-red">Salva tutto</button>
      </form>
    </>
  )
}

/* ============================================================ MESSAGGI */
export function MessagesAdmin() {
  const { data, loading, reload } = useAsync(() => fetchMessages(), [] as ContactMessage[])
  async function remove(id: string) { await supabase!.from('contact_messages').delete().eq('id', id); reload() }
  return (
    <>
      <AdminTitle title="Messaggi ricevuti" />
      {loading ? <Spinner /> : data.length === 0 ? <Empty title="Nessun messaggio" /> : (
        <div className="space-y-4">
          {data.map((m) => (
            <article key={m.id} className="card p-6">
              <p className="font-display text-lg font-bold text-navy">{m.name} · <a className="text-avis underline" href={`mailto:${m.email}`}>{m.email}</a></p>
              <p className="text-sm text-ink/60">{fmtDate(m.created_at)} {fmtTime(m.created_at)}</p>
              <p className="mt-3 whitespace-pre-line">{m.message}</p>
              <div className="mt-4"><ConfirmButton label="Elimina" what="questo messaggio" onConfirm={() => remove(m.id)} /></div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
