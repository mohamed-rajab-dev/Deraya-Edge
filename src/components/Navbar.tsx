import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';

const PRIMARY_LINKS = [
	{ label: 'Faculties', href: '/#faculties' },
	{ label: 'Research', href: '/research' },
	{ label: 'Courses', href: '/courses' },
	{ label: 'Events', href: '/events' },
	{ label: 'Articles', href: '/articles' },
];

const SECONDARY_LINKS = [
	{ label: 'Community', href: '/community' },
	{ label: 'Internship', href: '/internship' },
	{ label: 'About', href: '/about' },
];

export function Navbar() {
	const { user, signOut } = useAuth();
	const location = useLocation();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const [showAuth, setShowAuth] = useState(false);
	const [isDark, setIsDark] = useState(
		() => localStorage.getItem('theme') === 'dark',
	);

	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDark]);

	useEffect(() => {
		document.documentElement.lang = 'en';
		document.documentElement.dir = 'ltr';
	}, []);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 48);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		setIsMobileOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		document.body.style.overflow = isMobileOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isMobileOpen]);

	return (
		<>
			<motion.nav
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				className='fixed top-4 left-0 right-0 w-full z-[110] px-6'>
				<div
					className={`mx-auto max-w-[880px] transition-all duration-500 rounded-[22px] border ${isScrolled ? 'glass-navbar shadow-2xl py-0.5 px-3 border-white/5' : 'bg-transparent py-1.5 px-2 border-transparent'}`}>
					<div className='max-w-7xl mx-auto px-4 lg:px-5 py-2 flex items-center justify-between gap-4'>
						{/* ── Creative Logo (Smaller) ── */}
						<Link
							to='/'
							className='flex items-center gap-0.5 flex-shrink-0 group relative overflow-hidden'>
							<span className='font-playfair text-2xl font-black text-foreground tracking-tighter'>
								Deraya
							</span>
							<div className='ml-0.5 px-2 py-0.5 bg-accent-blue rounded-md shadow-lg shadow-accent-blue/20 flex items-center justify-center group-hover:scale-105 transition-transform'>
								<span className='font-playfair text-[14px] font-black text-white italic tracking-tight'>
									Edge
								</span>
							</div>
						</Link>

						<div className='h-4 w-px bg-border/60 mx-3 hidden lg:block' />

						<div className='hidden lg:flex items-center flex-1 justify-center'>
							<div className='flex items-center gap-0.5'>
								{PRIMARY_LINKS.map((item, i) => {
									const isActive =
										location.pathname === item.href ||
										(item.href !== '/' &&
											location.pathname.startsWith(item.href.split('?')[0]));
									const label = item.label;
									const isAnchor = item.href.startsWith('/#');

									return (
										<motion.div
											key={item.label}
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 + i * 0.05 }}>
											<Link
												to={item.href}
												className={`text-[11.5px] px-3.5 py-2 rounded-xl font-semibold transition-all duration-300 tracking-[0.05em]
                          ${isActive ? 'text-accent-blue bg-accent-blue/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'}`}>
												{label}
											</Link>
										</motion.div>
									);
								})}

								{/* More Dropdown */}
								<div
									className='relative ml-1'
									onMouseEnter={() => setIsMoreOpen(true)}
									onMouseLeave={() => setIsMoreOpen(false)}>
									<button className='flex items-center gap-1 text-[11.5px] px-3.5 py-2 rounded-xl font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all cursor-pointer'>
										More{' '}
										<ChevronDown
											className={`w-3.5 h-3.5 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}
										/>
									</button>

									<AnimatePresence>
										{isMoreOpen && (
											<motion.div
												initial={{ opacity: 0, y: 10, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: 10, scale: 0.95 }}
												className='absolute top-full start-0 mt-1 w-44 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-[120]'>
												<div className='p-1.5 flex flex-col'>
													{SECONDARY_LINKS.map((item) => (
														<Link
															key={item.label}
															to={item.href}
															className='text-[11.5px] px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all font-medium'>
															{item.label}
														</Link>
													))}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</div>

						{/* ── Redesigned Action Hub (Unified, Animated) ── */}
						<div className='flex items-center gap-3 flex-shrink-0'>
							{/* Theme Flip Toggle */}
							<button
								onClick={() => setIsDark(!isDark)}
								className='w-8 h-8 flex items-center justify-center rounded-full bg-secondary/50 backdrop-blur-md border border-border/40 hover:bg-secondary transition-all text-muted-foreground hover:text-foreground cursor-pointer shadow-sm group'>
								<motion.div
									key={isDark ? 'dark' : 'light'}
									initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
									animate={{ rotate: 0, scale: 1, opacity: 1 }}
									transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
									{isDark ? (
										<Sun className='w-4 h-4 text-amber-400' />
									) : (
										<Moon className='w-4 h-4 text-accent-blue' />
									)}
								</motion.div>
							</button>

							<button
								onClick={() => setIsMobileOpen(true)}
								className='lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-secondary/50 backdrop-blur-md border border-border/40 hover:bg-secondary transition-all text-muted-foreground hover:text-foreground cursor-pointer shadow-sm'
								aria-label='Open navigation menu'>
								<Menu className='w-4 h-4' />
							</button>

							{user ? (
								<Link
									to='/profile'
									className='flex items-center gap-1.5 bg-accent-blue/10 hover:bg-accent-blue/20 px-4 py-2 rounded-full transition-all border border-accent-blue/20'>
									{user.user_metadata?.avatar_url ? (
										<img
											src={user.user_metadata.avatar_url}
											className='w-4 h-4 rounded-full'
											alt=''
										/>
									) : (
										<User className='w-4 h-4 text-accent-blue' />
									)}
									<span className='text-[11px] font-bold text-foreground truncate max-w-[70px] ml-1'>
										{
											(
												user.user_metadata?.full_name ||
												user.user_metadata?.name ||
												user.email ||
												''
											).split(' ')[0]
										}
									</span>
								</Link>
							) : (
								<button
									onClick={() => setShowAuth(true)}
									className='bg-accent-blue text-white font-bold px-7 py-2.5 rounded-full hover:bg-accent-blue/90 transition-all text-[12px] cursor-pointer shadow-lg shadow-accent-blue/20 active:scale-95'>
									Sign In
								</button>
							)}
						</div>
					</div>
				</div>
			</motion.nav>

			{/* ── Mobile Menu ── */}
			<AnimatePresence>
				{isMobileOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-[200] bg-background flex flex-col p-8 overflow-y-auto lg:hidden'>
						<div className='flex items-center justify-between mb-10'>
							<Link
								to='/'
								className='flex items-center gap-0.5'>
								<span className='font-playfair text-2xl font-black text-foreground tracking-tighter'>
									Deraya
								</span>
								<div className='ml-1 px-2 py-0.5 bg-accent-blue rounded-md shadow-lg shadow-accent-blue/30'>
									<span className='font-playfair text-lg font-black text-white italic tracking-tight'>
										Edge
									</span>
								</div>
							</Link>
							<button
								onClick={() => setIsMobileOpen(false)}
								className='w-10 h-10 flex items-center justify-center rounded-full bg-secondary cursor-pointer'>
								<X className='w-5 h-5' />
							</button>
						</div>
						<div className='space-y-1 flex-1'>
							{[...PRIMARY_LINKS, ...SECONDARY_LINKS].map((link, i) => (
								<motion.div
									key={link.label}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.04 }}>
									<Link
										to={link.href}
										onClick={() => setIsMobileOpen(false)}
										className='block text-2xl font-playfair text-foreground hover:text-accent-blue transition-colors py-2.5'>
										{link.label}
									</Link>
								</motion.div>
							))}
						</div>
						<div className='pt-8 border-t border-border flex gap-3 mt-6'>
							{user ? (
								<button
									onClick={() => {
										signOut();
										setIsMobileOpen(false);
									}}
									className='flex-1 bg-secondary text-foreground py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2'>
									<LogOut className='w-4 h-4' /> Sign Out
								</button>
							) : (
								<button
									onClick={() => {
										setIsMobileOpen(false);
										setShowAuth(true);
									}}
									className='flex-1 bg-accent-blue text-white py-3.5 rounded-2xl font-bold'>
									Sign In
								</button>
							)}

							<button
								onClick={() => setIsDark(!isDark)}
								className='w-14 h-14 flex items-center justify-center rounded-2xl bg-secondary flex-shrink-0'>
								{isDark ? (
									<Sun className='w-5 h-5' />
								) : (
									<Moon className='w-5 h-5' />
								)}
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<AuthModal
				isOpen={showAuth}
				onClose={() => setShowAuth(false)}
			/>
		</>
	);
}
