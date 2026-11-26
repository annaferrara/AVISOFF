import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSettings } from '../lib/settings'
import { Drop } from './ui'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/eventi', label: 'Eventi e News' },
  { to: '/contatti', label: 'Contatti' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { settings } = useSettings()
  useEffect(() => setOpen(false), [pathname])

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 font-display text-sm font-bold transition ${isActive ? 'bg-blush text-avis' : 'text-navy hover:bg-mist'}`

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur">
      <div className="wrap flex h-[68px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label="AVIS Casorate Primo — Home">
          {settings.logo_url
            ? <img src={settings.logo_url} alt="" className="h-10 w-auto" />
            : <Drop className="h-10 w-10" />}
          <span className="font-display text-sm font-extrabold uppercase leading-tight tracking-wide text-navy sm:text-base">
            AVIS <span className="text-avis">Casorate Primo</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu principale">
          {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>{l.label}</NavLink>)}
          <Link to="/come-donare" className="btn-red ml-3 !min-h-[44px] !px-6">Diventa donatore</Link>
        </nav>

        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-navy lg:hidden"
          onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? 'Chiudi menu' : 'Apri menu'}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" className="border-t border-navy/10 bg-white lg:hidden" aria-label="Menu mobile">
          <div className="wrap flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `rounded-2xl px-5 py-4 font-display font-bold ${isActive ? 'bg-blush text-avis' : 'text-navy'}`}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/come-donare" className="btn-red mt-2">Diventa donatore</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
