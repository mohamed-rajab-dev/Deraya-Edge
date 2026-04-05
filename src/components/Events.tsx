import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, X, CheckCircle, Clock, ArrowRight, Plus, Loader2, Upload } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { FilterDropdown } from './FilterDropdown'
import { Reactions } from './Reactions'
import { supabase } from '@/integrations/supabase/client'
import { useRealtimeTable } from '@/hooks/useRealtimeTable'

const db = supabase as any

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}
function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

/* ─── Add Event Modal ─────────────────────────────────────────────── */
interface AddEventModalProps { onClose: () => void; onAdded: (e: any) => void }
function AddEventModal({ onClose, onAdded }: AddEventModalProps) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '10:00 AM',
    location: '', type: 'On-Campus', faculty: '', capacity: '100',
    tags: ''
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const faculties = ['All Faculties', 'Pharmacy', 'Business', 'Physical Therapy', 'Dentistry']
  const types = ['On-Campus', 'Online', 'Hybrid']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { alert('Please sign in to add an event'); return }
    setLoading(true)
    try {
      const newEvent = {
        title: form.title, description: form.description, date: form.date, time: form.time,
        location: form.location, type: form.type, faculty: form.faculty,
        capacity: parseInt(form.capacity) || 100,
        registered: 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        featured: false,
        host: user.user_metadata?.full_name || user.email?.split('@')[0],
        user_id: user.id,
      }
      
      const { data, error } = await db.from('events').insert(newEvent).select().single()
      if (error) throw error
      
      onAdded(data)
      setDone(true)
    } catch (err: any) {
      alert(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        className="bg-card border border-border rounded-2xl p-8 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-secondary cursor-pointer transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        {done ? (
          <div className="text-center py-8">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl text-foreground mb-2">Event Created!</h3>
            <p className="text-muted-foreground text-sm mb-6">Your event is now live for everyone to see.</p>
            <button onClick={onClose} className="bg-foreground text-background px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">Done</button>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                <Upload className="w-4 h-4" /> New Academic Event
              </div>
              <h2 className="font-playfair text-3xl text-foreground">Add an Event</h2>
              <div className="h-px bg-border mt-4" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Event Title *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Annual Research Symposium 2026"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description *</label>
                <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What is this event about? Who should attend?"
                  rows={3} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Time</label>
                  <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    placeholder="e.g. 2:00 PM"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Location *</label>
                <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Main Auditorium or Online (Zoom)"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none cursor-pointer transition">
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Faculty</label>
                  <select value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none cursor-pointer transition">
                    <option value="">Any Faculty</option>
                    {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Event →'}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─── Register Modal ──────────────────────────────────────────────── */
interface RegisterModalProps { event: any; onClose: () => void }
function RegisterModal({ event, onClose }: RegisterModalProps) {
  const { user } = useAuth()
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setDone(true) }, 900) }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-card border border-border rounded-2xl p-8 max-w-md w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-secondary cursor-pointer transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        {done ? (
          <div className="text-center py-6">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl text-foreground mb-2">You're Registered!</h3>
            <p className="text-muted-foreground text-sm mb-1">{event.title}</p>
            <button onClick={onClose} className="mt-5 bg-foreground text-background px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">Close</button>
          </div>
        ) : (
          <>
            <h2 className="font-playfair text-2xl text-foreground mb-1">Register for Event</h2>
            <p className="text-sm text-muted-foreground mb-1">{event.title}</p>
            {event.host && (
              <div className="mb-5 text-xs">
                {event.user_id ? (
                  <a href={`/researcher/${event.user_id}`} className="font-semibold text-accent-blue hover:underline">Hosted by {event.host}</a>
                ) : (
                  <span className="font-semibold text-muted-foreground">Hosted by {event.host}</span>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required defaultValue={user?.user_metadata?.full_name || (user as any)?.display_name || ''} placeholder="Full Name" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition" />
              <input required type="email" defaultValue={user?.email || ''} placeholder="University Email" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition" />
              <button type="submit" disabled={loading} className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : 'Confirm Registration →'}
              </button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-border">
              <Reactions 
                itemId={event.id} 
                itemType="event" 
                initialLikes={event.likes_count || 0} 
                initialComments={event.comments_count || 0} 
              />
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Events Component ─────────────────────────────────────── */
export function Events() {
  const [events, setEvents] = useState<any[]>([])
  const [registerEvent, setRegisterEvent] = useState<any | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchEvents()
  }, [])

  // 🔴 Real-time: re-fetch whenever anyone adds/updates/removes an event
  useRealtimeTable('events', fetchEvents)

  const fetchEvents = async () => {
    const { data } = await db.from('events').select('*').order('date', { ascending: true })
    if (data) setEvents(data)
  }

  const filters = ['All', 'Online', 'On-Campus', 'Hybrid', 'Business', 'Physical Therapy', 'Dentistry', 'Pharmacy']
  const filtered = events.filter(e => filter === 'All' ? true : ['Online', 'On-Campus', 'Hybrid'].includes(filter) ? e.type === filter : e.faculty === filter || e.faculty === 'All Faculties')
  const featured = events.find(e => e.featured) || (filtered.length > 0 ? filtered[0] : null)
  const rest = filtered.filter(e => e.id !== featured?.id)

  return (
    <section id="events-section" className="harvard-section bg-secondary/20 dark:bg-secondary/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="harvard-section-intro">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">Academic Synergy</p>
            <h2 className="harvard-heading">Events & Sessions</h2>
            <div className="flex items-center gap-4 mt-10">
              <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full text-[11px] font-black tracking-widest uppercase cursor-pointer hover:opacity-90 transition-all shadow-2xl">
                <Plus className="w-4 h-4" /> Add Event
              </button>
              <span className="harvard-arrow-btn">
                <span className="harvard-arrow-circle"><ArrowRight className="w-4 h-4" /></span>
                View All
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-6 h-full">
            <p className="text-muted-foreground leading-relaxed text-xl lg:text-3xl italic max-w-xl font-light">
              "Discover academic excellence through our curated workshops, seminars, and networking sessions."
            </p>
            <div className="pt-4">
              <FilterDropdown options={filters} activeOption={filter} onSelect={setFilter} label="Search Events" colorClass="accent-red" />
            </div>
          </div>
        </div>

        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                whileHover={{ rotateX: 2, rotateY: -1, y: -4 }}
                className="group relative h-full min-h-[250px] rounded-[32px] overflow-hidden glass-card shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-border shimmer-sweep cursor-pointer p-1"
                onClick={() => setRegisterEvent(featured)}
                style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
              >
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 h-full">
                  <div className="md:col-span-7 p-6 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-8 h-0.5 bg-accent-blue" />
                       <span className="text-[9px] font-black text-accent-blue uppercase tracking-[0.3em] font-sans">Institutional Highlight</span>
                    </div>
                    <h3 className="font-playfair text-3xl lg:text-5xl text-foreground mb-4 leading-[0.95] tracking-tight">
                      {featured.title}
                    </h3>
                    <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-6 font-light italic opacity-90 line-clamp-2">
                      "{featured.description}"
                    </p>
                    <div className="flex flex-wrap gap-3">
                       <div className="bg-secondary/20 px-4 py-1.5 rounded-full border border-border flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                         <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{formatDate(featured.date)}</span>
                       </div>
                    </div>
                  </div>
                  <div className="md:col-span-5 bg-foreground/[0.01] dark:bg-white/[0.01] m-3 rounded-[24px] border border-border/50 p-6 flex flex-col justify-between backdrop-blur-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                         <span className="bg-accent-blue text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{featured.type}</span>
                         <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                           <Users className="w-4 h-4 text-accent-blue" />
                         </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Registered Participants</p>
                          <h4 className="text-3xl font-black text-foreground tabular-nums tracking-tighter">
                            {featured.registered} <span className="text-muted-foreground text-sm font-light">/ {featured.capacity}</span>
                          </h4>
                        </div>
                        <div className="space-y-2">
                           <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} whileInView={{ width: `${(featured.registered/featured.capacity)*100}%` }} viewport={{ once: true }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                               className="h-full bg-accent-blue" />
                           </div>
                           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-right">
                             {Math.round((featured.registered/featured.capacity)*100)}% Momentum
                           </p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-[#0a0f1c] text-white font-bold py-3 rounded-[16px] text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors flex items-center justify-center gap-2 mt-6 group shadow-lg">
                      Secure Access
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Upcoming Synergy</p>
                <Clock className="w-4 h-4 text-muted-foreground opacity-50" />
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {rest.slice(0, 4).map(event => (
                  <div key={event.id} className="group flex items-center gap-5 p-5 rounded-[32px] bg-secondary/30 border border-transparent hover:border-border hover:bg-card transition-all cursor-pointer card-3d" onClick={() => setRegisterEvent(event)}>
                    <div className="w-14 h-14 rounded-[20px] bg-white dark:bg-white/5 shadow-sm flex flex-col items-center justify-center group-hover:bg-accent-blue group-hover:text-white transition-all transform group-hover:scale-105">
                      <span className="text-[10px] font-black uppercase tracking-tighter">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                      <span className="text-2xl font-black leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-[14px] leading-tight group-hover:text-accent-blue transition-colors truncate">{event.title}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest opacity-60 truncate">{event.faculty} · {event.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 flex items-center justify-center gap-3 py-5 rounded-[24px] border border-border/50 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-secondary transition-all active:scale-95 shadow-sm">
                Explore Repository <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.slice(4).map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[40px] bg-card border border-border/50 hover:border-accent-blue/30 transition-all cursor-pointer card-3d shadow-sm hover:shadow-xl group" onClick={() => setRegisterEvent(event)}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-accent-blue/5 rounded-2xl flex items-center justify-center group-hover:bg-accent-blue/10 transition-colors">
                   <Calendar className="w-6 h-6 text-accent-blue" />
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-foreground leading-none">{daysUntil(event.date)}</span>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Days Left</p>
                </div>
              </div>
              <h3 className="font-playfair text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-accent-blue transition-colors">{event.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-8 font-light italic opacity-80 leading-relaxed">"{event.description}"</p>
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{event.faculty}</span>
                 <span className="text-[11px] font-black text-foreground underline underline-offset-8 decoration-accent-blue/30 group-hover:decoration-accent-blue transition-all">REGISTER →</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32 rounded-[56px] bg-secondary/10 border border-dashed border-border/50 card-3d">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="font-playfair text-3xl text-foreground mb-3 font-black">No Synergy Found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8 font-light italic opacity-80">"Adjust your filters or be the visionary to initiate a new academic event."</p>
            <button onClick={() => { setFilter('All'); setShowAdd(true) }} className="bg-foreground text-background px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              Initiate Event
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onAdded={e => setEvents(prev => [e, ...prev])} />}
        {registerEvent && <RegisterModal event={registerEvent} onClose={() => setRegisterEvent(null)} />}
      </AnimatePresence>
    </section>
  )
}
