import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo({ top: 0 }), [pathname])
  return (
    <>
      <a href="#contenuto" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-5 focus:py-3">
        Vai al contenuto
      </a>
      <Header />
      <main id="contenuto"><Outlet /></main>
      <Footer />
    </>
  )
}
