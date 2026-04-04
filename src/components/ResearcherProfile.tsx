'use client'

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { ArrowLeft, FileText, MessageCircle, FolderOpen, Download, User } from 'lucide-react'

const db = supabase as any

export function ResearcherProfile() {
  const { userId } = useParams<{ userId: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [papers, setPapers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'papers' | 'posts' | 'projects'>('papers')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) fetchAll()
  }, [userId])

  const fetchAll = async () => {
    setLoading(true)
    const [profileRes, papersRes, postsRes, projectsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId!).single(),
      db.from('research_papers').select('*').eq('user_id', userId!).order('created_at', { ascending: false }),
      db.from('community_posts').select('*').eq('user_id', userId!).order('created_at', { ascending: false }),
      db.from('projects').select('*').eq('user_id', userId!).order('created_at', { ascending: false }),
    ])
    setProfile(profileRes.data)
    setPapers(papersRes.data || [])
    setPosts(postsRes.data || [])
    setProjects(projectsRes.data || [])
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>
  if (!profile) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Researcher not found</div>

  const tabs = [
    { key: 'papers' as const, icon: FileText, label: 'Research', count: papers.length },
    { key: 'posts' as const, icon: MessageCircle, label: 'Posts', count: posts.length },
    { key: 'projects' as const, icon: FolderOpen, label: 'Projects', count: projects.length },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bagel text-xl">Deraya Edge</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile header */}
        <div className="bg-card clean-border rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-accent-red/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-accent-red" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">{profile.display_name || 'Researcher'}</h1>
              {profile.faculty && <span className="text-sm text-accent-red font-semibold">{profile.faculty}</span>}
              {profile.bio && <p className="text-muted-foreground mt-2 max-w-xl">{profile.bio}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">{papers.length}</div>
              <div className="text-xs text-muted-foreground">Papers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">{posts.length}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">{projects.length}</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.key ? 'bg-accent-red text-white' : 'bg-card clean-border text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon className="w-4 h-4" />{tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'papers' && papers.map(p => (
            <div key={p.id} className="bg-card clean-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <span className="text-xs font-bold text-accent-blue">{p.faculty}</span>
                <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                {p.abstract && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.abstract}</p>}
                <span className="text-xs text-muted-foreground mt-2 block">{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
              {p.file_url && (
                <a href={p.file_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-accent-blue text-white px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0">
                  <Download className="w-4 h-4" /> Download
                </a>
              )}
            </div>
          ))}

          {activeTab === 'posts' && posts.map(p => (
            <div key={p.id} className="bg-card clean-border rounded-2xl p-6">
              {p.faculty && <span className="text-xs font-bold text-accent-purple">{p.faculty}</span>}
              <p className="text-foreground mt-1">{p.content}</p>
              {p.image_url && <img src={p.image_url} alt="" className="mt-3 rounded-xl max-h-64 object-cover" />}
              <span className="text-xs text-muted-foreground mt-2 block">{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          ))}

          {activeTab === 'projects' && projects.map(p => (
            <div key={p.id} className="bg-card clean-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-accent-emerald">{p.faculty}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status === 'Ongoing' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-secondary text-muted-foreground'}`}>{p.status}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
              {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
            </div>
          ))}

          {((activeTab === 'papers' && papers.length === 0) ||
            (activeTab === 'posts' && posts.length === 0) ||
            (activeTab === 'projects' && projects.length === 0)) && (
            <div className="text-center py-12 text-muted-foreground">No {activeTab} yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
