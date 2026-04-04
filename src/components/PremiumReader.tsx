import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { X, Type, ZoomIn, ZoomOut, Share2, BookOpen, Clock, Download, ArrowLeft } from 'lucide-react'
import { Reactions } from './Reactions'

export interface PremiumReaderProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: string
    userId?: string
    title: string
    content?: string
    abstract?: string
    author: string
    faculty: string
    date: string | Date
    readTime?: number | string
    coverUrl?: string
    fileUrl?: string
    type: 'article' | 'research'
    likesCount?: number
    commentsCount?: number
  } | null
}

export function PremiumReader({ isOpen, onClose, item }: PremiumReaderProps) {
  const [fontSize, setFontSize] = useState(18) // Base font size
  const scrollRef = useRef<HTMLDivElement>(null)

  // Use Scroll Progress
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !item) return null

  const handleZoomIn = () => setFontSize(prev => Math.min(prev + 2, 28))
  const handleZoomOut = () => setFontSize(prev => Math.max(prev - 2, 14))

  // Determine readable content
  const readableContent = item.content || item.abstract || "No detailed content available."
  const paragraphs = readableContent.split('\n\n').filter(p => p.trim())

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[500] bg-background flex flex-col"
      >
        {/* Progress Bar */}
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-blue z-[501] origin-left" style={{ scaleX }} />

        {/* Reader Action Bar */}
        <div className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-xl z-[501]">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold px-2 py-2 rounded-xl transition-colors cursor-pointer group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center bg-secondary rounded-full p-1 border border-border">
                <button onClick={handleZoomOut} className="p-1.5 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button onClick={handleZoomIn} disabled={fontSize >= 28} className="p-1.5 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Reader Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" ref={scrollRef}>
          <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20 pb-32">
            
            {/* Header / Meta */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                 <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue text-xs font-bold rounded-full uppercase tracking-widest">{item.faculty}</span>
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.type}</span>
              </div>
              
              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-foreground font-black leading-[1.1] tracking-tighter mb-8">
                {item.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-8 border-b border-border/50">
                {item.userId ? (
                  <a href={`/researcher/${item.userId}`} className="font-semibold text-foreground hover:text-accent-blue hover:underline transition-colors">By {item.author}</a>
                ) : (
                  <span className="font-semibold text-foreground">By {item.author}</span>
                )}
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {item.readTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.readTime} min read</span>
                  </>
                )}
              </div>
            </header>

            {/* Optional Cover */}
            {item.coverUrl && (
              <div className="mb-12 rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl border border-white/5">
                <img src={item.coverUrl} className="w-full h-full object-cover" alt="Cover" />
              </div>
            )}

            {/* Typography Content Wrapper */}
            <article 
              className="font-serif text-foreground/90 leading-relaxed transition-all duration-300"
              style={{ fontSize: `${fontSize}px` }}
            >
              {paragraphs.map((para, i) => {
                // Determine if paragraph is a heading (pseudo-markdown)
                const isHeading = para.length < 80 && para.endsWith('.') === false && !para.includes(',');
                
                if (isHeading && i !== 0) {
                  return <h3 key={i} className="font-playfair font-black text-2xl mt-12 mb-6 text-foreground">{para}</h3>
                }

                // Drop cap for the very first paragraph
                if (i === 0) {
                  return (
                    <p key={i} className="mb-8">
                      <span className="float-left text-6xl font-playfair font-black text-accent-blue leading-[0.8] pr-3 pt-2">{para.charAt(0)}</span>
                      {para.slice(1)}
                    </p>
                  )
                }

                return <p key={i} className="mb-8">{para}</p>
              })}
            </article>

            {/* Special Research Call to Action */}
            {item.type === 'research' && item.fileUrl && (
              <div className="mt-16 p-8 bg-secondary/30 rounded-[32px] border border-border flex flex-col items-center text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mb-4" />
                <h4 className="font-playfair text-2xl font-black text-foreground mb-3">Read Full Document</h4>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">This is just the abstract. To view the complete methodology, findings, and citations, download the full paper.</p>
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-accent-blue text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20 hover:scale-105 active:scale-95">
                  <Download className="w-5 h-5" /> Download PDF Payload
                </a>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border/50">
              <Reactions 
                itemId={item.id} 
                itemType={item.type === 'article' ? 'article' : 'paper'} 
                initialLikes={item.likesCount || 0}
                initialComments={item.commentsCount || 0}
              />
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
