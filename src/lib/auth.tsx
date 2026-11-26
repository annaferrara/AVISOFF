import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthCtx {
  session: Session | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}
const Ctx = createContext<AuthCtx>({
  session: null, isAdmin: false, loading: true,
  signIn: async () => 'Supabase non configurato', signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); if (!data.session) setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) { setIsAdmin(false); return }
    setLoading(true)
    supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => { setIsAdmin(!!data); setLoading(false) })
  }, [session])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return 'Supabase non configurato'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? 'Email o password non corrette.' : null
  }
  const signOut = async () => { await supabase?.auth.signOut() }

  return <Ctx.Provider value={{ session, isAdmin, loading, signIn, signOut }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
