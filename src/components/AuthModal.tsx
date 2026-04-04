import { useState } from 'react'
import { X, Loader as Loader2, Mail, Lock, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { setUser } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  if (!isOpen) return null

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          display_name: data.user.user_metadata?.display_name || data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
        })
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            display_name: data.user.user_metadata?.display_name || data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
          })
        }
      }

      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'microsoft') => {
    setLoadingProvider(provider)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'microsoft' ? 'azure' : 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoadingProvider(null)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card clean-border rounded-[32px] p-8 w-full max-w-md relative z-10 elevated-shadow" 
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="mb-8">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-accent-blue" />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground mt-2 font-medium">
              Ready to explore the next edge of research?
            </p>
          </div>

          <div className="space-y-3">
            {/* Google */}
            <button 
              onClick={() => handleOAuthLogin('google')}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-3 bg-secondary/50 hover:bg-secondary clean-border rounded-2xl px-4 py-3.5 font-bold text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              {loadingProvider === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </button>

            {/* Microsoft */}
            <button 
              onClick={() => handleOAuthLogin('microsoft')}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-3 bg-secondary/50 hover:bg-secondary clean-border rounded-2xl px-4 py-3.5 font-bold text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              {loadingProvider === 'microsoft' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                  <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                </svg>
              )}
              Continue with Microsoft
            </button>
          </div>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-input clean-border rounded-2xl pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue/30 transition-all text-sm" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-input clean-border rounded-2xl pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue/30 transition-all text-sm" required minLength={6} />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
                {error}
              </motion.div>
            )}
            {message && <p className="text-accent-emerald text-sm font-bold">{message}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-accent-blue text-white font-black py-4 rounded-2xl hover:bg-accent-blue/90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 text-sm shadow-xl shadow-accent-blue/20 uppercase tracking-widest">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage('') }} className="text-accent-blue font-black hover:underline cursor-pointer">
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
