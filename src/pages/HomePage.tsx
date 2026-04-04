import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { Recommended } from '@/components/Recommended'
import { Courses } from '@/components/Courses'
import { Events } from '@/components/Events'
import { Downloads } from '@/components/Downloads'
import { Articles } from '@/components/Articles'
import { Community } from '@/components/Community'
import { Internship } from '@/components/Internships'
import { Footer } from '@/components/Footer'
import { DonChatbot } from '@/components/DonChatbot'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground perspective-container overflow-x-hidden">
      <Navbar />
      <main role="main">
        {/* Animated Hero with 3D elements */}
        <section id="hero" className="relative z-10"><Hero /></section>
        
        {/* All sections concisely integrated */}
        <div className="space-y-0">
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d bg-secondary/10"
          >
            <Recommended />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d"
          >
            <Services />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d bg-secondary/5"
          >
            <Courses />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d"
          >
            <Events />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d bg-secondary/5"
          >
            <Downloads />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d bg-secondary/10"
          >
            <Internship />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d"
          >
            <Articles />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="card-3d bg-secondary/10"
          >
            <Community />
          </motion.section>
        </div>
      </main>
      <Footer />
      <DonChatbot />
    </div>
  )
}
