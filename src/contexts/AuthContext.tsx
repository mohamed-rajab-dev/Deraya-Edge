import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  setUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        })
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

