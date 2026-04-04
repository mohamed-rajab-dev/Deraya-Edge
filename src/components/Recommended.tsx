'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Star, ArrowRight, BarChart3, Bone, Activity, Pill, Microscope, Rocket, MessageCircle, PenTool, Bot, Heart, FileText, Check } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

const db = supabase as any

const RECOMMENDED_ICONS: Record<string, any> = {
  'Pharmacy': <Pill className="w-5 h-5" />,
  'Business': <BarChart3 className="w-5 h-5" />,
  'Physical Therapy': <Bone className="w-5 h-5" />,
  'Dentistry': <Activity className="w-5 h-5" />,
  'Microscope': <Microscope className="w-5 h-5" />,
  'Rocket': <Rocket className="w-5 h-5" />,
  'Message': <MessageCircle className="w-5 h-5" />,
  'Pen': <PenTool className="w-5 h-5" />,
  'Bot': <Bot className="w-5 h-5" />,
}

const STATIC_RECOMMENDED = {
  papers: [
    { id: 'r1', title: 'Antimicrobial Resistance Patterns in Upper Egypt', faculty: 'Pharmacy', reason: 'Trending this week', icon: 'Pharmacy', color: 'accent-red', href: '#downloads-section' },
    { id: 'r2', title: 'Optimizing Supply Chain in Healthcare SMEs', faculty: 'Business', reason: 'Highly rated', icon: 'Business', color: 'accent-blue', href: '#downloads-section' },
    { id: 'r3', title: 'Evidence-Based PT for Rotator Cuff Injuries', faculty: 'Physical Therapy', reason: 'Just published', icon: 'Physical Therapy', color: 'accent-emerald', href: '#downloads-section' },
  ],
  projects: [
    { id: 'rp1', title: 'AI-Assisted Caries Detection System', faculty: 'Dentistry', reason: 'Innovative research', icon: 'Dentistry', color: 'accent-purple', href: '#projects-section' },
    { id: 'rp2', title: 'Community Pharmacy Intervention Study', faculty: 'Pharmacy', reason: 'Popular in Pharmacy', icon: 'Microscope', color: 'accent-red', href: '#projects-section' },
    { id: 'rp3', title: 'Startup Ecosystem Analysis — Minia', faculty: 'Business', reason: 'Editor\'s Pick', icon: 'Rocket', color: 'accent-blue', href: '#projects-section' },
  ],
  posts: [
    { id: 'rc1', title: '"The Hidden Epidemic: MSK Pain in Students"', faculty: 'Physical Therapy', reason: 'Most loved', icon: 'Message', color: 'accent-emerald', href: '#articles-section' },
    { id: 'rc2', title: '"Why Pharmacy Grads Are Building Startups"', faculty: 'Pharmacy', reason: 'Going viral', icon: 'Pen', color: 'accent-red', href: '#articles-section' },
    { id: 'rc3', title: '"Smile Design in the Age of AI"', faculty: 'Dentistry', reason: 'Most discussed', icon: 'Bot', color: 'accent-purple', href: '#articles-section' },
  ],
}

const COLOR_TEXT: Record<string, string> = {
  'accent-red': 'text-accent-red',
  'accent-blue': 'text-accent-blue',
  'accent-emerald': 'text-accent-emerald',
  'accent-purple': 'text-accent-purple',
}

const COLOR_BG: Record<string, string> = {
  'accent-red': 'bg-accent-red/10',
  'accent-blue': 'bg-accent-blue/10',
  'accent-emerald': 'bg-accent-emerald/10',
  'accent-purple': 'bg-accent-purple/10',
}

interface RecommendedCardProps {
  item: { id: string; title: string; faculty: string; reason: string; icon: string; color: string; href: string }
  delay: number
}

