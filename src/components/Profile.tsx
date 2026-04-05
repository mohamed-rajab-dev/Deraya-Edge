import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Plus, FileText, MessageCircle, FolderOpen, LogOut, User, ArrowLeft, Upload } from 'lucide-react'

const db = supabase as any

interface ProfileData {
  display_name: string | null
  avatar_url: string | null
  faculty: string | null
  bio: string | null
}

export function Profile() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [activeTab, setActiveTab] = useState<'research' | 'articles' | 'posts' | 'projects' | 'courses'>('research')
  const [showForm, setShowForm] = useState(false)
  const [myResearch, setMyResearch] = useState<any[]>([])
  const [myArticles, setMyArticles] = useState<any[]>([])
  const [myPosts, setMyPosts] = useState<any[]>([])
  const [myProjects, setMyProjects] = useState<any[]>([])
  const [myCourses, setMyCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formFaculty, setFormFaculty] = useState('Business')
  const [formStatus, setFormStatus] = useState('Ongoing')
  const [formPages, setFormPages] = useState(0)
  const [formFileUrl, setFormFileUrl] = useState('')

  // Profile edit
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editFaculty, setEditFaculty] = useState('')

  useEffect(() => {
    if (user) { fetchProfile(); fetchMyContent() }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
    if (data) {
      setProfile(data)
      setEditName(data.display_name || '')
      setEditBio(data.bio || '')
      setEditFaculty(data.faculty || '')
    }
  }

  const fetchMyContent = async () => {
    if (!user) return
    const [r, a, p, pr, cr] = await Promise.all([
      db.from('research_papers').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      db.from('articles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      db.from('community_posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      db.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      db.from('courses').select('*').eq('instructor_id', user.id).order('created_at', { ascending: false }),
    ]).catch(() => [{}, {}, {}, {}, {}] as any[])
    
    setMyResearch(r?.data || [])
    setMyArticles(a?.data || [])
    setMyPosts(p?.data || [])
    setMyProjects(pr?.data || [])
    setMyCourses(cr?.data || [])
  }

  const handleUpdateProfile = async () => {
    if (!user) return
    await supabase.from('profiles').upsert({ user_id: user.id, display_name: editName, bio: editBio, faculty: editFaculty })
    setEditingProfile(false)
    fetchProfile()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingFile(true)
    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from('research-files').upload(filePath, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('research-files').getPublicUrl(filePath)
      setFormFileUrl(urlData.publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err.message)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async () => {
    if (!user || !formTitle.trim()) return
    setLoading(true)
    try {
      if (activeTab === 'research') {
        await db.from('research_papers').insert({
          user_id: user.id, title: formTitle, abstract: formContent,
          faculty: formFaculty, pages: formPages, file_url: formFileUrl || null,
        })
      } else if (activeTab === 'posts') {
        await db.from('community_posts').insert({
          user_id: user.id, content: formTitle, faculty: formFaculty,
        })
      } else {
        await db.from('projects').insert({
          user_id: user.id, title: formTitle, description: formContent,
          faculty: formFaculty, status: formStatus,
        })
      }
      setShowForm(false)
      setFormTitle(''); setFormContent(''); setFormPages(0); setFormFileUrl('')
      fetchMyContent()
    } finally { setLoading(false) }
  }

  const handleDelete = async (table: string, id: string) => {
    await db.from(table).delete().eq('id', id)
    fetchMyContent()
  }

  const faculties = ['Business', 'Physical Therapy', 'Dentistry', 'Pharmacy']

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card/50 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bagel text-xl">Deraya Edge</span>
          </a>
          <button onClick={signOut} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Profile Card */}
        <div className="bg-card clean-border rounded-3xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              {editingProfile ? (
                <div className="space-y-3">
                  <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Display Name" className="w-full bg-input clean-border rounded-xl px-4 py-2 text-foreground" />
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Bio" className="w-full bg-input clean-border rounded-xl px-4 py-2 text-foreground" rows={2} />
                  <select value={editFaculty} onChange={e => setEditFaculty(e.target.value)} className="bg-input clean-border rounded-xl px-4 py-2 text-foreground">
                    <option value="">Select Faculty</option>
                    {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={handleUpdateProfile} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer">Save</button>
                    <button onClick={() => setEditingProfile(false)} className="bg-card clean-border px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-foreground">{profile?.display_name || 'Researcher'}</h2>
                  {profile?.faculty && <span className="text-sm text-destructive font-semibold">{profile.faculty}</span>}
                  {profile?.bio && <p className="text-muted-foreground mt-2">{profile.bio}</p>}
                  <button onClick={() => setEditingProfile(true)} className="text-sm text-destructive font-semibold mt-3 cursor-pointer">Edit Profile</button>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">{myResearch.length}</div>
              <div className="text-xs text-muted-foreground">Research</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">{myPosts.length}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">{myProjects.length}</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">{myCourses.length}</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { key: 'research' as const, icon: FileText, label: 'Research' },
            { key: 'articles' as const, icon: FileText, label: 'Articles' },
            { key: 'posts' as const, icon: MessageCircle, label: 'Posts' },
            { key: 'projects' as const, icon: FolderOpen, label: 'Projects' },
            { key: 'courses' as const, icon: FileText, label: 'Courses' },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setShowForm(false) }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.key ? 'bg-destructive text-destructive-foreground' : 'bg-card clean-border text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all cursor-pointer ml-auto">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-card clean-border rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-black text-foreground mb-4">
              Add {activeTab === 'research' ? 'Research Paper' : activeTab === 'posts' ? 'Community Post' : 'Project'}
            </h3>
            <div className="space-y-4">
              <input value={formTitle} onChange={e => setFormTitle(e.target.value)}
                placeholder={activeTab === 'posts' ? 'Write your post...' : 'Title'}
                className="w-full bg-input clean-border rounded-xl px-4 py-3 text-foreground" />
              
              {activeTab !== 'posts' && (
                <textarea value={formContent} onChange={e => setFormContent(e.target.value)}
                  placeholder={activeTab === 'research' ? 'Abstract' : 'Description'}
                  className="w-full bg-input clean-border rounded-xl px-4 py-3 text-foreground" rows={3} />
              )}

              {/* File upload for research */}
              {activeTab === 'research' && (
                <div className="space-y-2">
                  <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingFile}
                    className="flex items-center gap-2 bg-card clean-border rounded-xl px-4 py-3 text-muted-foreground hover:text-foreground cursor-pointer w-full">
                    <Upload className="w-4 h-4" />
                    {uploadingFile ? 'Uploading...' : formFileUrl ? '✓ File uploaded' : 'Upload PDF / Document'}
                  </button>
                  {formFileUrl && (
                    <a href={formFileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-blue underline">View uploaded file</a>
                  )}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <select value={formFaculty} onChange={e => setFormFaculty(e.target.value)} className="bg-input clean-border rounded-xl px-4 py-2 text-foreground">
                  {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {activeTab === 'research' && (
                  <input type="number" value={formPages} onChange={e => setFormPages(Number(e.target.value))} placeholder="Pages" className="bg-input clean-border rounded-xl px-4 py-2 text-foreground w-24" />
                )}
                {activeTab === 'projects' && (
                  <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="bg-input clean-border rounded-xl px-4 py-2 text-foreground">
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={loading} className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg font-semibold cursor-pointer disabled:opacity-50">
                  {loading ? 'Publishing...' : 'Publish'}
                </button>
                <button onClick={() => setShowForm(false)} className="bg-card clean-border px-6 py-2 rounded-lg font-semibold cursor-pointer">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="space-y-4">
          {activeTab === 'research' && myResearch.map(item => (
            <div key={item.id} className="bg-card clean-border rounded-2xl p-6 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-destructive">{item.faculty}</span>
                <h4 className="text-lg font-bold text-foreground mt-1">{item.title}</h4>
                {item.abstract && <p className="text-sm text-muted-foreground mt-2">{item.abstract}</p>}
                {item.file_url && (
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-blue font-semibold mt-2 inline-block">📄 Download PDF</a>
                )}
                <span className="text-xs text-muted-foreground mt-2 block">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <button onClick={() => handleDelete('research_papers', item.id)} className="text-destructive text-sm font-semibold cursor-pointer flex-shrink-0 ml-4">Delete</button>
            </div>
          ))}
          {activeTab === 'articles' && myArticles.map(item => (
            <div key={item.id} className="bg-card clean-border rounded-2xl p-6 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-accent-emerald">{item.faculty}</span>
                <h4 className="text-lg font-bold text-foreground mt-1">{item.title}</h4>
                <p className="text-foreground mt-1 text-sm line-clamp-2">{item.content}</p>
                <span className="text-xs text-muted-foreground mt-2 block">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <button onClick={() => handleDelete('articles', item.id)} className="text-destructive text-sm font-semibold cursor-pointer flex-shrink-0 ml-4">Delete</button>
            </div>
          ))}
          {activeTab === 'posts' && myPosts.map(item => (
            <div key={item.id} className="bg-card clean-border rounded-2xl p-6 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-accent-purple">{item.faculty}</span>
                <p className="text-foreground mt-1">{item.content}</p>
                <span className="text-xs text-muted-foreground mt-2 block">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <button onClick={() => handleDelete('community_posts', item.id)} className="text-destructive text-sm font-semibold cursor-pointer flex-shrink-0 ml-4">Delete</button>
            </div>
          ))}
          {activeTab === 'projects' && myProjects.map(item => (
            <div key={item.id} className="bg-card clean-border rounded-2xl p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-destructive">{item.faculty}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === 'Ongoing' ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-card text-muted-foreground'}`}>{item.status}</span>
                </div>
                <h4 className="text-lg font-bold text-foreground mt-1">{item.title}</h4>
                {item.description && <p className="text-sm text-muted-foreground mt-2">{item.description}</p>}
              </div>
              <button onClick={() => handleDelete('projects', item.id)} className="text-destructive text-sm font-semibold cursor-pointer flex-shrink-0 ml-4">Delete</button>
            </div>
          ))}

          {activeTab === 'courses' && myCourses.map(item => (
            <div key={item.id} className="bg-card clean-border rounded-2xl p-6 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-destructive">{item.faculty}</span>
                <span className="ml-2 text-xs text-accent-blue font-bold px-2 py-0.5 rounded-full bg-accent-blue/10">{item.level}</span>
                <h4 className="text-lg font-bold text-foreground mt-1">{item.title}</h4>
                {item.description && <p className="text-sm text-muted-foreground mt-2">{item.description}</p>}
                <span className="text-xs text-muted-foreground mt-2 block">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <button onClick={() => handleDelete('courses', item.id)} className="text-destructive text-sm font-semibold cursor-pointer flex-shrink-0 ml-4">Delete</button>
            </div>
          ))}

          {((activeTab === 'research' && myResearch.length === 0) ||
            (activeTab === 'articles' && myArticles.length === 0) ||
            (activeTab === 'posts' && myPosts.length === 0) ||
            (activeTab === 'projects' && myProjects.length === 0) ||
            (activeTab === 'courses' && myCourses.length === 0)) && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No {activeTab} yet. Click "Add New" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
