import { useState, type FormEvent } from 'react'
import { fetchNews, useAsync } from '../lib/data'
import { fmtDate, fromLocalInput, toLocalInput } from '../lib/format'
import { supabase, uploadMedia } from '../lib/supabase'
import type { NewsItem } from '../lib/types'
import { NewsView } from '../pages/Dettagli'
import { Empty, Spinner } from '../components/ui'
import { AdminTitle, Area, ConfirmButton, ImageField, Notice, Select, Text, errMsg } from './kit'

const blank = (): NewsItem => ({
  id: '', title: '', summary: '', body: '', image_url: null, attachments: [], external_url: '',
  status: 'draft', publish_at: null, created_at: new Date().toISOString(),
})

export function NewsAdmin() {
  const { data, loading, reload } = useAsync(() => fetchNews(true), [] as NewsItem[])
  const [edit, setEdit] = useState<NewsItem | null>(null)
  const [preview, setPreview] = useState(false)
  const [msg, setMsg] = useState<{ k: 'ok' | 'error'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !edit) return
    setBusy(true); setMsg(null)
    const { id, created_at: _c, ...rest } = edit
    const payload = { ...rest, summary: rest.summary || null, external_url: rest.external_url || null }
    const res = id ? await supabase.from('news').update(payload).eq('id', id) : await supabase.from('news').insert(payload)
    setBusy(false)
    if (res.error) return setMsg({ k: 'error', t: errMsg(res.error) })
    setMsg({ k: 'ok', t: edit.status === 'published' ? (edit.publish_at && new Date(edit.publish_at) > new Date() ? 'News programmata.' : 'News pubblicata.') : 'Bozza salvata.' })
    setEdit(null); reload()
  }

  async function remove(id: string) {
    const { error } = await supabase!.from('news').delete().eq('id', id)
    if (error) setMsg({ k: 'error', t: errMsg(error) }); else { setMsg({ k: 'ok', t: 'News eliminata.' }); reload() }
  }

  async function addAttachment(files: FileList | null) {
    const f = files?.[0]
    if (!f || !edit) return
    try {
      const url = await uploadMedia(f, 'allegati')
      setEdit({ ...edit, attachments: [...edit.attachments, { name: f.name, url }] })
    } catch (err) { setMsg({ k: 'error', t: errMsg(err) }) }
  }

  if (edit) {
    const set = (p: Partial<NewsItem>) => setEdit({ ...edit, ...p })
    return (
      <>
        <AdminTitle title={edit.id ? 'Modifica news' : 'Nuova news'}
          action={<button className="btn-outline !min-h-[44px] !py-2 !text-xs" onClick={() => setPreview((p) => !p)}>{preview ? 'Torna alla modifica' : 'Anteprima'}</button>} />
        {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
        {preview ? (
          <div className="overflow-hidden rounded-4xl border-4 border-dashed border-navy/20 bg-white"><NewsView item={edit} /></div>
        ) : (
          <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
            <Text label="Titolo" value={edit.title} onChange={(v) => set({ title: v })} required />
            <Text label="Riassunto" value={edit.summary ?? ''} onChange={(v) => set({ summary: v })} hint="Compare sulla card." />
            <Area label="Testo" value={edit.body} onChange={(v) => set({ body: v })} rows={10} hint="Una riga vuota crea un nuovo paragrafo." />
            <ImageField label="Immagine" value={edit.image_url} onChange={(u) => set({ image_url: u })} folder="news" />
            <div>
              <p className="label">Allegati</p>
              <div className="space-y-2 rounded-3xl bg-mist p-4">
                {edit.attachments.map((a) => (
                  <div key={a.url} className="flex items-center justify-between gap-3">
                    <input className="field" value={a.name} aria-label="Nome allegato"
                      onChange={(e) => set({ attachments: edit.attachments.map((x) => x.url === a.url ? { ...x, name: e.target.value } : x) })} />
                    <button type="button" className="font-bold text-avis underline" onClick={() => set({ attachments: edit.attachments.filter((x) => x.url !== a.url) })}>Rimuovi</button>
                  </div>
                ))}
                <label className="btn-outline cursor-pointer !min-h-[44px] !px-5 !py-2 !text-xs">
                  Aggiungi allegato<input type="file" className="sr-only" onChange={(e) => addAttachment(e.target.files)} />
                </label>
              </div>
            </div>
            <Text label="Collegamento esterno (facoltativo)" type="url" value={edit.external_url ?? ''} onChange={(v) => set({ external_url: v })} placeholder="https://" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select label="Stato" value={edit.status} onChange={(v) => set({ status: v })}
                options={[{ value: 'draft', label: 'Bozza (non visibile)' }, { value: 'published', label: 'Pubblicata' }]} />
              <Text label="Pubblica il (facoltativo)" type="datetime-local" value={toLocalInput(edit.publish_at)}
                onChange={(v) => set({ publish_at: fromLocalInput(v) })} hint="Con stato “Pubblicata” la news compare da questa data." />
            </div>
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
      <AdminTitle title="News" action={<button className="btn-red" onClick={() => { setMsg(null); setEdit(blank()) }}>+ Nuova news</button>} />
      {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
      {loading ? <Spinner /> : data.length === 0 ? <Empty title="Nessuna news" text="Scrivi la prima comunicazione con il pulsante in alto." /> : (
        <div className="space-y-3">
          {data.map((n) => (
            <div key={n.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-lg font-bold text-navy">{n.title}</p>
                <p className="text-sm text-ink/70">
                  {n.status === 'published' ? (n.publish_at && new Date(n.publish_at) > new Date() ? `Programmata per il ${fmtDate(n.publish_at)}` : 'Pubblicata') : 'Bozza'} · {fmtDate(n.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn-navy !min-h-[44px] !px-5 !py-2 !text-xs" onClick={() => { setMsg(null); setEdit(n) }}>Modifica</button>
                <ConfirmButton label="Elimina" what={`la news “${n.title}”`} onConfirm={() => remove(n.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
