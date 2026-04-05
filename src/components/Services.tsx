'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, FileText, ExternalLink, BarChart3, Activity, Bone, Pill, ArrowRight, Microscope, BookOpen, Stethoscope } from 'lucide-react'
// Removed research-hero-decoration.png

const FACULTY_CONFIG = [
  {
    id: 'Business',
    title: 'Business Administration',
    desc: 'Empowering future leaders with strategic management, marketing, accounting, and global finance expertise.',
    icon: <BarChart3 className="w-10 h-10" />,
    color: 'accent-blue',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-600',
    gradFrom: 'from-blue-600/20',
    gradTo: 'to-blue-900/10',
    border: 'border-blue-500/40',
    ring: 'ring-blue-500/50',
    accent: '#2563eb'
  },
  {
    id: 'Physical Therapy',
    title: 'Physical Therapy',
    desc: 'Leading advancement in rehabilitation, manual therapy, sports medicine, and pain management research.',
    icon: <Stethoscope className="w-10 h-10" />,
    color: 'accent-emerald',
    textColor: 'text-emerald-500',
    bgColor: 'bg-emerald-600',
    gradFrom: 'from-emerald-600/20',
    gradTo: 'to-emerald-900/10',
    border: 'border-emerald-500/40',
    ring: 'ring-emerald-500/50',
    accent: '#059669'
  },
  {
    id: 'Dentistry',
    title: 'Dentistry',
    desc: 'Pioneering oral health through advanced orthodontics, oral surgery, and pediatric clinical excellence.',
    icon: <Activity className="w-10 h-10" />,
    color: 'accent-purple',
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-600',
    gradFrom: 'from-purple-600/20',
    gradTo: 'to-purple-900/10',
    border: 'border-purple-500/40',
    ring: 'ring-purple-500/50',
    accent: '#7c3aed'
  },
  {
    id: 'Pharmacy',
    title: 'Pharmacy',
    desc: 'Innovating pharmaceutical sciences, clinical drug therapy, and sustainable healthcare solutions.',
    icon: <Pill className="w-10 h-10" />,
    color: 'accent-red',
    textColor: 'text-red-500',
    bgColor: 'bg-red-600',
    gradFrom: 'from-red-600/20',
    gradTo: 'to-red-900/10',
    border: 'border-red-500/40',
    ring: 'ring-red-500/50',
    accent: '#be123c'
  },
]

