'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Repeat2, MessageCircle, ThumbsUp, Heart, Lightbulb, PartyPopper } from 'lucide-react'

interface ReactionsProps {
  itemId: string
  itemType: 'paper' | 'post' | 'project' | 'article' | 'event'
  initialLikes?: number
  initialComments?: number
  onComment?: () => void
  onLinkedInShare?: () => void
  onRepost?: () => void
}

const REACTIONS = [
  { key: 'like',       label: 'Like',       emoji: '👍', Icon: ThumbsUp,   color: 'text-accent-blue',    bg: 'bg-accent-blue/10' },
  { key: 'love',       label: 'Love',       emoji: '❤️', Icon: Heart,      color: 'text-red-500',         bg: 'bg-red-500/10' },
  { key: 'insightful', label: 'Insightful', emoji: '💡', Icon: Lightbulb,  color: 'text-amber-500',       bg: 'bg-amber-500/10' },
  { key: 'celebrate',  label: 'Celebrate',  emoji: '🎉', Icon: PartyPopper,color: 'text-accent-emerald',  bg: 'bg-accent-emerald/10' },
]

export function Reactions({ itemId, itemType, initialLikes = 0, initialComments = 0, onComment, onLinkedInShare, onRepost }: ReactionsProps) {
  const storageKey = `reaction_${itemType}_${itemId}`
  const [activeReaction, setActiveReaction] = useState<string | null>(() => {
    try { return localStorage.getItem(storageKey) } catch { return null }
  })
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [repostCount, setRepostCount] = useState(0)
  const [showPicker, setShowPicker] = useState(false)
  const [burst, setBurst] = useState<string | null>(null)

  const handleReaction = (key: string) => {
    const prev = activeReaction
    if (prev === key) {
      setActiveReaction(null)
      setLikeCount(c => Math.max(0, c - 1))
      localStorage.removeItem(storageKey)
    } else {
      if (!prev) setLikeCount(c => c + 1)
      setActiveReaction(key)
      setBurst(key)
      setTimeout(() => setBurst(null), 700)
      localStorage.setItem(storageKey, key)
    }
    setShowPicker(false)
  }

  const handleRepost = () => {
    setRepostCount(c => c + 1)
    onRepost?.()
  }

  const handleLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
    onLinkedInShare?.()
  }

  const active = REACTIONS.find(r => r.key === activeReaction)

  return (
    <div className="flex items-center gap-1 pt-3 mt-3 border-t border-border relative">
      {/* Reaction picker trigger */}
      <div className="relative">
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-card clean-border rounded-full px-3 py-2 shadow-xl z-50"
            >
              {REACTIONS.map(r => (
                <button
                  key={r.key}
                  onClick={() => handleReaction(r.key)}
                  title={r.label}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-lg hover:scale-125 transition-transform cursor-pointer ${activeReaction === r.key ? r.bg : ''}`}
                >
                  {r.emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setTimeout(() => setShowPicker(false), 300)}
          onClick={() => active ? handleReaction(active.key) : handleReaction('like')}
          className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer hover:bg-secondary ${
            active ? `${active.color} ${active.bg}` : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {burst && (
            <motion.span
              key={burst}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center text-xl pointer-events-none"
            >
              {REACTIONS.find(r => r.key === burst)?.emoji}
            </motion.span>
          )}
          {active ? (
            <active.Icon className="w-3.5 h-3.5" />
          ) : (
            <ThumbsUp className="w-3.5 h-3.5" />
          )}
          <span>{active?.label || 'Like'}</span>
          {likeCount > 0 && <span className="opacity-60">{likeCount}</span>}
        </button>
      </div>

      {/* Comment */}
      <button
        onClick={onComment}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-accent-blue hover:bg-accent-blue/10 transition-all cursor-pointer"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>Comment</span>
        {initialComments > 0 && <span className="opacity-60">{initialComments}</span>}
      </button>

      {/* Repost */}
      <button
        onClick={handleRepost}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-accent-emerald hover:bg-accent-emerald/10 transition-all cursor-pointer"
      >
        <Repeat2 className="w-3.5 h-3.5" />
        <span>Repost</span>
        {repostCount > 0 && <span className="opacity-60">{repostCount}</span>}
      </button>

      {/* LinkedIn share */}
      <button
        onClick={handleLinkedIn}
        className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all cursor-pointer"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  )
}
