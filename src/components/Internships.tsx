'use client'

import { FilterDropdown } from './FilterDropdown';
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, MapPin, Clock, X, CheckCircle, Building2, ExternalLink, Linkedin, Loader2, Plus, ArrowRight } from 'lucide-react'
import { Reactions } from './Reactions'
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthModal'

const INTERNSHIPS: any[] = [];

const TYPE_COLORS: Record<string, string> = {
  'On-Site': 'bg-accent-blue/10 text-accent-blue',
  'Hybrid':  'bg-accent-emerald/10 text-accent-emerald',
  'Remote':  'bg-accent-purple/10 text-accent-purple',
}

const FACULTY_COLORS: Record<string, string> = {
  'Business':        'bg-blue-500/10 text-blue-600',
  'Physical Therapy':'bg-emerald-500/10 text-emerald-600',
  'Dentistry':       'bg-purple-500/10 text-purple-600',
  'Pharmacy':        'bg-red-500/10 text-red-600',
}

function daysLeft(dateStr: string) {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000))
}

interface ApplyModalProps {
  internship: typeof INTERNSHIPS[0]
  onClose: () => void
}

function ApplyModal({ internship, onClose }: ApplyModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cv, setCv] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card clean-border rounded-2xl p-8 max-w-md w-full relative elevated-shadow max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary cursor-pointer"><X className="w-5 h-5 text-muted-foreground" /></button>
        {done ? (
            <div className="flex items-center justify-center py-10">
              <CheckCircle className="w-16 h-16 text-accent-emerald mx-auto mb-4" />
              <h3 className="font-playfair text-2xl text-foreground mb-2">Application Sent!</h3>
              <p className="text-muted-foreground text-sm">We'll get back to you within 3-5 business days.</p>
              <p className="font-semibold text-foreground mt-4">{internship.role || internship.title}</p>
              <button onClick={onClose} className="mt-6 bg-foreground text-background px-8 py-2.5 rounded-xl font-semibold cursor-pointer text-sm">Close</button>
            </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-accent-blue/10 rounded-2xl flex items-center justify-center text-accent-blue">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-playfair text-xl text-foreground leading-tight">{internship.title}</h2>
                <p className="text-sm text-muted-foreground">Deraya Industry Partner</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/40" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="University Email" className="w-full bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none" />
              <input value={cv} onChange={e => setCv(e.target.value)} placeholder="LinkedIn Profile / CV link (optional)" className="w-full bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none" />
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Why do you want this internship? (optional)" rows={3} className="w-full bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none resize-none" />
              <button type="submit" disabled={loading} className="w-full bg-accent-blue text-white font-bold py-3 rounded-xl text-sm cursor-pointer hover:bg-accent-blue/90 transition-colors disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

function CreateInternshipModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    faculty: 'Business',
    status: 'On-Site',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1500)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-foreground/60 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-card border border-border/50 rounded-[32px] p-10 max-w-lg w-full relative shadow-2xl card-3d overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer"><X className="w-5 h-5 text-muted-foreground" /></button>
        
        {done ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-accent-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-accent-emerald" />
            </div>
            <h3 className="font-playfair text-3xl text-foreground mb-3">Posted Successfully</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">Your internship opportunity has been shared with the Deraya Edge community.</p>
            <button onClick={onClose} className="w-full bg-foreground text-background py-4 rounded-2xl font-bold text-sm">Close Window</button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-accent-blue" />
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Share Opportunity</span>
              </div>
              <h2 className="font-playfair text-3xl text-foreground">Post Internship</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Position Title</label>
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="e.g. Clinical Pharmacy Intern" className="w-full bg-secondary/50 border border-border/50 rounded-2xl px-5 py-3.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Faculty</label>
                  <select value={formData.faculty} onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full bg-secondary/50 border border-border/50 rounded-2xl px-4 py-3.5 text-foreground text-sm focus:outline-none">
                    <option>Business</option>
                    <option>Pharmacy</option>
                    <option>Dentistry</option>
                    <option>Physical Therapy</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Type</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-secondary/50 border border-border/50 rounded-2xl px-4 py-3.5 text-foreground text-sm focus:outline-none">
                    <option>On-Site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Detailed Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Responsibilities, requirements, and benefits..." rows={4} className="w-full bg-secondary/50 border border-border/50 rounded-2xl px-5 py-3.5 text-foreground text-sm focus:outline-none resize-none" />
              </div>

              <button type="submit" disabled={loading} 
                className="w-full bg-accent-blue text-white font-bold py-4 rounded-2xl text-sm cursor-pointer shadow-xl shadow-accent-blue/20 flex items-center justify-center gap-2 group">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Post Internship <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export function Internship() {
  const { data: internships, isLoading } = useQuery({
    queryKey: ['internships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { user } = useAuth()
  const [applyTarget, setApplyTarget] = useState<any | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Remote', 'Hybrid', 'On-Site', 'Business', 'Physical Therapy', 'Dentistry', 'Pharmacy']

  const filtered = (internships || []).filter((i: any) =>
    filter === 'All' ? true :
    ['Remote', 'Hybrid', 'On-Site'].includes(filter) ? i.status === filter :
    i.faculty === filter
  )

  return (
    <section id="internships-section" className="relative py-24 bg-card/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Harvard-Style Header */}
        <div className="harvard-section-intro mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-accent-blue rounded-full" />
              <span className="text-accent-blue text-[11px] font-bold uppercase tracking-widest">Industry Partnerships</span>
            </div>
            <h2 className="harvard-heading">Industry Internship</h2>
            <div className="flex flex-wrap gap-3 mt-4">
               <div className="bg-accent-blue/5 px-4 py-2 rounded-full border border-accent-blue/10 flex items-center gap-2">
                 <Building2 className="w-4 h-4 text-accent-blue" />
                 <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Verified Partners</span>
               </div>
               <button 
                 onClick={() => user ? setShowAdd(true) : setShowAuth(true)}
                 className="bg-accent-blue text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-accent-blue/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
               >
                 <Plus className="w-4 h-4" /> Post Opportunity
               </button>
            </div>
          </div>
          <div className="pt-4 lg:pt-12">
            <p className="text-muted-foreground text-lg leading-relaxed font-light italic max-w-xl">
              Gain professional experience in Egypt's leading organizations, curated for Deraya's academic excellence and industry relevance.
            </p>
          </div>
        </div>

        {/* Filters */}
        <FilterDropdown options={filters} activeOption={filter} onSelect={setFilter} label="Filter By" colorClass="accent-blue" />

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
            <span className="ml-3 text-muted-foreground font-medium">Matching opportunities...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-3xl p-12 text-center max-w-lg mx-auto shadow-2xl card-3d">
             <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
               <Briefcase className="w-10 h-10 text-muted-foreground" />
             </div>
             <h3 className="font-playfair text-2xl text-foreground mb-3">No opportunities yet</h3>
             <p className="text-muted-foreground mb-8 text-sm">We couldn't find any opportunities matching your criteria. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item: any, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all flex flex-col card-3d"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-accent-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground leading-snug">{item.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <Building2 className="w-3 h-3" />
                      <span className="truncate">Deraya Partner</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold bg-accent-blue/10 text-accent-blue`}>{item.status}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold bg-secondary text-muted-foreground`}>{item.faculty}</span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2 flex-1">{item.description}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Minia, Egypt</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />3 Months</span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => setApplyTarget(item)} className="flex-1 bg-accent-blue text-white font-bold py-2.5 rounded-xl text-sm cursor-pointer hover:bg-accent-blue/90 transition-colors">
                    Apply Now
                  </button>
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2.5 rounded-xl clean-border hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 transition-colors cursor-pointer"
                    title="Share on LinkedIn"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <Reactions itemId={item.id} itemType="project" initialLikes={12} initialComments={2} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {applyTarget && <ApplyModal internship={applyTarget} onClose={() => setApplyTarget(null)} />}
        {showAdd && <CreateInternshipModal onClose={() => setShowAdd(false)} />}
        {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </section>
  )
}
