'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthModal'
import { motion, AnimatePresence } from 'framer-motion'
import { Reactions } from './Reactions'

const db = supabase as any

export function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [profiles, setProfiles] = useState<Record<string, any>>({})
  const [showForm, setShowForm] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [faculty, setFaculty] = useState('Business')
  const [status, setStatus] = useState('Ongoing')
  const [submitting, setSubmitting] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    const { data } = await db.from('projects').select('*').order('created_at', { ascending: false })
    if (data) {
      setProjects(data)
      const userIds = [...new Set(data.map((p: any) => p.user_id))] as string[]
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase.from('profiles').select('*').in('user_id', userIds)
        if (profilesData) {
          const map: Record<string, any> = {}
          profilesData.forEach(p => { map[p.user_id] = p })
          setProfiles(map)
        }
      }
    }
  }

  const handleSubmit = async () => {
    if (!user || !title.trim()) return
    setSubmitting(true)
    await db.from('projects').insert({ user_id: user.id, title, description: desc, faculty, status })
    setShowForm(false); setTitle(''); setDesc('')
    setPublishSuccess(true)
    setTimeout(() => setPublishSuccess(false), 3000)
    fetchProjects()
    setSubmitting(false)
  }

  const faculties = ['Business', 'Physical Therapy', 'Dentistry', 'Pharmacy']

  return (
    <section id="projects-section" className="relative py-24 bg-card/30">
      {/* Success toast */}
      <AnimatePresence>
        {publishSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[400] bg-accent-emerald text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl"
          >
            ✓ Project added successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-[3px] bg-accent-emerald rounded-full" />
              <span className="text-accent-emerald text-sm font-bold uppercase tracking-widest">Initiatives</span>
            </div>
            <h2 className="font-bagel text-4xl sm:text-5xl text-foreground mb-4 heading-shimmer">Research Projects</h2>
            <p className="text-muted-foreground text-lg">Ongoing and completed research initiatives across faculties.</p>
          </div>
          <button
            onClick={() => user ? setShowForm(!showForm) : setShowAuth(true)}
            className="flex items-center gap-2 publish-shimmer text-white font-bold px-5 py-3 rounded-xl hover:scale-105 transition-transform cursor-pointer text-sm self-start lg:self-auto shadow-lg shadow-accent-red/25"
          >
            <Sparkles className="w-4 h-4" /> Add Project
          </button>
        </div>

        {showForm && user && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card clean-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none" />
              <div className="flex gap-3">
                <select value={faculty} onChange={e => setFaculty(e.target.value)} className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm flex-1 focus:outline-none">
                  {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={status} onChange={e => setStatus(e.target.value)} className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none">
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="bg-input clean-border rounded-xl px-4 py-3 text-foreground text-sm md:col-span-2 resize-none focus:outline-none" rows={3} />
              <div className="flex gap-2 md:col-span-2">
                <button onClick={handleSubmit} disabled={submitting} className="bg-accent-emerald text-white px-6 py-2.5 rounded-xl font-semibold cursor-pointer text-sm disabled:opacity-50">
                  {submitting ? 'Adding…' : 'Add Project'}
                </button>
                <button onClick={() => setShowForm(false)} className="bg-secondary px-6 py-2.5 rounded-xl font-semibold cursor-pointer text-sm text-foreground">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No projects published yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project: any, i) => {
              const author = profiles[project.user_id]
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card clean-border rounded-2xl p-6 hover:border-accent-emerald/20 hover:elevated-shadow transition-all flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-emerald/10 text-accent-emerald">{project.faculty}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${project.status === 'Ongoing' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-secondary text-muted-foreground'}`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{project.title}</h3>
                  {project.description && <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{project.description}</p>}
                  <a href={`/researcher/${project.user_id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-auto">
                    <div className="w-6 h-6 rounded-full bg-accent-emerald/10 flex items-center justify-center text-xs font-bold text-accent-emerald overflow-hidden">
                      {author?.avatar_url ? <img src={author.avatar_url} alt="" className="w-full h-full object-cover" /> : author?.display_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span>{author?.display_name || 'Researcher'}</span>
                  </a>
                  <Reactions itemId={project.id} itemType="project" initialLikes={project.likes_count || 0} initialComments={project.comments_count || 0} />
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </section>
  )
}
