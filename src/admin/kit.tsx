import { useState, type ReactNode } from 'react'
import { uploadMedia } from '../lib/supabase'

export const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : 'Errore imprevisto'

export function Notice({ kind, children }: { kind: 'ok' | 'error'; children: ReactNode }) {
  return (
    <p role={kind === 'ok' ? 'status' : 'alert'}
      className={`rounded-2xl p-4 font-bold ${kind === 'ok' ? 'bg-mist text-navy' : 'bg-blush text-avis-dark'}`}>{children}</p>
  )
}

export function Text({
  label, value, onChange, type = 'text', required, hint, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; hint?: string; placeholder?: string }) {
  const id = `f-${label.replace(/\W+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required && ' *'}</label>
      <input id={id} type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} className="field" />
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
    </div>
  )
}

export function Area({
  label, value, onChange, rows = 6, hint,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  const id = `f-${label.replace(/\W+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <textarea id={id} value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="field" />
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
    </div>
  )
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 font-bold text-navy">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-avis" />
      {label}
    </label>
  )
}

export function Select<T extends string>({
  label, value, onChange, options,
}: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  const id = `f-${label.replace(/\W+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className="field">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/** Carica un file su Supabase Storage (bucket `media`) e restituisce l'URL pubblico. */
export function ImageField({
  label, value, onChange, folder, accept = 'image/*',
}: { label: string; value: string | null; onChange: (url: string | null) => void; folder: string; accept?: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function pick(files: FileList | null) {
    const f = files?.[0]
    if (!f) return
    setBusy(true); setErr('')
    try { onChange(await uploadMedia(f, folder)) } catch (e) { setErr(errMsg(e)) } finally { setBusy(false) }
  }
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-mist p-4">
        {value && accept.startsWith('image') && <img src={value} alt="" className="h-24 w-24 rounded-2xl object-cover" />}
        <div className="space-y-2">
          <label className="btn-outline cursor-pointer !min-h-[44px] !px-5 !py-2 !text-xs">
            {busy ? 'Caricamento…' : value ? 'Cambia file' : 'Carica file'}
            <input type="file" accept={accept} className="sr-only" disabled={busy} onChange={(e) => pick(e.target.files)} />
          </label>
          {value && <button type="button" className="ml-2 text-sm font-bold text-avis underline" onClick={() => onChange(null)}>Rimuovi</button>}
          {err && <p className="text-sm font-bold text-avis-dark">{err}</p>}
        </div>
      </div>
    </div>
  )
}

export function ConfirmButton({ label, what, onConfirm }: { label: string; what: string; onConfirm: () => void }) {
  return (
    <button type="button" className="btn !min-h-[44px] bg-blush !px-5 !py-2 !text-xs text-avis-dark hover:bg-avis hover:text-white"
      onClick={() => { if (window.confirm(`Eliminare ${what}? L’operazione non si può annullare.`)) onConfirm() }}>
      {label}
    </button>
  )
}

export function AdminTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {action}
    </div>
  )
}
