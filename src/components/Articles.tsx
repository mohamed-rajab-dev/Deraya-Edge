import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, User, X, Eye, Plus, Loader2, Image, Send, ArrowRight } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthModal'
import { FilterDropdown } from './FilterDropdown'
import { PremiumReader } from './PremiumReader'
import { supabase } from '@/integrations/supabase/client'
import { useRealtimeTable } from '@/hooks/useRealtimeTable'

const STATIC_ARTICLES: any[] = []


/* ─── Add Article Modal ─────────────────────────────────────── */
function AddArticleModal({ onClose, onAdded }: { onClose: () => void; onAdded: (a: any) => void }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', content: '', faculty: 'Pharmacy', cover_url: '', read_time: '5', tags: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'beyjg69v')
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ds259dm2u'}/image/upload`, {
        method: 'POST', body: formData
      })
      const data = await res.json()
      setForm(f => ({ ...f, cover_url: data.secure_url }))
    } catch (err) { alert('Upload failed') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { alert('Sign in to publish'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase.from('articles').insert({
        title: form.title,
        content: form.content,
        faculty: form.faculty,
        cover_url: form.cover_url,
        read_time: parseInt(form.read_time) || 5,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        user_id: user.id
      }).select().single()
      
      if (error) throw error
      onAdded({ ...data, author: user.user_metadata?.full_name || user.email?.split('@')[0] })
      setDone(true)
    } catch (err: any) {
      alert(err.message || 'Failed to publish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card border border-border rounded-2xl p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-secondary cursor-pointer">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        {done ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="font-playfair text-2xl text-foreground mb-2">Article Published!</h3>
            <button onClick={onClose} className="mt-4 bg-foreground text-background px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition">Done</button>
          </div>
        ) : (
          <>
            <h2 className="font-playfair text-3xl text-foreground mb-6">Publish Article</h2>
            <div className="h-px bg-border mb-6" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Article title"
                className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15" />
              
              <div className="relative group">
                <input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))}
                  placeholder="Cover image URL or upload below"
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none" />
                <label className="absolute right-3 top-2.5 h-8 bg-foreground text-background px-3 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-90 transition shadow-lg shadow-black/10">
                  <Image className="w-3 h-3" /> Upload Cover
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              {form.cover_url && (
                <div className="rounded-xl overflow-hidden aspect-video bg-secondary">
                  <img src={form.cover_url} alt="Preview" className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Write your article content here... Separate paragraphs with a blank line."
                rows={7} className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
                  className="bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none cursor-pointer">
                  {['Pharmacy', 'Business', 'Physical Therapy', 'Dentistry'].map(fa => <option key={fa} value={fa}>{fa}</option>)}
                </select>
                <input type="number" value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
                  placeholder="Read time (min)"
                  className="bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none" />
              </div>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="Tags: AI, Research, ..."
                className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none" />
              <button type="submit" disabled={loading}
                className="w-full bg-foreground text-background font-semibold py-3.5 rounded-xl text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : 'Publish Article'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Articles Component ───────────────────────────────── */
export function Articles() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openArticle, setOpenArticle] = useState<any | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('All')
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  const filters = ['All', 'Business', 'Physical Therapy', 'Dentistry', 'Pharmacy']

  useEffect(() => { fetchArticles() }, [])

  // 🔴 Real-time: re-fetch whenever anyone inserts/updates/deletes an article
  useRealtimeTable('articles', fetchArticles)

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`*, user_id`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      // Note: In a real app we'd join with users table or profile
      setArticles(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = articles.filter(a => filter === 'All' || a.faculty === filter)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <section id="articles-section" className="harvard-section bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section intro — Harvard style */}
        <div className="harvard-section-intro">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Scientific Journal</p>
            <h2 className="harvard-heading">Articles & Research</h2>
            <div className="flex items-center gap-4 mt-8">
              <motion.button
                onClick={() => user ? setShowAdd(true) : setShowAuth(true)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-xl shadow-black/5">
                <Plus className="w-4 h-4" /> Write Article
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-6 h-full">
            <p className="text-muted-foreground leading-relaxed text-lg italic max-w-xl">
              In-depth articles, analytical essays, and academic insights from Deraya's researchers across all four faculties.
            </p>
            {/* Filters */}
            <div className="pt-2">
              <FilterDropdown options={filters} activeOption={filter} onSelect={setFilter} label="Filter Articles" colorClass="accent-emerald" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 rounded-full border-2 border-foreground border-t-transparent" />
            <span className="ml-3 text-muted-foreground text-sm">Loading articles...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <h3 className="font-playfair text-2xl text-foreground mb-3">No articles yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Be the first to publish an academic article.</p>
            <button onClick={() => user ? setShowAdd(true) : setShowAuth(true)}
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold cursor-pointer hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Write Article
            </button>
          </div>
        ) : (
          <>
            {/* Featured article — large */}
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group grid lg:grid-cols-2 gap-0 border border-border rounded-2xl overflow-hidden mb-8 cursor-pointer hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
                style={{ perspective: '1000px' }}
                onClick={() => setOpenArticle(featured)}>
                {/* Cover */}
                <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                  {featured.cover_url ? (
                    <img src={featured.cover_url} alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-sm">No cover image</div>
                  )}
                </div>
                {/* Content */}
                <div className="p-10 flex flex-col justify-between bg-card">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border border-border px-3 py-1 rounded-full mb-4 inline-block">
                      {featured.faculty}
                    </span>
                    <h3 className="font-playfair text-3xl text-foreground leading-snug mb-4 mt-3 group-hover:underline underline-offset-4">
                      {featured.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                      {featured.content?.split('\n\n')[0]}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{featured.author || featured.User?.display_name || 'Researcher'}</span>
                      <span>{featured.read_time} min read</span>
                    </div>
                    <span>{new Date(featured.date || featured.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Rest — text cards with optional cover thumbnail */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article, i) => (
                <motion.article key={article.id}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-black/5 transition-all duration-300 bg-card"
                  onClick={() => setOpenArticle(article)}>
                  {/* Cover thumbnail */}
                  {article.cover_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={article.cover_url} alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{article.faculty}</span>
                    <h3 className="font-playfair text-xl text-foreground mt-2 mb-2 leading-snug group-hover:underline underline-offset-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                      {article.content?.split('\n\n')[0]}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                      <span>{article.author || article.User?.display_name || 'Researcher'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.read_time}m</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {openArticle && <PremiumReader 
          isOpen={true} 
          onClose={() => setOpenArticle(null)} 
          item={{
            id: openArticle.id,
            userId: openArticle.user_id,
            title: openArticle.title,
            content: openArticle.content,
            author: openArticle.author || openArticle.User?.display_name || 'Researcher',
            faculty: openArticle.faculty,
            date: openArticle.date || openArticle.createdAt || new Date(),
            readTime: openArticle.read_time,
            coverUrl: openArticle.cover_url,
            type: 'article',
            likesCount: openArticle.likes_count || 0,
            commentsCount: openArticle.comments_count || 0
          }} 
        />}
        {showAdd && <AddArticleModal onClose={() => setShowAdd(false)} onAdded={a => { setArticles(prev => [a, ...prev]); setShowAdd(false) }} />}
      </AnimatePresence>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </section>
  )
}
