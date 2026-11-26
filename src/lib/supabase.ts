import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Solo URL e anon key (pubbliche per progetto). La sicurezza è garantita dalla Row Level Security.
export const supabase = url && key ? createClient(url, key) : null
export const isConfigured = supabase !== null

export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (!supabase) throw new Error('Supabase non configurato')
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '31536000' })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}
