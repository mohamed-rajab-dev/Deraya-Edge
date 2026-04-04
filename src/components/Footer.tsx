'use client'

import { Link } from 'react-router-dom'

const LINKS = {
  Platform: [
    { label: 'Research Papers', href: '/research' },
    { label: 'Courses', href: '/courses' },
    { label: 'Events', href: '/events' },
    { label: 'Community', href: '/community' },
    { label: 'Internship', href: '/internship' },
    { label: 'Articles', href: '/articles' },
  ],
  University: [
    { label: 'About Deraya', href: '/about' },
    { label: 'Faculties', href: '/#faculties' },
    { label: 'Researchers', href: '/community' },
  ],
  Tools: [
    { label: 'Google Scholar', href: 'https://scholar.google.com', external: true },
    { label: 'PubMed', href: 'https://pubmed.ncbi.nlm.nih.gov', external: true },
    { label: 'ResearchGate', href: 'https://researchgate.net', external: true },
    { label: 'JSTOR', href: 'https://jstor.org', external: true },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="mb-6 flex items-center gap-0.5">
              <span className="font-playfair text-2xl font-black text-background tracking-tighter">Deraya</span>
              <div className="ml-1 px-1.5 py-0.5 bg-background text-foreground rounded-md shadow-lg shadow-white/5">
                <span className="font-playfair text-18px font-black italic tracking-tight">Edge</span>
              </div>
            </div>
            <p className="text-background/50 text-sm leading-relaxed font-playfair">
              A platform for non-peer-reviewed scientific research across Deraya University's four faculties.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-playfair font-black text-background text-sm mb-6 uppercase tracking-[0.2em] opacity-60 italic">{group}</h4>
              <div className="space-y-3">
                {links.map(link => (
                  'external' in link ? (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="block text-background/50 hover:text-background transition-colors text-sm">
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link key={link.label} to={link.href}
                      className="block text-background/50 hover:text-background transition-colors text-sm">
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <span>© 2026 Deraya Edge — Deraya University Research Platform.</span>
          <span>Non-Peer-Reviewed Academic Platform</span>
        </div>
      </div>
    </footer>
  )
}
