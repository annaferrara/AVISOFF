import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { DEFAULT_DOCUMENTS, DEFAULT_EVENTS, DEFAULT_TEAM } from './content'
import { isPast } from './format'
import type {
  Album, ContactMessage, DocumentItem, EventItem, NewsItem, PageText, Photo, TeamMember,
} from './types'

export function useAsync<T>(fn: () => Promise<T>, initial: T, deps: unknown[] = []) {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let alive = true
    setLoading(true)
    fn()
      .then((d) => { if (alive) { setData(d); setLoading(false) } })
      .catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])
  return { data, loading, reload: () => setTick((t) => t + 1) }
}

/* ------------------------------------------------------------ eventi */
export async function fetchEvents(admin = false): Promise<EventItem[]> {
  if (!supabase) return admin ? [] : DEFAULT_EVENTS
  let q = supabase.from('events').select('*').order('starts_at', { ascending: true })
  if (!admin) q = q.eq('status', 'published')
  const { data, error } = await q
  if (error) throw error
  const rows = (data ?? []) as EventItem[]
  return rows.length === 0 && !admin ? DEFAULT_EVENTS : rows
}
export const upcoming = (evs: EventItem[]) => evs.filter((e) => !isPast(e))
export const archive = (evs: EventItem[]) => evs.filter((e) => isPast(e)).reverse()

export async function fetchEvent(id: string): Promise<EventItem | null> {
  if (id.startsWith('default-')) return DEFAULT_EVENTS.find((e) => e.id === id) ?? null
  if (!supabase) return null
  const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle()
  return (data as EventItem | null) ?? null
}

/* ------------------------------------------------------------ news */
export async function fetchNews(admin = false): Promise<NewsItem[]> {
  if (!supabase) return []
  let q = supabase.from('news').select('*').order('created_at', { ascending: false })
  if (!admin) q = q.eq('status', 'published')
  const { data, error } = await q
  if (error) throw error
  const now = Date.now()
  const rows = (data ?? []) as NewsItem[]
  return admin ? rows : rows.filter((n) => !n.publish_at || new Date(n.publish_at).getTime() <= now)
}
export async function fetchNewsItem(id: string): Promise<NewsItem | null> {
  if (!supabase) return null
  const { data } = await supabase.from('news').select('*').eq('id', id).maybeSingle()
  return (data as NewsItem | null) ?? null
}

/* ------------------------------------------------------------ foto */
export async function fetchAlbums(): Promise<Album[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('albums').select('*').order('sort')
  if (error) throw error
  return (data ?? []) as Album[]
}
export async function fetchPhotos(): Promise<Photo[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Photo[]
}

/* ------------------------------------------------------------ documenti */
export async function fetchDocuments(admin = false): Promise<DocumentItem[]> {
  if (!supabase) return admin ? [] : DEFAULT_DOCUMENTS
  const { data, error } = await supabase.from('documents').select('*').order('sort').order('doc_date', { ascending: false })
  if (error) throw error
  const rows = ((data ?? []) as DocumentItem[]).filter((d) => admin || d.is_published)
  return rows.length === 0 && !admin ? DEFAULT_DOCUMENTS : rows
}

/* ------------------------------------------------------------ direttivo */
export async function fetchTeam(admin = false): Promise<TeamMember[]> {
  if (!supabase) return admin ? [] : DEFAULT_TEAM
  const { data, error } = await supabase.from('team_members').select('*').order('sort')
  if (error) throw error
  const rows = (data ?? []) as TeamMember[]
  return rows.length === 0 && !admin ? DEFAULT_TEAM : rows
}

/* ------------------------------------------------------------ pagine di testo */
export async function fetchPage(slug: string): Promise<PageText | null> {
  if (!supabase) return null
  const { data } = await supabase.from('pages').select('slug,title,body').eq('slug', slug).maybeSingle()
  return (data as PageText | null) ?? null
}
export async function fetchPages(): Promise<PageText[]> {
  if (!supabase) return []
  const { data } = await supabase.from('pages').select('slug,title,body')
  return (data ?? []) as PageText[]
}

/* ------------------------------------------------------------ messaggi */
export async function fetchMessages(): Promise<ContactMessage[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ContactMessage[]
}
