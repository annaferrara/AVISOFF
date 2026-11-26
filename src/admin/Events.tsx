import { useState, type FormEvent } from 'react'
import { Empty, Spinner, uploadMediaFile } from './helpers'
import { fetchEvents, useAsync } from '../lib/data'
import { fmtDate, fromLocalInput, isPast, toLocalInput } from '../lib/format'
import { supabase } from '../lib/supabase'
import type { EventItem } from '../lib/types'
import { EventView } from '../pages/Dettagli'
import { AdminTitle, Area, Check, ConfirmButton, ImageField, Notice, Select, Text, errMsg } from './kit'

const blank = (): EventItem => ({
  id: '', title: '', summary: '', description: '', starts_at: new Date().toISOString(), ends_at: null,
  all_day: false, location: '', poster_url: null, gallery: [], external_url: '', status: 'draft',
})

export function EventsAdmin() {
  const { data, loading, reload } = useAsync(() => fetchEvents(true), [] as EventItem[])
  const [edit, setEdit] = useState<EventItem | null>(null)
  const [preview, setPreview] = useState(false)
  const [msg, setMsg] = useState<{ k: 'ok' | 'error'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !edit) return
    setBusy(true); setMsg(null)
    const { id, ...rest } = edit
    const payload = { ...rest, external_url: rest.external_url || null, summary: rest.summary || null, location: rest.location || null }
    const res = id ? await supabase.from('events').update(payload).eq('id', id) : await supabase.from('events').insert(payload)
    setBusy(false)
    if (res.error) return setMsg({ k: 'error', t: errMsg(res.error) })
    setMsg({ k: 'ok', t: edit.status === 'published' ? 'Evento salvato e pubblicato.' : 'Bozza salvata.' })
    setEdit(null); reload()
  }

  async function remove(id: string) {
    const { error } = await supabase!.from('events').delete().eq('id', id)
    if (error) setMsg({ k: 'error', t: errMsg(error) }); else { setMsg({ k: 'ok', t: 'Evento eliminato.' }); reload() }
  }

  async function addGallery(files: FileList | null) {
    if (!files || !edit) return
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadMediaFile(f, 'eventi')))
      setEdit({ ...edit, gallery: [...edit.gallery, ...urls] })
    } catch (err) { setMsg({ k: 'error', t: errMsg(err) }) }
  }

  if (edit) {
    const set = (p: Partial<EventItem>) => setEdit({ ...edit, ...p })
    return (
      <>
        <AdminTitle title={edit.id ? 'Modifica evento' : 'Nuovo evento'}
          action={<button className="btn-outline !min-h-[44px] !py-2 !text-xs" onClick={() => setPreview((p) => !p)}>{preview ? 'Torna alla modifica' : 'Anteprima'}</button>} />
        {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
        {preview ? (
          <div className="overflow-hidden rounded-4xl border-4 border-dashed border-navy/20 bg-white"><EventView ev={edit} /></div>
        ) : (
          <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
            <Text label="Titolo" value={edit.title} onChange={(v) => set({ title: v })} required />
            <Text label="Breve descrizione" value={edit.summary ?? ''} onChange={(v) => set({ summary: v })} hint="Compare sulle card." />
            <Area label="Descrizione completa" value={edit.description} onChange={(v) => set({ description: v })} rows={8} hint="Una riga vuota crea un nuovo paragrafo." />
            <div className="grid gap-5 sm:grid-cols-2">
              <Text label="Inizio" type="datetime-local" value={toLocalInput(edit.starts_at)} onChange={(v) => set({ starts_at: fromLocalInput(v) ?? edit.starts_at })} required />
              <Text label="Fine (facoltativa)" type="datetime-local" value={toLocalInput(edit.ends_at)} onChange={(v) => set({ ends_at: fromLocalInput(v) })} />
            </div>
            <Check label="Evento di una giornata intera (senza orario)" checked={edit.all_day} onChange={(v) => set({ all_day: v })} />
            <Text label="Luogo" value={edit.location ?? ''} onChange={(v) => set({ location: v })} />
            <ImageField label="Locandina" value={edit.poster_url} onChange={(u) => set({ poster_url: u })} folder="locandine" />
            <div>
              <p className="label">Fotografie</p>
              <div className="flex flex-wrap gap-3 rounded-3xl bg-mist p-4">
                {edit.gallery.map((u) => (
                  <div key={u} className="relative">
                    <img src={u} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                    <button type="button" aria-label="Rimuovi foto" className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-avis text-white"
                      onClick={() => set({ gallery: edit.gallery.filter((x) => x !== u) })}>×</button>
                  </div>
                ))}
                <label className="btn-outline cursor-pointer !min-h-[44px] !px-5 !py-2 !text-xs">
                  Aggiungi foto<input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addGallery(e.target.files)} />
                </label>
              </div>
            </div>
            <Text label="Collegamento esterno (facoltativo)" type="url" value={edit.external_url ?? ''} onChange={(v) => set({ external_url: v })} placeholder="https://" />
            <Select label="Stato" value={edit.status} onChange={(v) => set({ status: v })}
              options={[{ value: 'draft', label: 'Bozza (non visibile)' }, { value: 'published', label: 'Pubblicato' }]} />
            <div className="flex flex-wrap gap-3">
              <button className="btn-red" disabled={busy}>{busy ? 'Salvataggio…' : 'Salva'}</button>
              <button type="button" className="btn-outline" onClick={() => { setEdit(null); setPreview(false) }}>Annulla</button>
            </div>
          </form>
        )}
      </>
    )
  }

  return (
    <>
      <AdminTitle title="Eventi" action={<button className="btn-red" onClick={() => { setMsg(null); setEdit(blank()) }}>+ Nuovo evento</button>} />
      {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
      {loading ? <Spinner /> : data.length === 0 ? <Empty title="Nessun evento" text="Crea il primo evento con il pulsante in alto." /> : (
        <div className="space-y-3">
          {[...data].reverse().map((ev) => (
            <div key={ev.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-lg font-bold text-navy">{ev.title}</p>
                <p className="text-sm text-ink/70">
                  {fmtDate(ev.starts_at)} · {ev.status === 'published' ? 'Pubblicato' : 'Bozza'}{isPast(ev) ? ' · In archivio' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn-navy !min-h-[44px] !px-5 !py-2 !text-xs" onClick={() => { setMsg(null); setEdit(ev) }}>Modifica</button>
                <ConfirmButton label="Elimina" what={`l’evento “${ev.title}”`} onConfirm={() => remove(ev.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
