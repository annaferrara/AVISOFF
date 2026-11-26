import { Link } from 'react-router-dom'
import { useSettings } from '../lib/settings'
import { Drop } from './ui'

const pages = [
  { to: '/come-donare', label: 'Come e perché donare' },
  { to: '/tipi-di-donazione', label: 'Tipi di donazione' },
  { to: '/coro-gocce-d-amore', label: 'Coro Gocce d’Amore' },
  { to: '/progetto-scuola', label: 'Progetto Scuola' },
  { to: '/torneo-pallavolo', label: 'Torneo di pallavolo' },
  { to: '/galleria', label: 'Galleria fotografica' },
  { to: '/documenti', label: 'Documenti e trasparenza' },
]

export function Footer() {
  const { settings: s } = useSettings()
  const social = [
    { label: 'Instagram', href: s.socials.instagram },
    { label: 'Facebook', href: s.socials.facebook },
    { label: 'YouTube', href: s.socials.youtube },
  ].filter((x) => x.href)

  return (
    <footer className="bg-navy text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {s.logo_url ? <img src={s.logo_url} alt="" className="h-10 w-auto rounded bg-white p-1" /> : <Drop className="h-10 w-10" />}
            <p className="font-display text-lg font-extrabold uppercase">AVIS Casorate Primo</p>
          </div>
          <p className="mt-4 text-white/80">
            Associazione di donatori di sangue dal 1963. Insieme per diffondere la cultura del dono, della solidarietà e del volontariato.
          </p>
          <p className="mt-4 text-sm text-white/70">Codice fiscale {s.contacts.fiscal_code}</p>
        </div>

        <div>
          <h2 className="mb-4 !text-white text-lg">Scopri</h2>
          <ul className="space-y-2">
            {pages.map((p) => (
              <li key={p.to}><Link to={p.to} className="text-white/85 hover:text-white hover:underline">{p.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 !text-white text-lg">Contatti</h2>
          <ul className="space-y-2 text-white/85">
            <li><a href={`tel:${s.contacts.phone.replace(/\s/g, '')}`} className="hover:underline">{s.contacts.phone}</a></li>
            {s.contacts.emails.map((e) => <li key={e}><a href={`mailto:${e}`} className="break-all hover:underline">{e}</a></li>)}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {social.map((x) => (
              <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white hover:text-navy">{x.label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-2 py-5 text-sm text-white/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} AVIS Comunale Casorate Primo</p>
          <p className="flex gap-5">
            <Link to="/privacy" className="hover:text-white hover:underline">Privacy Policy</Link>
            <Link to="/cookie" className="hover:text-white hover:underline">Cookie Policy</Link>
            <Link to="/admin" className="hover:text-white hover:underline">Area riservata</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
