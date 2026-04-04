

## Plan: Convert to English + Add Downloads & Projects Sections

### Current State
The site is a mix of Arabic (Hero, Services/Faculties) and English (About, Portfolio, Team, Awards, Contact, Footer). It's themed around scientific research for 4 faculties.

### Changes

**1. Convert All Arabic Text to English**
- **Hero.tsx**: Nav links → Faculties, Research, About, Researchers, Contact. Headline → "Non-Peer-Reviewed Research Platform" / "4 Distinguished Faculties". CTA → "Publish Your Research"
- **Services.tsx**: Faculty titles, descriptions, and labels → English (Business, Physical Therapy, Dentistry, Pharmacy). Keep the same structure and data.

**2. New Component: Downloads Section (`src/components/Downloads.tsx`)**
A section for downloading research posts/publications. Cards with:
- Sample research papers per faculty (title, faculty tag, author, date, download button)
- Filter tabs by faculty
- Download icon + "Download PDF" button per card
- Styled consistently with existing design system (clean-border, rounded-3xl, elevated-shadow)

**3. New Component: Projects Section (`src/components/Projects.tsx`)**
A showcase of research projects across the 4 faculties:
- Grid of project cards with image, title, faculty badge, description, status (Ongoing/Completed)
- Sample projects for each faculty
- Consistent styling with the rest of the site

**4. Update App.tsx**
- Import and add `<Downloads />` and `<Projects />` sections
- Reorder sections: Hero → Faculties → Downloads → Projects → About → Team → Contact
- Remove Portfolio and Awards sections (no longer relevant to research platform)

**5. Update Footer.tsx**
- Replace AI tools list with research-relevant content (research tools, academic links)
- Update social links and address to be generic/placeholder
- Update description to match research platform theme

**6. Update Contact.tsx**
- Change header text to English: "Ready to Publish?" / "Book a consultation to discuss your research"

### Files Modified
- `src/components/Hero.tsx` — Arabic → English
- `src/components/Services.tsx` — Arabic → English
- `src/components/Contact.tsx` — Update heading text
- `src/components/Footer.tsx` — Update to research context
- `src/components/Downloads.tsx` — New component
- `src/components/Projects.tsx` — New component
- `src/App.tsx` — Add new sections, remove Portfolio/Awards

