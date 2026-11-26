import { Link, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ChiSiamo } from './pages/ChiSiamo'
import { EventiNews } from './pages/EventiNews'
import { EventoDettaglio, NewsDettaglio } from './pages/Dettagli'
import { Contatti } from './pages/Contatti'
import { ComeDonare, TipiDonazione } from './pages/Donare'
import { Coro, Scuola, Torneo } from './pages/Attivita'
import { Galleria } from './pages/Galleria'
import { Documenti } from './pages/Documenti'
import { Legal } from './pages/Legal'
import { AdminApp } from './admin/AdminApp'

function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <h1 className="text-4xl font-extrabold">Pagina non trovata</h1>
      <p className="mt-3 text-ink/70">Il collegamento potrebbe essere cambiato.</p>
      <Link to="/" className="btn-red mt-8">Torna alla home</Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chi-siamo" element={<ChiSiamo />} />
        <Route path="eventi" element={<EventiNews />} />
        <Route path="eventi/:id" element={<EventoDettaglio />} />
        <Route path="news/:id" element={<NewsDettaglio />} />
        <Route path="contatti" element={<Contatti />} />
        <Route path="come-donare" element={<ComeDonare />} />
        <Route path="tipi-di-donazione" element={<TipiDonazione />} />
        <Route path="coro-gocce-d-amore" element={<Coro />} />
        <Route path="progetto-scuola" element={<Scuola />} />
        <Route path="torneo-pallavolo" element={<Torneo />} />
        <Route path="galleria" element={<Galleria />} />
        <Route path="documenti" element={<Documenti />} />
        <Route path="privacy" element={<Legal kind="privacy" />} />
        <Route path="cookie" element={<Legal kind="cookie" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/*" element={<AdminApp />} />
    </Routes>
  )
}
