'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Download, FileText, Calendar, User, Upload, Sparkles, X, ChevronRight, Search, Check, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthModal'
import { motion, AnimatePresence } from 'framer-motion'
import { Reactions } from './Reactions'
import { FilterDropdown } from './FilterDropdown'
import { supabase } from '@/integrations/supabase/client'
import { PremiumReader } from './PremiumReader'
import { useRealtimeTable } from '@/hooks/useRealtimeTable'

const faculties = ['All', 'Business', 'Physical Therapy', 'Dentistry', 'Pharmacy']

const SEARCH_PLACEHOLDERS = [
  "Search research, authors, or faculties...",
  "Try 'Physical Therapy'",
  "Looking for 'AI in Healthcare'?",
  "Find papers by faculty name",
  "Search for 'Business Administration'"
]

export function Downloads() {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState('All')
  const [publications, setPublications] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [faculty, setFaculty] = useState('Business')
  const [pages, setPages] = useState(0)
  const [fileUrl, setFileUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSearchFocused) setPlaceholderIndex(i => (i + 1) % SEARCH_PLACEHOLDERS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isSearchFocused])

  useEffect(() => { fetchPapers() }, [])

  // 🔴 Real-time: new research papers appear instantly for all users
  useRealtimeTable('research_papers', fetchPapers)

  async function fetchPapers() {
    try {
      const { data, error } = await supabase
        .from('research_papers')
        .select(`*, profiles(display_name, avatar_url)`)
        .order('created_at', { ascending: false })
      if (!error && data) setPublications(data)
    } catch (err) {
      console.error('Error fetching papers:', err)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${Math.random()}.${fileExt}`
      const { error } = await supabase.storage.from('research-files').upload(filePath, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('research-files').getPublicUrl(filePath)
      setFileUrl(urlData.publicUrl)
      alert('File uploaded successfully!')
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim()) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from('research_papers').insert({
        user_id: user.id,
        title,
        abstract,
        faculty,
        pages,
        file_url: fileUrl || null
      })
      if (error) throw error
      
      setPublishSuccess(true)
      setShowForm(false)
      setTitle(''); setAbstract(''); setFileUrl(''); setPages(0)
      setTimeout(() => setPublishSuccess(false), 3000)
      fetchPapers()
    } catch (err: any) {
      alert('Failed to publish: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Filter by faculty + search query
  const filtered = publications
    .filter(p => activeFilter === 'All' || p.faculty === activeFilter)
    .filter(p => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const authorName = p.profiles?.display_name?.toLowerCase() || ''
      return (
        p.title?.toLowerCase().includes(q) ||
        p.faculty?.toLowerCase().includes(q) ||
        authorName.includes(q) ||
        p.abstract?.toLowerCase().includes(q)
      )
    })

  return (
    <section id="downloads-section" className="relative py-24 bg-card/30">
      {/* Success toast */}
      <AnimatePresence>
        {publishSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[400] bg-accent-emerald text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Research published successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-[3px] bg-accent-blue rounded-full" />
              <span className="text-accent-blue text-sm font-bold uppercase tracking-widest">Publications</span>
            </div>
            <h2 className="font-bagel text-4xl sm:text-5xl text-foreground mb-4 heading-shimmer">Research Papers</h2>
            <p className="text-muted-foreground text-lg">Browse and download research papers from all faculties.</p>
          </div>
          <button
            onClick={() => user ? setShowForm(!showForm) : setShowAuth(true)}
            className="flex items-center gap-2 bg-accent-red text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all cursor-pointer text-sm self-start lg:self-auto shadow-lg shadow-accent-red/25"
          >
            <Upload className="w-4 h-4" /> Publish Research
          </button>
        </div>

        {/* ── SEARCH BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-6"
        >
          <div className={`flex items-center gap-3 bg-card clean-border rounded-2xl px-5 py-3.5 transition-all ${isSearchFocused ? 'ring-2 ring-accent-blue/30 border-accent-blue/30' : 'hover:border-accent-blue/20'}`}>
            <Search className={`w-5 h-5 flex-shrink-0 transition-colors ${isSearchFocused ? 'text-accent-blue' : 'text-muted-foreground'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
              className="flex-1 bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground/60"
              id="research-search"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-secondary transition-colors cursor-pointer flex-shrink-0">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {searchQuery && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs text-muted-foreground px-2">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for <span className="font-semibold text-foreground">"{searchQuery}"</span>
            </motion.div>
          )}
        </motion.div>

        {/* Inline publish form */}
        {showForm && user && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card clean-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Publish New Research</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Paper title" className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
              <select value={faculty} onChange={e => setFaculty(e.target.value)} className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none">
                {faculties.slice(1).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <textarea value={abstract} onChange={e => setAbstract(e.target.value)} placeholder="Abstract (optional)" className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm md:col-span-2 focus:outline-none resize-none" rows={3} />
              <div className="flex gap-3 items-center">
                <input type="file" ref={fileRef} accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 bg-secondary clean-border rounded-xl px-4 py-3 text-muted-foreground hover:text-foreground cursor-pointer text-sm flex-1">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading…' : fileUrl ? '✓ File ready' : 'Upload PDF'}
                </button>
                <input type="number" value={pages} onChange={e => setPages(Number(e.target.value))} placeholder="Pages" className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm w-24 focus:outline-none" />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <button onClick={handleSubmit} disabled={submitting} className="bg-accent-blue text-white px-6 py-2.5 rounded-xl font-semibold cursor-pointer text-sm disabled:opacity-50 hover:bg-accent-blue/90 transition-colors">
                  {submitting ? 'Publishing…' : 'Publish'}
                </button>
                <button onClick={() => setShowForm(false)} className="bg-secondary px-6 py-2.5 rounded-xl font-semibold cursor-pointer text-sm text-foreground">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Faculty filter chips */}
        <FilterDropdown options={faculties} activeOption={activeFilter} onSelect={setActiveFilter} label="Faculty" colorClass="accent-blue" />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {searchQuery
              ? `No papers found matching "${searchQuery}"`
              : 'No research papers published yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pub, i) => {
            return (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative glass-card clean-border rounded-[32px] overflow-hidden hover:border-accent-blue/40 transition-all duration-500 cursor-pointer card-3d"
                onClick={() => setSelectedPaper(pub)}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-accent-blue/10 rounded-2xl flex items-center justify-center text-accent-blue border border-accent-blue/20 group-hover:bg-accent-blue group-hover:text-white transition-all duration-500">
                      <FileText className="w-7 h-7" />
                    </div>
                      <div className="flex items-center gap-2">
                        {pub.profiles?.avatar_url ? (
                          <img src={pub.profiles.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className="text-[11px] font-bold text-foreground">
                          {pub.profiles?.display_name || 'Researcher'}
                        </span>
                      </div>
                  </div>

                  <h3 className="text-xl font-black text-foreground leading-tight mb-4 group-hover:text-accent-blue transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 opacity-80">
                    {pub.abstract || 'Academic research publication from Deraya University.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                         {pub.User?.avatar_url ? <img src={pub.User.avatar_url} alt="" /> : <User className="w-3 h-3 text-muted-foreground" />}
                       </div>
                       <span className="text-foreground">{pub.User?.display_name || 'Researcher'}</span>
                    </div>
                    <div className="h-4 w-px bg-border/50" />
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-accent-blue" /> {pub.created_at ? new Date(pub.created_at).getFullYear() : '2026'}</span>
                    {pub.pages > 0 && <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3 text-accent-blue" /> {pub.pages} P.</span>}
                  </div>
                </div>
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            )
          })}
        </div>
        )}
      </div>

      {/* Paper Detail Reader Mode */}
      <AnimatePresence>
        {selectedPaper && (
          <PremiumReader 
            isOpen={true} 
            onClose={() => setSelectedPaper(null)} 
            item={{
              id: selectedPaper.id,
              userId: selectedPaper.user_id,
              title: selectedPaper.title,
              abstract: selectedPaper.abstract,
              author: selectedPaper.User?.display_name || 'Researcher',
              faculty: selectedPaper.faculty,
              date: selectedPaper.created_at || new Date(),
              fileUrl: selectedPaper.file_url,
              readTime: selectedPaper.pages ? `${selectedPaper.pages} pages document` : 'Open access',
              type: 'research',
              likesCount: selectedPaper.likes_count || 0,
              commentsCount: selectedPaper.comments_count || 0
            }} 
          />
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </section>
  )
}
