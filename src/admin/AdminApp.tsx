import { useState, type FormEvent } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Drop, Spinner } from '../components/ui'
import { useAuth } from '../lib/auth'
import { isConfigured } from '../lib/supabase'
import { Notice } from './kit'
import { EventsAdmin } from './Events'
import { NewsAdmin } from './News'
import { DocumentsAdmin, PhotosAdmin } from './Media'
import { MessagesAdmin, PagesAdmin, SettingsAdmin, TeamAdmin } from './Content'

const nav = [
  { to: '/admin', label: 'Panoramica', end: true },
  { to: '/admin/eventi', label: 'Eventi' },
  { to: '/admin/news', label: 'News' },
  { to: '/admin/foto', label: 'Fotografie' },
  { to: '/admin/documenti', label: 'Documenti' },
  { to: '/admin/direttivo', label: 'Direttivo' },
  { to: '/admin/pagine', label: 'Testi delle pagine' },
  { to: '/admin/impostazioni', label: 'Contatti e home' },
  { to: '/admin/messaggi', label: 'Messaggi ricevuti' },
]

function Login() {
  const { signIn, session, isAdmin, loading } = useAuth()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true); setErr('')
    const res = await signIn(String(f.get('email')), String(f.get('password')))
    setBusy(false)
    if (res) setErr(res)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-blush p-5">
      <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-8">
        <div className="flex items-center gap-3"><Drop /><h1 className="text-2xl font-extrabold">Area riservata</h1></div>
        {!isConfigured && <Notice kind="error">Supabase non è configurato: compila il file .env.local (vedi .env.example).</Notice>}
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="field" /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
        {err && <Notice kind="error">{err}</Notice>}
        {session && !isAdmin && !loading && <Notice kind="error">Questo account non ha i permessi di amministratore.</Notice>}
        <button className="btn-red w-full" disabled={busy || !isConfigured}>{busy ? 'Accesso…' : 'Accedi'}</button>
        <Link to="/" className="block text-center font-bold text-navy underline">← Torna al sito</Link>
      </form>
    </div>
  )
}

function Shell() {
  const { session, isAdmin, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  if (loading) return <Spinner />
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />
  return (
    <div className="min-h-screen bg-mist lg:flex">
      <header className="flex items-center justify-between bg-white p-4 shadow-soft lg:hidden">
        <span className="flex items-center gap-2 font-display font-extrabold text-navy"><Drop className="h-8 w-8" /> Pannello</span>
        <button className="btn-outline !min-h-[44px] !px-5 !py-2 !text-xs" onClick={() => setOpen((o) => !o)} aria-expanded={open}>Menu</button>
      </header>
      <aside className={`${open ? 'block' : 'hidden'} w-full shrink-0 bg-white p-5 lg:block lg:min-h-screen lg:w-64`}>
        <p className="mb-5 hidden items-center gap-2 font-display text-lg font-extrabold text-navy lg:flex"><Drop className="h-8 w-8" /> Pannello AVIS</p>
        <nav className="flex flex-col gap-1" aria-label="Menu amministrazione">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
              className={({ isActive }) => `rounded-2xl px-4 py-3 font-display text-sm font-bold ${isActive ? 'bg-avis text-white' : 'text-navy hover:bg-mist'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 space-y-2 border-t border-navy/10 pt-5">
          <Link to="/" className="btn-outline w-full !min-h-[44px] !py-2 !text-xs" target="_blank">Vedi il sito</Link>
          <button className="btn-navy w-full !min-h-[44px] !py-2 !text-xs" onClick={signOut}>Esci</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="eventi" element={<EventsAdmin />} />
          <Route path="news" element={<NewsAdmin />} />
          <Route path="foto" element={<PhotosAdmin />} />
          <Route path="documenti" element={<DocumentsAdmin />} />
          <Route path="direttivo" element={<TeamAdmin />} />
          <Route path="pagine" element={<PagesAdmin />} />
          <Route path="impostazioni" element={<SettingsAdmin />} />
          <Route path="messaggi" element={<MessagesAdmin />} />
        </Routes>
      </main>
    </div>
  )
}

function Overview() {
  const tiles = [
    { to: '/admin/eventi', t: 'Eventi', x: 'Crea eventi, carica locandine, pubblica o salva in bozza.' },
    { to: '/admin/news', t: 'News', x: 'Scrivi comunicazioni, anche con pubblicazione programmata.' },
    { to: '/admin/foto', t: 'Fotografie', x: 'Crea album e carica le immagini della galleria.' },
    { to: '/admin/documenti', t: 'Documenti', x: 'Carica PDF e organizzali per categoria.' },
    { to: '/admin/direttivo', t: 'Direttivo', x: 'Aggiorna nomi, ruoli e foto del consiglio.' },
    { to: '/admin/pagine', t: 'Testi delle pagine', x: 'Modifica i testi di storia, coro, scuola e altro.' },
    { to: '/admin/impostazioni', t: 'Contatti e home', x: 'Telefono, email, social, logo e foto della home.' },
    { to: '/admin/messaggi', t: 'Messaggi ricevuti', x: 'Leggi i messaggi inviati dal modulo contatti.' },
  ]
  return (
    <>
      <h1 className="mb-2 text-3xl font-extrabold">Benvenuto!</h1>
      <p className="mb-8 text-ink/70">Scegli cosa vuoi aggiornare. Gli eventi passati finiscono da soli nell’archivio.</p>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="card p-6">
            <h2 className="text-xl font-bold">{t.t}</h2>
            <p className="mt-1 text-ink/75">{t.x}</p>
          </Link>
        ))}
      </div>
    </>
  )
}

export function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Shell />} />
    </Routes>
  )
}
