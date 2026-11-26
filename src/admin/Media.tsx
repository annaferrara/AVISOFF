import { useState, type FormEvent } from 'react'
import { Empty, Spinner } from '../components/ui'
import { fetchAlbums, fetchDocuments, fetchPhotos, useAsync } from '../lib/data'
import { supabase, uploadMedia } from '../lib/supabase'
import type { Album, AlbumCategory, DocCategory, DocumentItem, Photo } from '../lib/types'
import { CATEGORY_LABEL } from '../pages/Galleria'
import { DOC_LABEL } from '../pages/Documenti'
import { AdminTitle, Check, ConfirmButton, ImageField, Notice, Select, Text, errMsg } from './kit'

/** Cancella (se possibile) il file dallo storage di Supabase dato il suo URL pubblico. */
async function removeFromStorage(url: string) {
  const marker = '/object/public/media/'
  const i = url.indexOf(marker)
  if (i >= 0 && supabase) await supabase.storage.from('media').remove([decodeURIComponent(url.slice(i + marker.length))])
}

/* ============================================================ FOTO */
export function PhotosAdmin() {
  const albums = useAsync(() => fetchAlbums(), [] as Album[])
  const photos = useAsync(() => fetchPhotos(), [] as Photo[])
  const [sel, setSel] = useState<string>('')
  const [newTitle, setNewTitle] = useState('')
  const [newCat, setNewCat] = useState<AlbumCategory>('eventi')
  const [msg, setMsg] = useState<{ k: 'ok' | 'error'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const current = albums.data.find((a) => a.id === (sel || albums.data[0]?.id))
  const inAlbum = photos.data.filter((p) => p.album_id === current?.id)

  async function createAlbum(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !newTitle.trim()) return
    const { error } = await supabase.from('albums').insert({ title: newTitle.trim(), category: newCat, sort: albums.data.length + 1 })
    if (error) return setMsg({ k: 'error', t: errMsg(error) })
    setNewTitle(''); setMsg({ k: 'ok', t: 'Album creato.' }); albums.reload()
  }
  async function renameAlbum(a: Album, title: string, category: AlbumCategory) {
    const { error } = await supabase!.from('albums').update({ title, category }).eq('id', a.id)
    setMsg(error ? { k: 'error', t: errMsg(error) } : { k: 'ok', t: 'Album aggiornato.' }); albums.reload()
  }
  async function deleteAlbum(a: Album) {
    const urls = photos.data.filter((p) => p.album_id === a.id).map((p) => p.url)
    const { error } = await supabase!.from('albums').delete().eq('id', a.id)
    if (error) return setMsg({ k: 'error', t: errMsg(error) })
    await Promise.all(urls.map(removeFromStorage))
    setSel(''); setMsg({ k: 'ok', t: 'Album eliminato.' }); albums.reload(); photos.reload()
  }
  async function upload(files: FileList | null) {
    if (!files || !current || !supabase) return
    setBusy(true); setMsg(null)
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadMedia(f, `galleria/${current.category}`)))
      const { error } = await supabase.from('photos').insert(urls.map((url) => ({ album_id: current.id, url })))
      if (error) throw error
      setMsg({ k: 'ok', t: `${urls.length} foto caricate.` }); photos.reload()
    } catch (err) { setMsg({ k: 'error', t: errMsg(err) }) } finally { setBusy(false) }
  }
  async function deletePhoto(p: Photo) {
    const { error } = await supabase!.from('photos').delete().eq('id', p.id)
    if (error) return setMsg({ k: 'error', t: errMsg(error) })
    await removeFromStorage(p.url); photos.reload()
  }
  async function caption(p: Photo, text: string) {
    await supabase!.from('photos').update({ caption: text || null }).eq('id', p.id)
  }

  return (
    <>
      <AdminTitle title="Fotografie" />
      {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
      {albums.loading ? <Spinner /> : (
        <div className="space-y-8">
          <form onSubmit={createAlbum} className="card grid max-w-3xl items-end gap-4 p-6 sm:grid-cols-[1fr_auto_auto]">
            <Text label="Nuovo album" value={newTitle} onChange={setNewTitle} placeholder="Es. Festa sociale 2026" />
            <Select label="Categoria" value={newCat} onChange={setNewCat}
              options={(Object.keys(CATEGORY_LABEL) as AlbumCategory[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] }))} />
            <button className="btn-red">Crea album</button>
          </form>

          {albums.data.length === 0 ? <Empty title="Nessun album" text="Crea un album per iniziare a caricare fotografie." /> : (
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                {albums.data.map((a) => (
                  <button key={a.id} onClick={() => setSel(a.id)}
                    className={`rounded-full px-5 py-3 font-display text-sm font-bold ${current?.id === a.id ? 'bg-avis text-white' : 'bg-white text-navy shadow-soft'}`}>{a.title}</button>
                ))}
              </div>
              {current && (
                <div className="card space-y-6 p-6">
                  <AlbumEditor key={current.id} album={current} onSave={renameAlbum} onDelete={deleteAlbum} />
                  <label className="btn-navy cursor-pointer">
                    {busy ? 'Caricamento…' : 'Carica fotografie'}
                    <input type="file" accept="image/*" multiple className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files)} />
                  </label>
                  {inAlbum.length === 0 ? <p className="text-ink/70">Questo album è ancora vuoto.</p> : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {inAlbum.map((p) => (
                        <div key={p.id} className="space-y-2">
                          <img src={p.url} alt={p.caption ?? ''} className="aspect-square w-full rounded-3xl object-cover" />
                          <input className="field !py-2 text-sm" defaultValue={p.caption ?? ''} placeholder="Didascalia" aria-label="Didascalia"
                            onBlur={(e) => caption(p, e.target.value)} />
                          <ConfirmButton label="Elimina" what="questa foto" onConfirm={() => deletePhoto(p)} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

function AlbumEditor({ album, onSave, onDelete }: {
  album: Album; onSave: (a: Album, t: string, c: AlbumCategory) => void; onDelete: (a: Album) => void
}) {
  const [title, setTitle] = useState(album.title)
  const [cat, setCat] = useState<AlbumCategory>(album.category)
  return (
    <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_auto_auto]">
      <Text label="Titolo album" value={title} onChange={setTitle} />
      <Select label="Categoria" value={cat} onChange={setCat}
        options={(Object.keys(CATEGORY_LABEL) as AlbumCategory[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] }))} />
      <button type="button" className="btn-outline" onClick={() => onSave(album, title, cat)}>Salva</button>
      <ConfirmButton label="Elimina album" what={`l’album “${album.title}” e tutte le sue foto`} onConfirm={() => onDelete(album)} />
    </div>
  )
}

/* ============================================================ DOCUMENTI */
const blankDoc = (): DocumentItem => ({ id: '', title: '', category: 'altri', url: '', doc_date: null, is_published: true, sort: 0 })

export function DocumentsAdmin() {
  const { data, loading, reload } = useAsync(() => fetchDocuments(true), [] as DocumentItem[])
  const [edit, setEdit] = useState<DocumentItem | null>(null)
  const [msg, setMsg] = useState<{ k: 'ok' | 'error'; t: string } | null>(null)

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !edit) return
    if (!edit.url) return setMsg({ k: 'error', t: 'Carica un PDF o inserisci un collegamento.' })
    const { id, ...rest } = edit
    const payload = { ...rest, doc_date: rest.doc_date || null }
    const res = id ? await supabase.from('documents').update(payload).eq('id', id) : await supabase.from('documents').insert(payload)
    if (res.error) return setMsg({ k: 'error', t: errMsg(res.error) })
    setMsg({ k: 'ok', t: 'Documento salvato.' }); setEdit(null); reload()
  }
  async function remove(d: DocumentItem) {
    const { error } = await supabase!.from('documents').delete().eq('id', d.id)
    if (error) return setMsg({ k: 'error', t: errMsg(error) })
    await removeFromStorage(d.url); setMsg({ k: 'ok', t: 'Documento eliminato.' }); reload()
  }

  if (edit) {
    const set = (p: Partial<DocumentItem>) => setEdit({ ...edit, ...p })
    return (
      <>
        <AdminTitle title={edit.id ? 'Modifica documento' : 'Nuovo documento'} />
        {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
        <form onSubmit={save} className="card max-w-2xl space-y-5 p-6">
          <Text label="Titolo" value={edit.title} onChange={(v) => set({ title: v })} required />
          <Select label="Categoria" value={edit.category} onChange={(v: DocCategory) => set({ category: v })}
            options={(Object.keys(DOC_LABEL) as DocCategory[]).map((c) => ({ value: c, label: DOC_LABEL[c] }))} />
          <ImageField label="File PDF" value={edit.url || null} onChange={(u) => set({ url: u ?? '' })} folder="documenti" accept="application/pdf" />
          <Text label="…oppure collegamento esterno" type="url" value={edit.url} onChange={(v) => set({ url: v })} placeholder="https://" />
          <Text label="Data del documento" type="date" value={edit.doc_date ?? ''} onChange={(v) => set({ doc_date: v || null })} />
          <Text label="Ordine (numero più basso = prima)" type="number" value={String(edit.sort)} onChange={(v) => set({ sort: Number(v) || 0 })} />
          <Check label="Visibile sul sito" checked={edit.is_published} onChange={(v) => set({ is_published: v })} />
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
      <AdminTitle title="Documenti" action={<button className="btn-red" onClick={() => { setMsg(null); setEdit(blankDoc()) }}>+ Nuovo documento</button>} />
      {msg && <div className="mb-4"><Notice kind={msg.k}>{msg.t}</Notice></div>}
      {loading ? <Spinner /> : data.length === 0 ? <Empty title="Nessun documento" text="Carica Statuto, Atto di fondazione, bilanci sociali e altri PDF." /> : (
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-lg font-bold text-navy">{d.title}</p>
                <p className="text-sm text-ink/70">{DOC_LABEL[d.category]}{d.is_published ? '' : ' · Nascosto'}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-navy !min-h-[44px] !px-5 !py-2 !text-xs" onClick={() => { setMsg(null); setEdit(d) }}>Modifica</button>
                <ConfirmButton label="Elimina" what={`il documento “${d.title}”`} onConfirm={() => remove(d)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
