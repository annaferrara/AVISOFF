import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import { DEFAULT_SETTINGS } from './content'
import type { Settings } from './types'

interface Ctx { settings: Settings; reload: () => void }
const SettingsContext = createContext<Ctx>({ settings: DEFAULT_SETTINGS, reload: () => {} })

export async function fetchSettings(): Promise<Settings> {
  if (!supabase) return DEFAULT_SETTINGS
  const { data } = await supabase.from('site_settings').select('key,value')
  const map = new Map<string, any>((data ?? []).map((r: { key: string; value: unknown }) => [r.key, r.value]))
  return {
    contacts: { ...DEFAULT_SETTINGS.contacts, ...(map.get('contacts') ?? {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(map.get('socials') ?? {}) },
    home: { ...DEFAULT_SETTINGS.home, ...(map.get('home') ?? {}) },
    logo_url: (map.get('logo')?.url as string | undefined) ?? null,
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {})
  }, [tick])
  return <SettingsContext.Provider value={{ settings, reload: () => setTick((t) => t + 1) }}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)
