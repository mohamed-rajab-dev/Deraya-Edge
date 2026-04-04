'use client'

import { motion } from 'framer-motion'
import campusImg from '@/assets/campus.jpg'
import labImg from '@/assets/lab.jpg'
import studentsImg from '@/assets/students.jpg'

export function About() {
  return (
    <section id="about" className="relative py-24 bg-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-2xl overflow-hidden elevated-shadow"
        >
          <img src={campusImg} alt="University campus" loading="lazy" width={1280} height={720} className="w-full h-64 md:h-80 object-cover" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-[3px] bg-accent-emerald rounded-full" />
              <span className="text-accent-emerald text-sm font-bold uppercase tracking-widest">About Us</span>
            </div>
            <h2 className="font-bagel text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              Empowering<br />Academic<br /><span className="text-accent-red">Research</span>
            </h2>
            <p className="text-foreground/90 leading-relaxed text-lg mb-6">
              Deraya Edge is a dedicated platform for publishing and sharing non-peer-reviewed scientific research from Deraya University.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Open Access', 'Non-Peer-Reviewed', 'Multi-Faculty', 'Student-Friendly'].map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-card clean-border rounded-full text-sm font-medium text-foreground">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-xl overflow-hidden elevated-shadow">
                <img src={labImg} alt="Research lab" loading="lazy" width={640} height={640} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="rounded-xl overflow-hidden elevated-shadow">
                <img src={studentsImg} alt="Students collaborating" loading="lazy" width={640} height={640} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            </div>
            <div className="bg-card clean-border rounded-2xl p-8">
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to make research accessible, encourage scholarly communication, and build a vibrant academic community where knowledge flows freely between faculties and beyond.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
