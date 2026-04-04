'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthModal'
import { motion } from 'framer-motion'

export function Contact() {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <section id="contact" className="relative py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-[3px] bg-accent-red rounded-full" />
              <span className="text-accent-red text-sm font-bold uppercase tracking-widest">Get Started</span>
            </div>
            <h2 className="font-bagel text-4xl sm:text-5xl text-foreground mb-10">How It Works</h2>
            <div className="space-y-6">
              {[
                { n: '01', t: 'Create Your Account', d: 'Sign up with Google, Microsoft, or email to join the community.', c: 'accent-blue' },
                { n: '02', t: 'Complete Your Profile', d: 'Add your faculty, bio, and research interests.', c: 'accent-emerald' },
                { n: '03', t: 'Publish & Share', d: 'Upload research papers, write articles, or showcase projects.', c: 'accent-purple' },
              ].map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-5"
                >
                  <div className={`w-12 h-12 bg-${step.c}/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-${step.c} font-black text-sm`}>{step.n}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{step.t}</h3>
                    <p className="text-muted-foreground text-sm">{step.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card clean-border rounded-2xl p-8 lg:p-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-red/5 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-[50px]" />
            
            <div className="relative z-10">
              <h3 className="font-bagel text-3xl text-foreground mb-4">Ready to Publish?</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join our growing community of researchers and start sharing your academic work today.
              </p>
              {user ? (
                <a href="/profile"
                  className="inline-flex items-center gap-2 publish-shimmer text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform text-lg shadow-lg shadow-accent-red/25">
                  <Sparkles className="w-5 h-5" />
                  Go to My Profile <ArrowRight className="w-5 h-5" />
                </a>
              ) : (
                <button onClick={() => setShowAuth(true)}
                  className="inline-flex items-center gap-2 publish-shimmer text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform text-lg cursor-pointer shadow-lg shadow-accent-red/25">
                  <Sparkles className="w-5 h-5" />
                  Create Your Account <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </section>
  )
}
