const dateFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' })

export const fmtDate = (iso: string) => dateFmt.format(new Date(iso))
export const fmtTime = (iso: string) => timeFmt.format(new Date(iso))
export const dayOf = (iso: string) => String(new Date(iso).getDate())
export const monthShort = (iso: string) =>
  new Intl.DateTimeFormat('it-IT', { month: 'short' }).format(new Date(iso)).toUpperCase()

/** Un evento "tutto il giorno" è passato solo a fine giornata. */
export function isPast(ev: { starts_at: string; ends_at: string | null; all_day: boolean }): boolean {
  const end = ev.ends_at ? new Date(ev.ends_at) : new Date(ev.starts_at)
  if (ev.all_day || !ev.ends_at) {
    if (ev.all_day) end.setHours(23, 59, 59, 999)
  }
  return end.getTime() < Date.now()
}

export const whenLabel = (ev: { starts_at: string; all_day: boolean }) =>
  ev.all_day ? fmtDate(ev.starts_at) : `${fmtDate(ev.starts_at)} · ${fmtTime(ev.starts_at)}`

/** Converte ISO -> valore per <input type="datetime-local"> in ora locale. */
export function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
export const fromLocalInput = (v: string): string | null => (v ? new Date(v).toISOString() : null)

export const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
