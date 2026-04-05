import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import EventsPage from './pages/EventsPage'
import ResearchPage from './pages/ResearchPage'
import ArticlesPage from './pages/ArticlesPage'
import CommunityPage from './pages/CommunityPage'
import InternshipPage from './pages/InternshipPage'
import AboutPage from './pages/AboutPage'

import { Profile } from './components/Profile'
import { ResearcherProfile } from './components/ResearcherProfile'
import { AuthModal } from './components/AuthModal'

/* ─── Page Transition Wrapper ────────────────────────────────── */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── Protected Profile ──────────────────────────────────────── */
function ProtectedProfile() {
  const { user, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 rounded-full border-2 border-accent-red border-t-transparent" />
    </div>
  )

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-playfair text-3xl text-foreground mb-4">Sign in to access your profile</h2>
        <button onClick={() => setShowAuth(true)}
          className="bg-foreground text-background px-8 py-3 rounded-full font-semibold cursor-pointer hover:opacity-90 transition">
          Sign In
        </button>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    </div>
  )
  return <Profile />
}

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PageTransition>
            <Routes>
              <Route path="/"             element={<HomePage />} />
              <Route path="/courses"      element={<CoursesPage />} />
              <Route path="/events"       element={<EventsPage />} />
              <Route path="/research"     element={<ResearchPage />} />
              <Route path="/articles"     element={<ArticlesPage />} />
              <Route path="/community"    element={<CommunityPage />} />
              <Route path="/internship"  element={<InternshipPage />} />
              <Route path="/about"        element={<AboutPage />} />
              <Route path="/profile"      element={<ProtectedProfile />} />
              <Route path="/researcher/:userId" element={<ResearcherProfile />} />
            </Routes>
          </PageTransition>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
