import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import campusImg from '@/assets/campus.jpg';

const STATS = [
	{ value: '4', label: 'Faculties' },
	{ value: '120+', label: 'Papers' },
	{ value: '2.4k', label: 'Students' },
	{ value: '38', label: 'Researchers' },
];

const SECTIONS = [
	{
		label: 'Research Papers',
		href: '/research',
		desc: 'Peer-reviewed & non-peer academic publications',
	},
	{
		label: 'Courses',
		href: '/courses',
		desc: 'Faculty-curated academic learning',
	},
	{ label: 'Events', href: '/events', desc: 'Workshops & seminars' },
	{ label: 'Community', href: '/community', desc: 'Academic social network' },
	{ label: 'Articles', href: '/articles', desc: 'Essays & insights' },
	{
		label: 'Internship',
		href: '/internship',
		desc: 'Opportunities & placements',
	},
];

export function Hero() {
	const navigate = useNavigate();
	const [searchVal, setSearchVal] = useState('');
	const { scrollY } = useScroll();
	const y = useTransform(scrollY, [0, 600], [0, 120]);
	const opacity = useTransform(scrollY, [0, 400], [1, 0]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchVal.trim())
			navigate(`/research?q=${encodeURIComponent(searchVal.trim())}`);
	};

	return (
		<div className='relative min-h-screen w-full bg-background overflow-hidden'>
			<div className='absolute inset-0 z-0'>
				<img
					src={campusImg}
					alt='Deraya University campus'
					loading='eager'
					className='w-full h-full object-cover opacity-30 dark:opacity-20'
				/>
				<div className='absolute inset-0 bg-gradient-to-b from-background via-transparent to-background' />
			</div>

			{/* 3D background grid */}
			<div className='absolute inset-0 pointer-events-none overflow-hidden z-[1]'>
				<div
					className='absolute inset-0'
					style={{
						backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
						backgroundSize: '72px 72px',
						opacity: 0.2,
						transform: 'perspective(800px) rotateX(10deg) scale(1.1)',
						transformOrigin: 'top center',
					}}
				/>
			</div>

			{/* Glows */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-1/3 left-1/4 w-[640px] h-[640px] bg-accent-red/[0.06] rounded-full blur-[120px]' />
				<div className='absolute bottom-0 right-1/4 w-[480px] h-[480px] bg-accent-blue/[0.04] rounded-full blur-[100px]' />
			</div>

			<motion.div
				style={{ y, opacity }}
				className='relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-44 pb-24'>
				{/* Tag */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}>
					<div className='inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-10'>
						<span className='w-8 h-px bg-accent-red' />
						Deraya University Research Platform
						<span className='w-8 h-px bg-accent-red' />
					</div>
				</motion.div>

				{/* Title — 3D card style */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
					style={{
						transform: 'perspective(1200px) rotateX(1deg)',
						transformOrigin: 'top center',
					}}
					className='mb-10'>
					{/* "Deraya" in Playfair Display — thin, editorial */}
					<div
						className='flex flex-col items-start'
						style={{ perspective: '1200px' }}>
						<motion.h1
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: 'easeOut' }}
							className='font-playfair text-[clamp(4.5rem,14vw,11rem)] font-black leading-[0.85] tracking-tighter text-foreground mb-4 select-none'>
							Deraya
						</motion.h1>
						<motion.div
							initial={{ opacity: 0, x: 30, scale: 0.8, rotate: 5 }}
							animate={{ opacity: 1, x: 0, scale: 1, rotate: -2 }}
							whileHover={{ rotate: 0, scale: 1.05 }}
							transition={{ duration: 0.8, delay: 0.3, ease: 'backOut' }}
							className='relative px-8 py-3 bg-accent-blue rounded-[20px] shadow-2xl shadow-accent-blue/40 overflow-hidden group/logo cursor-default'>
							<span className='font-playfair text-[clamp(2.5rem,8vw,5.5rem)] font-black text-white italic tracking-tight leading-none block'>
								Edge
							</span>
							{/* Internal Shimmer */}
							<div className='absolute inset-0 w-full h-full pointer-events-none'>
								<div className='w-[50%] h-full bg-white/20 -skew-x-45 animate-shimmer absolute -left-[100%]' />
							</div>
						</motion.div>
					</div>
				</motion.div>

				{/* Search */}
				<motion.form
					onSubmit={handleSearch}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='max-w-2xl mb-12'
					style={{ perspective: '800px' }}>
					<motion.div
						whileFocus={{ scale: 1.01 }}
						className='flex items-center bg-card border border-border rounded-2xl px-5 py-3 transition-all focus-within:ring-2 focus-within:ring-accent-red/20 focus-within:border-accent-red/30 shadow-lg shadow-black/5'>
						<Search className='w-5 h-5 text-muted-foreground mr-3 flex-shrink-0' />
						<input
							type='text'
							value={searchVal}
							onChange={(e) => setSearchVal(e.target.value)}
							placeholder='Search research, authors, faculties...'
							className='flex-1 bg-transparent text-foreground focus:outline-none placeholder:text-muted-foreground/50 text-sm'
						/>
						<button
							type='submit'
							className='bg-accent-red text-white px-5 py-2 rounded-xl hover:bg-accent-red/90 transition text-sm font-semibold flex items-center gap-2 cursor-pointer flex-shrink-0'>
							Search <ArrowRight className='w-4 h-4' />
						</button>
					</motion.div>
				</motion.form>

				{/* Sections grid — 3D card grid */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.7 }}
					className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16'>
					{SECTIONS.map((s, i) => (
						<motion.a
							key={s.label}
							href={s.href}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.55 + i * 0.05 }}
							whileHover={{ y: -6, rotateX: -6, scale: 1.05 }}
							style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
							className='group block bg-card border border-border/40 rounded-2xl p-5 text-center hover:border-accent-red/30 hover:shadow-2xl hover:shadow-accent-red/5 transition-all duration-500 cursor-pointer card-3d'>
							<div className='font-playfair font-black text-foreground text-xs mb-1 group-hover:text-accent-red transition-colors tracking-widest uppercase'>
								{s.label}
							</div>
							<div className='text-muted-foreground text-[10px] leading-tight font-playfair italic opacity-60 group-hover:opacity-100 transition-opacity'>
								{s.desc}
							</div>
						</motion.a>
					))}
				</motion.div>
			</motion.div>
		</div>
	);
}