function RecommendedCard({ item, delay }: RecommendedCardProps) {
  return (
    <motion.a
      href={item.href}
      initial={{ opacity: 0, y: 30, rotateY: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex-shrink-0 w-72 bg-card border border-border/40 rounded-[32px] p-7 transition-all duration-500 cursor-pointer group hover:border-${item.color}/40 shadow-xl card-3d relative overflow-hidden`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${COLOR_BG[item.color]} blur-[60px] opacity-20 -mr-16 -mt-16 pointer-events-none`} />
      
      <div className={`w-14 h-14 ${COLOR_BG[item.color]} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-${item.color}/10`} style={{ transform: 'translateZ(20px)' }}>
        <span className={COLOR_TEXT[item.color]}>{RECOMMENDED_ICONS[item.icon] || <FileText className="w-6 h-6" />}</span>
      </div>
      
      <div style={{ transform: 'translateZ(30px)' }}>
        <h4 className={`text-lg font-playfair font-black text-foreground leading-tight mb-2 group-hover:${COLOR_TEXT[item.color]} transition-colors line-clamp-2`}>
          {item.title}
        </h4>
        <div className={`text-[10px] font-bold ${COLOR_TEXT[item.color]} mb-4 uppercase tracking-[0.2em]`}>{item.faculty}</div>
      </div>
      
      <div className="flex items-center justify-between mt-auto" style={{ transform: 'translateZ(10px)' }}>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
          {item.reason === 'Just published' ? <Check className="w-3 h-3 text-accent-emerald" /> : <Star className="w-3 h-3" />}
          {item.reason}
        </div>
        <ArrowRight className={`w-4 h-4 ${COLOR_TEXT[item.color]} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`} />
      </div>
    </motion.a>
  )
}

interface RowProps {
  title: string
  icon: React.ReactNode
  items: typeof STATIC_RECOMMENDED.papers
  seeAllHref: string
}

function RecommendedRow({ title, icon, items, seeAllHref }: RowProps) {
  return (
    <div className="mb-20 last:mb-0">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="font-playfair text-2xl font-black text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-inner">
            {icon}
          </div>
          {title}
        </h3>
        <a href={seeAllHref} className="group text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-all uppercase tracking-widest bg-secondary/30 px-4 py-2 rounded-full">
          See all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-10 -mx-1 px-1 custom-scrollbar scroll-smooth" style={{ perspective: '2000px' }}>
        {items.map((item, i) => <RecommendedCard key={item.id} item={item} delay={i * 0.12} />)}
      </div>
    </div>
  )
}

export function Recommended() {
  const [realPapers, setRealPapers] = useState<any[]>([])

  useEffect(() => {
    db.from('research_papers')
      .select('id, title, faculty, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }: any) => {
        if (data && data.length > 0) {
          setRealPapers(data.map((p: any, i: number) => ({
            id: p.id,
            title: p.title,
            faculty: p.faculty,
            reason: i === 0 ? 'Just published' : i === 1 ? 'Trending' : 'Popular',
            icon: p.faculty || 'Pharmacy',
            color: p.faculty === 'Pharmacy' ? 'accent-red' : p.faculty === 'Business' ? 'accent-blue' : p.faculty === 'Physical Therapy' ? 'accent-emerald' : 'accent-purple',
            href: '#downloads-section',
          })))
        }
      })
  }, [])

  const papers = realPapers.length >= 3 ? realPapers : STATIC_RECOMMENDED.papers

  return (
    <section id="recommended-section" className="relative py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-[3px] bg-gradient-to-r from-accent-red to-accent-purple rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-accent-red to-accent-purple bg-clip-text text-transparent">Curated Feed</span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl text-foreground">Featured Content</h2>
          </div>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            <Sparkles className="w-10 h-10 text-accent-purple opacity-30 hidden md:block" />
          </motion.div>
        </div>

        {/* Rows */}
        <RecommendedRow
          title="Research Papers"
          icon={<TrendingUp className="w-5 h-5 text-accent-blue" />}
          items={papers}
          seeAllHref="#downloads-section"
        />
        <RecommendedRow
          title="Top Projects"
          icon={<Star className="w-5 h-5 text-accent-emerald" />}
          items={STATIC_RECOMMENDED.projects}
          seeAllHref="#projects-section"
        />
        <RecommendedRow
          title="Articles & Takeaways"
          icon={<Sparkles className="w-5 h-5 text-accent-purple" />}
          items={STATIC_RECOMMENDED.posts}
          seeAllHref="#articles-section"
        />
      </div>
    </section>
  )
}
