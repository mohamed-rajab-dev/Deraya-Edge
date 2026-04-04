import { Navbar } from '@/components/Navbar'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { DonChatbot } from '@/components/DonChatbot'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <About />
          <Contact />
        </motion.div>
      </div>
      <Footer />
      <DonChatbot />
    </div>
  )
}
