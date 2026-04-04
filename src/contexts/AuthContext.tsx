import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  setUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('deraya_user')
    const token = localStorage.getItem('deraya_token')
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signOut = () => {
    localStorage.removeItem('deraya_token')
    localStorage.removeItem('deraya_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

