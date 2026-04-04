import { Navbar } from '@/components/Navbar'
import { Courses } from '@/components/Courses'
import { Footer } from '@/components/Footer'
import { DonChatbot } from '@/components/DonChatbot'
import { motion } from 'framer-motion'

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Courses />
        </motion.div>
      </div>
      <Footer />
      <DonChatbot />
    </div>
  )
}
