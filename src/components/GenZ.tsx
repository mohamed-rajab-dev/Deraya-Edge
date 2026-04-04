'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Flame, Award, Zap, Heart, Star, Crown, MessageCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const REACTION_ICONS: Record<string, any> = {
  'Flame': <Flame className="w-4 h-4" />,
  'Award': <Award className="w-4 h-4" />,
  'Zap': <Zap className="w-4 h-4" />,
  'Heart': <Heart className="w-4 h-4" />,
  'Star': <Star className="w-4 h-4" />,
  'Crown': <Crown className="w-4 h-4" />,
}

const REACTION_KEYS = Object.keys(REACTION_ICONS);

type ReactionMap = Record<string, number>;

interface PostData {
  id: string;
  text: string;
  iconKey: string;
  author: string;
  faculty: string;
  time: string;
  reactions: ReactionMap;
  dot: string;
}

const SAMPLE_POSTS: PostData[] = [
  { id: 'g1', text: 'Just submitted my research on antibiotic resistance — 3 months of data, 200 patients, 47 pages. Drops next week.', iconKey: 'Flame', author: 'Omar A.', faculty: 'Pharmacy', time: '2h', reactions: { 'Flame': 42, 'Award': 18, 'Zap': 7 }, dot: '#FF4F4F' },
  { id: 'g2', text: 'PT students carry the gym and the clinic simultaneously. We eat parallel processing for breakfast.', iconKey: 'Zap', author: 'Nour M.', faculty: 'Physical Therapy', time: '5h', reactions: { 'Award': 61, 'Flame': 35, 'Heart': 29 }, dot: '#00E5FF' },
  { id: 'g3', text: 'Studying for finals while writing a case report. My laptop has TWO windows open simultaneously. I am peak multitasking.', iconKey: 'Heart', author: 'Yasmin K.', faculty: 'Business', time: '1h', reactions: { 'Heart': 88, 'Zap': 44, 'Flame': 12 }, dot: '#FFD700' },
  { id: 'g4', text: 'New veneers case done. Patient cried happy tears. This is why we chose dentistry.', iconKey: 'Star', author: 'Karim N.', faculty: 'Dentistry', time: '3h', reactions: { 'Star': 93, 'Heart': 67, 'Crown': 41 }, dot: '#A259FF' },
]

const FACULTY_DOTS: Record<string, string> = {
  'Pharmacy':         '#FF4F4F',
  'Physical Therapy': '#00E5FF',
  'Business':         '#FFD700',
  'Dentistry':        '#A259FF',
}

export function GenZ() {
  const { user } = useAuth()
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [text, setText] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('Flame')
  const [faculty, setFaculty] = useState('Business')
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})

  const handlePost = () => {
    if (!text.trim()) return
    const newPost = {
      id: `g_${Date.now()}`,
      text,
      iconKey: selectedIcon,
      author: user ? 'You' : 'Anonymous',
      faculty,
      time: 'Just now',
      reactions: { [selectedIcon]: 1 },
      dot: FACULTY_DOTS[faculty] || '#FFD700',
    }
    setPosts(prev => [newPost, ...prev])
    setText('')
  }

  const handleReact = (postId: string, key: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const prev_reaction = userReactions[postId]
      const updated = { ...p.reactions }
      if (prev_reaction) {
        updated[prev_reaction] = Math.max(0, (updated[prev_reaction] || 1) - 1)
        if (updated[prev_reaction] === 0) delete updated[prev_reaction]
      }
      if (prev_reaction !== key) {
        updated[key] = (updated[key] || 0) + 1
        setUserReactions(r => ({ ...r, [postId]: key }))
      } else {
        setUserReactions(r => { const n = { ...r }; delete n[postId]; return n })
        return { ...p, reactions: updated }
      }
      return { ...p, reactions: updated }
    }))
  }

  return (
    <section id="genz-section" className="relative py-24 bg-gradient-to-br from-accent-purple/5 via-background to-accent-red/5">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-purple/10 to-accent-red/10 px-6 py-2 rounded-full mb-5 border border-accent-purple/20"
          >
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="font-bold text-foreground text-sm tracking-widest uppercase">Research Pulse</span>
            <Sparkles className="w-4 h-4 text-accent-red" />
          </motion.div>
          <h2 className="font-bagel text-4xl sm:text-5xl text-foreground mb-4 heading-shimmer">Share Your Experience</h2>
          <p className="text-muted-foreground text-lg">The latest highlights and thoughts from Deraya's academic community.</p>
        </div>

        {/* Post composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card clean-border rounded-2xl p-6 mb-8 shadow-sm"
        >
          <div className="flex gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-red flex items-center justify-center text-white text-xl flex-shrink-0 shadow-lg shadow-accent-purple/20">
              {user ? user.email?.[0]?.toUpperCase() || '?' : '👤'}
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, 280))}
              placeholder="What's happening in your faculty today?"
              rows={3}
              maxLength={280}
              className="flex-1 bg-transparent text-foreground text-sm resize-none focus:outline-none placeholder:text-muted-foreground/60 p-1"
            />
          </div>

          {/* Icon selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {REACTION_KEYS.map(k => (
              <button key={k} onClick={() => setSelectedIcon(k)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${selectedIcon === k ? 'bg-accent-purple/10 text-accent-purple ring-1 ring-accent-purple/30 scale-110' : 'hover:bg-secondary text-muted-foreground'}`}>
                {REACTION_ICONS[k]}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4">
              <select value={faculty} onChange={e => setFaculty(e.target.value)} className="bg-secondary/50 clean-border rounded-xl px-4 py-2 text-foreground text-xs font-semibold focus:outline-none cursor-pointer">
                {['Business', 'Physical Therapy', 'Dentistry', 'Pharmacy'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{280 - text.length} tokens remaining</span>
            </div>
            <button onClick={handlePost} disabled={!text.trim()}
              className="flex items-center gap-2 publish-shimmer text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-xl shadow-accent-red/20">
              Post <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Posts feed */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card clean-border rounded-2xl p-6 hover:elevated-shadow transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${post.dot}15`, color: post.dot, border: `1px solid ${post.dot}30` }}>
                  {REACTION_ICONS[post.iconKey] || <MessageCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground text-sm truncate">{post.author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ backgroundColor: `${post.dot}15`, color: post.dot }}>{post.faculty}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium uppercase">{post.time} ago</span>
                </div>
              </div>

              <p className="text-foreground/80 text-sm leading-relaxed mb-6 font-medium">{post.text}</p>

              {/* Reactions row */}
              <div className="flex flex-wrap gap-2">
                {REACTION_KEYS.map(k => {
                  const count = post.reactions[k] || 0
                  const isActive = userReactions[post.id] === k
                  return (count > 0 || isActive) && (
                    <button key={k} onClick={() => handleReact(post.id, k)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-accent-purple/10 ring-1 ring-accent-purple/30 text-accent-purple'
                          : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <span className="scale-75">{REACTION_ICONS[k]}</span>
                      {count > 0 && <span>{count}</span>}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