export function Services() {
  const [researchersByFaculty, setResearchersByFaculty] = useState<Record<string, any[]>>({})
  const [paperCountByFaculty, setPaperCountByFaculty] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState('Business')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const [{ data: profiles }, { data: papers }] = await Promise.all([
      supabase.from('profiles').select('display_name, avatar_url, faculty, user_id').not('faculty', 'is', null),
      (supabase as any).from('research_papers').select('faculty'),
    ])

    if (profiles) {
      const grouped: Record<string, any[]> = {}
      profiles.forEach(p => {
        if (p.faculty) {
          if (!grouped[p.faculty]) grouped[p.faculty] = []
          grouped[p.faculty].push(p)
        }
      })
      setResearchersByFaculty(grouped)
    }

    if (papers) {
      const counts: Record<string, number> = {}
      papers.forEach((p: any) => { if (p.faculty) counts[p.faculty] = (counts[p.faculty] || 0) + 1 })
      setPaperCountByFaculty(counts)
    }
  }

  const activeFaculty = FACULTY_CONFIG.find(f => f.id === activeTab)!
  const activeResearchers = researchersByFaculty[activeTab] || []
  const activePapers = paperCountByFaculty[activeTab] || 0

  return (
    <section id="faculties" className="relative py-32 bg-background overflow-hidden">
      {/* 3D background grid for section */}
      <div className="absolute inset-x-0 top-0 h-64 pointer-events-none overflow-hidden opacity-20">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(60deg) scale(2)',
            transformOrigin: 'top center'
          }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header - Harvard Editorial Style */}
        <div className="harvard-section-intro mb-16 px-1">
          <div className="flex flex-col gap-4">
            <h2 className="harvard-heading">
              Faculties of <span className="text-accent-blue italic">Excellence</span>
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-[1px] bg-border" /> Academic Discretion
            </p>
          </div>
          <div className="pt-4 lg:pt-14">
            <p className="text-muted-foreground text-lg max-w-2xl font-light leading-relaxed italic">
              Leading academic disciplines dedicated to scientific discovery, professional mastery, and the advancement of global healthcare standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" style={{ perspective: '2000px' }}>
          {/* Vertical Menu Section */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-2">Select Faculty</p>
            {FACULTY_CONFIG.map((f, i) => (
              <motion.button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ x: 10, rotateX: -5 }}
                className={`group relative flex items-center gap-4 px-6 py-8 rounded-[24px] transition-all duration-500 cursor-pointer text-left border-2 card-3d shadow-xl
                  ${activeTab === f.id
                    ? `${f.bgColor} border-transparent text-white scale-105 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] z-10`
                    : `bg-card/50 border-border/20 text-muted-foreground hover:border-foreground/20 hover:bg-card`
                  }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`transition-transform duration-500 ${activeTab === f.id ? 'scale-110 rotate-12' : 'group-hover:rotate-12'}`}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-playfair text-xl font-bold leading-tight">{f.title}</h4>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 opacity-60`}>Deraya University</p>
                </div>
                <ArrowRight className={`w-5 h-5 transition-all duration-500 ${activeTab === f.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                
                {/* 3D glow effect for active tab */}
                {activeTab === f.id && (
                  <div className="absolute inset-0 rounded-[24px] blur-xl opacity-30 pointer-events-none" 
                    style={{ background: f.accent }} />
                )}
              </motion.button>
            ))}
          </div>

          {/* Active Detail Panel - Large 3D Card */}
          <div className="lg:col-span-8 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.9, rotateY: 15, x: 50 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: -15, x: -50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative h-full bg-card border ${activeFaculty.border} rounded-[40px] p-12 overflow-hidden card-3d flex flex-col justify-between`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background artistic elements */}
                <div className={`absolute top-0 right-0 w-80 h-80 ${activeFaculty.bgColor}/5 rounded-full blur-[100px] -mr-40 -mt-20`} />
                <div className={`absolute bottom-0 left-0 w-80 h-80 ${activeFaculty.bgColor}/5 rounded-full blur-[100px] -ml-40 -mb-20`} />
                
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <div className={`w-24 h-24 rounded-3xl ${activeFaculty.bgColor} bg-opacity-20 flex items-center justify-center card-3d shadow-lg border ${activeFaculty.border}`}>
                      {activeFaculty.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">{activeFaculty.id} Department</p>
                    </div>
                  </div>

                  <h3 className="font-playfair text-5xl font-black text-foreground mb-6 leading-tight max-w-xl" style={{ transform: 'translateZ(40px)' }}>
                    {activeFaculty.title}
                  </h3>
                  <p className="text-muted-foreground text-xl leading-relaxed max-w-xl mb-12 font-light" style={{ transform: 'translateZ(30px)' }}>
                    {activeFaculty.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-6" style={{ transform: 'translateZ(20px)' }}>
                    <div className={`rounded-3xl p-6 bg-secondary/30 border border-border/20 card-3d`}>
                      <div className={`text-4xl font-black text-foreground mb-2`}>{activeResearchers.length}</div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4" />Researchers</div>
                    </div>
                    <div className={`rounded-3xl p-6 bg-secondary/30 border border-border/20 card-3d`}>
                      <div className={`text-4xl font-black text-foreground mb-2`}>{activePapers}</div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><FileText className="w-4 h-4" />Publications</div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-end" style={{ transform: 'translateZ(10px)' }}>
                   <button className={`flex items-center gap-3 px-8 py-4 ${activeFaculty.bgColor} text-white rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer`}>
                     View Department <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
