import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	ArrowRight,
	X,
	CheckCircle,
	Plus,
	BookOpen,
	Clock,
	Users,
	Upload,
	Loader2,
	ChevronLeft,
	ChevronRight,
	Image,
	Video,
	List,
	Star,
	Play,
	Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FilterDropdown } from './FilterDropdown';
import { Reactions } from './Reactions';
import { apiUpload } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';

/* ───────── helpers ─────────────────────────────────────────────── */
const LEVEL_BADGE: Record<string, string> = {
	Beginner:
		'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
	Intermediate:
		'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
	Advanced:
		'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const EMOJIS = [
	'BookOpen',
	'GraduationCap',
	'Microscope',
	'Stethoscope',
	'Activity',
	'Brain',
];
const FACULTIES = [
	'Pharmacy',
	'Business',
	'Physical Therapy',
	'Dentistry',
	'All Faculties',
];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

/* ───────── Add Course Modal — 3 Steps ──────────────────────────── */
type Step = 'info' | 'media' | 'modules';

interface Module {
	title: string;
	description: string;
	duration: string;
}

interface AddCourseModalProps {
	onClose: () => void;
	onAdded: (c: any) => void;
}

function StepIndicator({ step }: { step: Step }) {
	const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
		{
			key: 'info',
			label: 'Basic Info',
			icon: <BookOpen className='w-4 h-4' />,
		},
		{ key: 'media', label: 'Media', icon: <Image className='w-4 h-4' /> },
		{ key: 'modules', label: 'Modules', icon: <List className='w-4 h-4' /> },
	];
	const idx = steps.findIndex((s) => s.key === step);
	return (
		<div className='flex items-center gap-0 mb-8'>
			{steps.map((s, i) => (
				<div
					key={s.key}
					className='flex items-center flex-1'>
					<div
						className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
							i <= idx
								? 'bg-foreground text-background'
								: 'bg-secondary text-muted-foreground'
						}`}>
						{s.icon} {s.label}
					</div>
					{i < steps.length - 1 && (
						<div
							className={`flex-1 h-px mx-1 ${i < idx ? 'bg-foreground' : 'bg-border'}`}
						/>
					)}
				</div>
			))}
		</div>
	);
}

function AddCourseModal({ onClose, onAdded }: AddCourseModalProps) {
	const { user } = useAuth();
	const [step, setStep] = useState<Step>('info');
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(false);

	// Step 1: info
	const [form, setForm] = useState({
		title: '',
		description: '',
		faculty: '',
		level: 'Beginner',
		duration: '',
		instructor: '',
		image_url: '📚',
		featured: false,
	});

	// Step 2: media
	const [coverUrl, setCoverUrl] = useState('');
	const [videoUrl, setVideoUrl] = useState('');
	const [previewType, setPreviewType] = useState<'image' | 'video' | null>(
		null,
	);

	// Step 3: modules
	const [modules, setModules] = useState<Module[]>([
		{ title: '', description: '', duration: '' },
	]);

	const addModule = () =>
		setModules((m) => [...m, { title: '', description: '', duration: '' }]);
	const removeModule = (i: number) =>
		setModules((m) => m.filter((_, idx) => idx !== i));
	const updateModule = (i: number, field: keyof Module, val: string) =>
		setModules((m) =>
			m.map((mod, idx) => (idx === i ? { ...mod, [field]: val } : mod)),
		);

	const nextStep = () => {
		if (step === 'info') setStep('media');
		else if (step === 'media') setStep('modules');
	};
	const prevStep = () => {
		if (step === 'media') setStep('info');
		else if (step === 'modules') setStep('media');
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setLoading(true);
		try {
			const url = await apiUpload(file);
			setCoverUrl(url);
			setPreviewType('image');
		} catch (err) {
			alert('Upload failed');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async () => {
		if (!user) {
			alert('Please sign in to add a course');
			return;
		}
		setLoading(true);
		try {
			const payload = {
				title: form.title,
				description: form.description,
				faculty: form.faculty,
				level: form.level,
				duration: form.duration,
				instructor:
					form.instructor ||
					user.user_metadata?.full_name ||
					user.email?.split('@')[0],
				image_url: form.image_url,
				cover_url: coverUrl,
				video_url: videoUrl,
				featured: form.featured,
				modules: modules.filter((m) => m.title),
				user_id: user.id,
			};
			const { data, error } = await supabase
				.from('courses')
				.insert(payload)
				.select()
				.single();
			if (error) throw error;
			onAdded(data);
			setDone(true);
		} catch (err: any) {
			alert(err.message || 'Failed to publish course');
		} finally {
			setLoading(false);
		}
	};

	const isStep1Valid = form.title && form.description && form.faculty;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
			onClick={onClose}>
			<motion.div
				initial={{ opacity: 0, y: 30, scale: 0.97 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 20, scale: 0.97 }}
				transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
				className='bg-card border border-border rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl max-h-[92vh] overflow-y-auto'
				onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					className='absolute top-5 right-5 p-1.5 rounded-full hover:bg-secondary cursor-pointer transition-colors'>
					<X className='w-5 h-5 text-muted-foreground' />
				</button>

				{done ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='text-center py-10'>
						<div className='w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-5'>
							<CheckCircle className='w-9 h-9 text-green-500' />
						</div>
						<h3 className='font-playfair text-3xl text-foreground mb-2'>
							Course Published!
						</h3>
						<p className='text-muted-foreground text-sm mb-6'>
							Your course is now live for students to discover and enroll.
						</p>
						<button
							onClick={onClose}
							className='bg-foreground text-background px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity'>
							Done
						</button>
					</motion.div>
				) : (
					<>
						<div className='mb-1'>
							<div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3'>
								<Upload className='w-3.5 h-3.5' /> New Academic Course
							</div>
							<h2 className='font-playfair text-3xl text-foreground mb-6'>
								Add a Course
							</h2>
							<StepIndicator step={step} />
						</div>

						{/* ── Step 1: Basic Info ── */}
						<AnimatePresence mode='wait'>
							{step === 'info' && (
								<motion.div
									key='info'
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.25 }}
									className='space-y-4'>
									{/* Icon picker */}
									<div>
										<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
											Icon
										</label>
										<div className='flex gap-2 flex-wrap'>
											{EMOJIS.map((e) => (
												<button
													type='button'
													key={e}
													onClick={() =>
														setForm((f) => ({ ...f, image_url: e }))
													}
													className={`text-2xl w-11 h-11 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer bg-secondary/50
                            ${form.image_url === e ? 'border-foreground bg-secondary scale-110' : 'border-border hover:border-foreground/40 hover:scale-105'}`}>
													<BookOpen className='w-5 h-5' />
												</button>
											))}
										</div>
									</div>

									<div>
										<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
											Course Title *
										</label>
										<input
											required
											value={form.title}
											onChange={(e) =>
												setForm((f) => ({ ...f, title: e.target.value }))
											}
											placeholder='e.g. Advanced Clinical Pharmacology'
											className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 transition'
										/>
									</div>

									<div>
										<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
											Description *
										</label>
										<textarea
											required
											value={form.description}
											onChange={(e) =>
												setForm((f) => ({ ...f, description: e.target.value }))
											}
											placeholder='What will students learn? What are the prerequisites?'
											rows={3}
											className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 transition resize-none'
										/>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
												Faculty *
											</label>
											<select
												required
												value={form.faculty}
												onChange={(e) =>
													setForm((f) => ({ ...f, faculty: e.target.value }))
												}
												className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none cursor-pointer'>
												<option value=''>Select Faculty</option>
												{FACULTIES.map((f) => (
													<option
														key={f}
														value={f}>
														{f}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
												Level
											</label>
											<select
												value={form.level}
												onChange={(e) =>
													setForm((f) => ({ ...f, level: e.target.value }))
												}
												className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none cursor-pointer'>
												{LEVELS.map((l) => (
													<option
														key={l}
														value={l}>
														{l}
													</option>
												))}
											</select>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
												Duration
											</label>
											<input
												value={form.duration}
												onChange={(e) =>
													setForm((f) => ({ ...f, duration: e.target.value }))
												}
												placeholder='e.g. 8 weeks'
												className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none'
											/>
										</div>
										<div>
											<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
												Instructor
											</label>
											<input
												value={form.instructor}
												onChange={(e) =>
													setForm((f) => ({ ...f, instructor: e.target.value }))
												}
												placeholder='Your name'
												className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none'
											/>
										</div>
									</div>

									<label className='flex items-center gap-3 cursor-pointer'>
										<input
											type='checkbox'
											checked={form.featured}
											onChange={(e) =>
												setForm((f) => ({ ...f, featured: e.target.checked }))
											}
											className='w-4 h-4 rounded cursor-pointer'
										/>
										<span className='text-sm text-muted-foreground'>
											Mark as Featured Course
										</span>
										<Star className='w-4 h-4 text-amber-500' />
									</label>
								</motion.div>
							)}

							{/* ── Step 2: Media ── */}
							{step === 'media' && (
								<motion.div
									key='media'
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.25 }}
									className='space-y-5'>
									<div>
										<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
											<span className='flex items-center gap-2'>
												<Image className='w-3.5 h-3.5' /> Cover Image
											</span>
										</label>
										<div className='flex gap-2 mb-3'>
											<input
												value={coverUrl}
												onChange={(e) => {
													setCoverUrl(e.target.value);
													setPreviewType('image');
												}}
												placeholder='Image URL or upload'
												className='flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none'
											/>
											<label className='bg-foreground text-background px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer hover:opacity-90 transition'>
												<Upload className='w-3.5 h-3.5' /> Upload
												<input
													type='file'
													accept='image/*'
													className='hidden'
													onChange={handleImageUpload}
												/>
											</label>
										</div>
										{coverUrl && (
											<motion.div
												initial={{ opacity: 0, y: 8 }}
												animate={{ opacity: 1, y: 0 }}
												className='mt-3 rounded-xl overflow-hidden border border-border aspect-video bg-secondary flex items-center justify-center'>
												<img
													src={coverUrl}
													alt='Cover preview'
													className='w-full h-full object-cover'
													onError={(e) => {
														(e.target as HTMLImageElement).style.display =
															'none';
													}}
												/>
											</motion.div>
										)}
									</div>

									<div>
										<label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
											<span className='flex items-center gap-2'>
												<Video className='w-3.5 h-3.5' /> Intro Video URL
											</span>
										</label>
										<input
											value={videoUrl}
											onChange={(e) => {
												setVideoUrl(e.target.value);
												setPreviewType('video');
											}}
											placeholder='https://youtube.com/watch?v=... or https://vimeo.com/...'
											className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 transition'
										/>
										{videoUrl && (
											<motion.div
												initial={{ opacity: 0, y: 8 }}
												animate={{ opacity: 1, y: 0 }}
												className='mt-3 p-4 bg-secondary/50 rounded-xl border border-border flex items-center gap-3'>
												<div className='w-10 h-10 bg-foreground rounded-full flex items-center justify-center'>
													<Play className='w-4 h-4 text-background fill-background' />
												</div>
												<div>
													<p className='text-sm font-semibold text-foreground'>
														Video linked
													</p>
													<p className='text-xs text-muted-foreground truncate max-w-xs'>
														{videoUrl}
													</p>
												</div>
											</motion.div>
										)}
									</div>

									<div className='bg-secondary/30 rounded-xl p-4 border border-border/50'>
										<p className='text-xs text-muted-foreground leading-relaxed'>
											💡 <strong>Tip:</strong> Use Google Drive, Imgur, or any
											public image URL for the cover. For videos, YouTube or
											Vimeo links work best.
										</p>
									</div>
								</motion.div>
							)}

							{/* ── Step 3: Modules ── */}
							{step === 'modules' && (
								<motion.div
									key='modules'
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.25 }}
									className='space-y-4'>
									<div className='flex items-center justify-between mb-2'>
										<p className='text-sm text-muted-foreground'>
											Add your course curriculum modules
										</p>
										<button
											type='button'
											onClick={addModule}
											className='flex items-center gap-1.5 text-xs font-semibold text-foreground bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition cursor-pointer'>
											<Plus className='w-3.5 h-3.5' /> Add Module
										</button>
									</div>

									<div className='space-y-3 max-h-[360px] overflow-y-auto pr-1'>
										<AnimatePresence>
											{modules.map((mod, i) => (
												<motion.div
													key={i}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, height: 0 }}
													transition={{ duration: 0.2 }}
													className='bg-secondary/40 border border-border rounded-xl p-4 group'>
													<div className='flex items-start justify-between gap-2 mb-3'>
														<div className='flex items-center gap-2'>
															<div className='w-6 h-6 bg-foreground rounded-full flex items-center justify-center text-background text-xs font-bold flex-shrink-0'>
																{i + 1}
															</div>
															<span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
																Module {i + 1}
															</span>
														</div>
														{modules.length > 1 && (
															<button
																type='button'
																onClick={() => removeModule(i)}
																className='opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition cursor-pointer'>
																<Trash2 className='w-4 h-4' />
															</button>
														)}
													</div>
													<div className='space-y-2'>
														<input
															value={mod.title}
															onChange={(e) =>
																updateModule(i, 'title', e.target.value)
															}
															placeholder='Module title (e.g. Introduction to Drug Interactions)'
															className='w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20'
														/>
														<input
															value={mod.description}
															onChange={(e) =>
																updateModule(i, 'description', e.target.value)
															}
															placeholder="Brief description of what's covered"
															className='w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20'
														/>
														<input
															value={mod.duration}
															onChange={(e) =>
																updateModule(i, 'duration', e.target.value)
															}
															placeholder='Duration (e.g. 2 hours)'
															className='w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20'
														/>
													</div>
												</motion.div>
											))}
										</AnimatePresence>
									</div>

									<div className='bg-secondary/30 rounded-xl p-4 border border-border/50 flex items-center gap-3'>
										<BookOpen className='w-5 h-5 text-muted-foreground flex-shrink-0' />
										<p className='text-xs text-muted-foreground'>
											You have{' '}
											<strong className='text-foreground'>
												{modules.filter((m) => m.title).length}
											</strong>{' '}
											module(s) added. Students will see this as your course
											curriculum.
										</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Navigation */}
						<div className='flex gap-3 mt-8 pt-5 border-t border-border'>
							{step !== 'info' && (
								<button
									type='button'
									onClick={prevStep}
									className='flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-secondary transition cursor-pointer'>
									<ChevronLeft className='w-4 h-4' /> Back
								</button>
							)}
							{step !== 'modules' ? (
								<button
									type='button'
									onClick={nextStep}
									disabled={step === 'info' && !isStep1Valid}
									className='flex-1 flex items-center justify-center gap-2 bg-foreground text-background font-semibold py-3 rounded-xl text-sm cursor-pointer hover:opacity-90 disabled:opacity-40 transition'>
									Continue <ChevronRight className='w-4 h-4' />
								</button>
							) : (
								<button
									type='button'
									onClick={handleSubmit}
									disabled={loading}
									className='flex-1 flex items-center justify-center gap-2 bg-foreground text-background font-semibold py-3 rounded-xl text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 transition'>
									{loading ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin' /> Publishing...
										</>
									) : (
										<>
											Publish Course <ArrowRight className='w-4 h-4' />
										</>
									)}
								</button>
							)}
						</div>
					</>
				)}
			</motion.div>
		</motion.div>
	);
}

/* ───────── Enroll Modal ─────────────────────────────────────────── */
interface EnrollModalProps {
	course: any;
	onClose: () => void;
}

function EnrollModal({ course, onClose }: EnrollModalProps) {
	const { user } = useAuth();
	const [name, setName] = useState(
		user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
	);
	const [email, setEmail] = useState(user?.email || '');
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);

	const handleEnroll = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			// @ts-ignore
			const { data: existing, error: checkError } = await (supabase as any)
				.from('course_enrollments')
				.select('id')
				.eq('course_id', course.id)
				.eq('user_id', user.id)
				.single();

			if (existing) {
				alert('You are already enrolled in this course.');
				setLoading(false);
				return;
			}

			// @ts-ignore
			const { error: enrollError } = await (supabase as any)
				.from('course_enrollments')
				.insert({
					course_id: course.id,
					user_id: user.id,
					full_name: name,
					email: email,
				});
			if (enrollError) throw enrollError;
			setDone(true);
		} catch (err: any) {
			alert(err.message || 'Enrollment failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
			onClick={onClose}>
			<motion.div
				initial={{ opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.96 }}
				className='bg-card border border-border rounded-2xl p-8 max-w-md w-full relative shadow-2xl'
				onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					className='absolute top-5 right-5 p-1.5 rounded-full hover:bg-secondary cursor-pointer transition-colors'>
					<X className='w-5 h-5 text-muted-foreground' />
				</button>

				{done ? (
					<div className='text-center py-6'>
						<div className='w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
							<CheckCircle className='w-8 h-8 text-green-500' />
						</div>
						<h3 className='font-playfair text-2xl text-foreground mb-1'>
							Enrolled!
						</h3>
						<p className='text-muted-foreground text-sm'>{course.title}</p>
						<button
							onClick={onClose}
							className='mt-5 bg-foreground text-background px-8 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity'>
							Start Learning →
						</button>
					</div>
				) : (
					<>
						{/* Course preview */}
						{course.cover_url && (
							<div className='rounded-xl overflow-hidden aspect-video mb-5 bg-secondary'>
								<img
									src={course.cover_url}
									alt={course.title}
									className='w-full h-full object-cover'
								/>
							</div>
						)}
						<div className='flex items-center gap-3 mb-5'>
							<div className='w-12 h-12 bg-accent-red/10 rounded-xl flex items-center justify-center'>
								<BookOpen className='w-6 h-6 text-accent-red' />
							</div>
							<div>
								<h2 className='font-playfair text-xl text-foreground leading-snug'>
									{course.title}
								</h2>
								<div className='flex gap-2 mt-1 mb-1'>
									{course.level && (
										<span
											className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${LEVEL_BADGE[course.level] || 'bg-secondary text-muted-foreground'}`}>
											{course.level}
										</span>
									)}
									{course.faculty && (
										<span className='text-xs text-muted-foreground'>
											{course.faculty}
										</span>
									)}
								</div>
								{course.instructor && (
									<div className='text-xs'>
										{course.user_id ? (
											<a
												href={`/researcher/${course.user_id}`}
												className='font-semibold text-accent-blue hover:underline'>
												By {course.instructor}
											</a>
										) : (
											<span className='font-semibold text-muted-foreground'>
												By {course.instructor}
											</span>
										)}
									</div>
								)}
							</div>
						</div>
						{/* Module count */}
						{course.modules?.length > 0 && (
							<div className='flex items-center gap-2 text-xs text-muted-foreground mb-5 bg-secondary/50 rounded-xl px-3 py-2'>
								<List className='w-4 h-4' /> {course.modules.length} modules ·{' '}
								{course.duration || 'Self-paced'}
							</div>
						)}
						<div className='h-px bg-border mb-5' />
						<form
							onSubmit={handleEnroll}
							className='space-y-3'>
							<input
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Full Name'
								className='w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20'
							/>
							<input
								required
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='University Email'
								className='w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20'
							/>
							<button
								type='submit'
								disabled={loading}
								className='w-full bg-foreground text-background font-semibold py-3.5 rounded-xl text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2'>
								{loading ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' /> Enrolling...
									</>
								) : (
									'Enroll — Free →'
								)}
							</button>
						</form>

						<div className='mt-6'>
							<Reactions
								itemId={course.id}
								itemType='project'
								initialLikes={course.likes_count || 0}
								initialComments={course.comments_count || 0}
							/>
						</div>
					</>
				)}
			</motion.div>
		</motion.div>
	);
}

/* ───────── Main Courses Component ───────────────────────────────── */
export function Courses() {
	const [courses, setCourses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [enrollTarget, setEnrollTarget] = useState<any | null>(null);
	const [showAdd, setShowAdd] = useState(false);
	const [filter, setFilter] = useState('All');

	const filters = [
		'All',
		'Beginner',
		'Intermediate',
		'Advanced',
		'Business',
		'Physical Therapy',
		'Dentistry',
		'Pharmacy',
	];

	useEffect(() => {
		fetchCourses();
	}, []);

	// 🔴 Real-time: new courses appear instantly for all users
	useRealtimeTable('courses', fetchCourses);

	async function fetchCourses() {
		setLoading(true);
		try {
			// @ts-ignore
			const { data, error } = await supabase
				.from('courses')
				.select(`*, profiles(display_name, avatar_url)`)
				.order('created_at', { ascending: false });

			if (error) throw error;
			setCourses(data || []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	const filtered = courses.filter((c: any) =>
		filter === 'All'
			? true
			: ['Beginner', 'Intermediate', 'Advanced'].includes(filter)
				? c.level === filter
				: c.faculty === filter || c.faculty === 'All Faculties',
	);

	const featured = courses.find((c: any) => c.featured);
	const rest = filtered.filter((c: any) => !c.featured);

	return (
		<section
			id='courses-section'
			className='harvard-section bg-background'>
			<div className='max-w-7xl mx-auto px-6 lg:px-12'>
				{/* Harvard-style intro */}
				<div className='harvard-section-intro'>
					<div>
						<p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3'>
							Online Learning
						</p>
						<h2 className='harvard-heading'>Courses & Academics</h2>
						<div className='flex items-center gap-4 mt-8'>
							<motion.button
								onClick={() => setShowAdd(true)}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								className='inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-xl shadow-black/5'>
								<Plus className='w-4 h-4' /> Add a Course
							</motion.button>
							<button className='harvard-arrow-btn'>
								<span className='harvard-arrow-circle'>
									<ArrowRight className='w-4 h-4' />
								</span>
								Browse all
							</button>
						</div>
					</div>
					<div className='flex flex-col justify-end gap-6 h-full'>
						<p className='text-muted-foreground leading-relaxed text-lg italic max-w-xl'>
							Faculty-curated courses from Deraya's four colleges — explore,
							enroll, and earn academic recognition at your own pace.
						</p>
						{/* Filters */}
						<div className='pt-2'>
							<FilterDropdown
								options={filters}
								activeOption={filter}
								onSelect={setFilter}
								label='Filter Courses'
								colorClass='accent-red'
							/>
						</div>
					</div>
				</div>

				{/* Loading */}
				{loading && (
					<div className='flex items-center justify-center py-24'>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
							className='w-8 h-8 rounded-full border-2 border-foreground border-t-transparent'
						/>
						<span className='ml-3 text-muted-foreground text-sm'>
							Loading courses...
						</span>
					</div>
				)}

				{/* Featured + list — Harvard layout */}
				{!loading && featured && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='harvard-featured-grid mb-14'>
						{/* Left: featured */}
						<div className='pr-0 lg:pr-10 border-r-0 lg:border-r border-border'>
							<motion.div
								whileHover={{ y: -3 }}
								transition={{ duration: 0.2 }}
								className='relative bg-gradient-to-br from-secondary to-card rounded-2xl overflow-hidden cursor-pointer group'
								onClick={() => setEnrollTarget(featured)}>
								{featured.cover_url ? (
									<div className='aspect-[4/3] overflow-hidden'>
										<img
											src={featured.cover_url}
											alt={featured.title}
											className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
										/>
										<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
									</div>
								) : (
									<div className='aspect-[4/3] flex items-center justify-center text-[100px] opacity-20 select-none'>
										{featured.image_url}
									</div>
								)}
								<div
									className={`${featured.cover_url ? 'absolute bottom-0 left-0 right-0 p-8' : 'p-8'}`}>
									<div className='flex flex-wrap gap-2 mb-3'>
										<span
											className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${LEVEL_BADGE[featured.level] || 'bg-secondary text-foreground'} ${featured.cover_url ? 'bg-white/20 text-white' : ''}`}>
											{featured.level || 'Featured'}
										</span>
										<span
											className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${featured.cover_url ? 'bg-white/10 text-white/80' : 'bg-secondary/80 text-foreground'}`}>
											{featured.faculty}
										</span>
									</div>
									<h3
										className={`font-playfair text-2xl lg:text-3xl mb-2 leading-tight ${featured.cover_url ? 'text-white' : 'text-foreground'}`}>
										{featured.title}
									</h3>
									{!featured.cover_url && (
										<p className='text-muted-foreground text-sm line-clamp-2 mb-4'>
											{featured.description}
										</p>
									)}
									<div
										className={`flex flex-wrap gap-4 text-xs mb-5 ${featured.cover_url ? 'text-white/70' : 'text-muted-foreground'}`}>
										{featured.duration && (
											<span className='flex items-center gap-1.5'>
												<Clock className='w-3.5 h-3.5' />
												{featured.duration}
											</span>
										)}
										{featured.modules?.length > 0 && (
											<span className='flex items-center gap-1.5'>
												<BookOpen className='w-3.5 h-3.5' />
												{featured.modules.length} Modules
											</span>
										)}
										<span className='flex items-center gap-1.5'>
											<Users className='w-3.5 h-3.5' />
											2.4k Enrolled
										</span>
									</div>
									<button
										className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${featured.cover_url ? 'text-white' : 'text-foreground'}`}>
										<span
											className={`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center group-hover:scale-110 transition-transform ${featured.cover_url ? 'border-white' : 'border-foreground'}`}>
											<ArrowRight className='w-4 h-4' />
										</span>
										Enroll now — Free
									</button>
								</div>
							</motion.div>
						</div>

						{/* Right: list */}
						<div className='pl-0 lg:pl-10 mt-8 lg:mt-0'>
							<p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4'>
								More Courses
							</p>
							{rest.slice(0, 6).map((course: any) => (
								<motion.div
									key={course.id}
									whileHover={{ x: 3 }}
									className='harvard-list-item group'
									onClick={() => setEnrollTarget(course)}>
									<div className='flex items-start gap-3'>
										<div className='w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
											<BookOpen className='w-4 h-4 text-accent-red' />
										</div>
										<div>
											<h4 className='font-medium text-foreground text-sm leading-snug group-hover:underline'>
												{course.title}
											</h4>
											<p className='text-xs text-muted-foreground mt-0.5'>
												{course.faculty} · {course.level}
											</p>
										</div>
									</div>
									<ArrowRight className='w-4 h-4 text-muted-foreground flex-shrink-0' />
								</motion.div>
							))}
							{rest.length === 0 && (
								<div className='text-center py-10 text-muted-foreground text-sm'>
									No other courses yet.{' '}
									<button
										onClick={() => setShowAdd(true)}
										className='underline cursor-pointer'>
										Add one!
									</button>
								</div>
							)}
						</div>
					</motion.div>
				)}

				{/* Empty state */}
				{!loading && courses.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-center py-24 border border-dashed border-border rounded-2xl bg-secondary/10 card-3d'>
						<div className='w-20 h-20 bg-accent-red/10 rounded-full flex items-center justify-center mx-auto mb-4'>
							<BookOpen className='w-10 h-10 text-accent-red' />
						</div>
						<h3 className='font-playfair text-2xl text-foreground mb-3'>
							No courses yet
						</h3>
						<p className='text-muted-foreground mb-6 text-sm'>
							Be the first to share academic knowledge with the Deraya
							community.
						</p>
						<motion.button
							onClick={() => setShowAdd(true)}
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.96 }}
							className='inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity'>
							<Plus className='w-4 h-4' /> Add the First Course
						</motion.button>
					</motion.div>
				)}

				{/* Grid when no featured */}
				{!loading && !featured && filtered.length > 0 && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filtered.map((course: any, i: number) => (
							<motion.div
								key={course.id}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.05 }}
								whileHover={{ y: -10, rotateX: 2 }}
								className='harvard-card pt-5 group cursor-pointer card-3d'
								onClick={() => setEnrollTarget(course)}>
								{course.cover_url && (
									<div className='rounded-xl overflow-hidden aspect-video mb-4 bg-secondary'>
										<img
											src={course.cover_url}
											alt={course.title}
											className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
										/>
									</div>
								)}
								<div className='flex items-start justify-between mb-3'>
									<div className='w-10 h-10 bg-accent-red/10 rounded-xl flex items-center justify-center'>
										<BookOpen className='w-5 h-5 text-accent-red' />
									</div>
									<span
										className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${LEVEL_BADGE[course.level] || 'bg-secondary text-muted-foreground'}`}>
										{course.level}
									</span>
								</div>
								<h3 className='font-playfair text-xl text-foreground mb-2 leading-snug group-hover:underline'>
									{course.title}
								</h3>
								<p className='text-muted-foreground text-sm line-clamp-2 mb-3'>
									{course.description}
								</p>
								<p className='text-xs text-muted-foreground mb-4'>
									{course.faculty}
								</p>
								<button
									className='harvard-arrow-btn'
									onClick={(e) => {
										e.stopPropagation();
										setEnrollTarget(course);
									}}>
									<span className='harvard-arrow-circle'>
										<ArrowRight className='w-3.5 h-3.5' />
									</span>
									Enroll — Free
								</button>
							</motion.div>
						))}
					</div>
				)}

				{/* Bottom grid when featured + more */}
				{!loading && featured && rest.length > 6 && (
					<>
						<div className='harvard-divider' />
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{rest.slice(6).map((course: any, i: number) => (
								<motion.div
									key={course.id}
									initial={{ opacity: 0, y: 16 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.05 }}
									whileHover={{ y: -4 }}
									className='harvard-card pt-5 group cursor-pointer'
									onClick={() => setEnrollTarget(course)}>
									<div className='flex items-start justify-between mb-3'>
										<span className='text-3xl'>{course.image_url || '📚'}</span>
										<span
											className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${LEVEL_BADGE[course.level] || 'bg-secondary text-muted-foreground'}`}>
											{course.level}
										</span>
									</div>
									<h3 className='font-playfair text-xl text-foreground mb-2 leading-snug group-hover:underline'>
										{course.title}
									</h3>
									<p className='text-muted-foreground text-sm line-clamp-2 mb-3'>
										{course.description}
									</p>
									<button
										className='harvard-arrow-btn'
										onClick={(e) => {
											e.stopPropagation();
											setEnrollTarget(course);
										}}>
										<span className='harvard-arrow-circle'>
											<ArrowRight className='w-3.5 h-3.5' />
										</span>
										Enroll — Free
									</button>
								</motion.div>
							))}
						</div>
					</>
				)}
			</div>

			<AnimatePresence>
				{showAdd && (
					<AddCourseModal
						onClose={() => setShowAdd(false)}
						onAdded={(c) => {
							setCourses((prev) => [c, ...prev]);
							setShowAdd(false);
						}}
					/>
				)}
				{enrollTarget && (
					<EnrollModal
						course={enrollTarget}
						onClose={() => setEnrollTarget(null)}
					/>
				)}
			</AnimatePresence>
		</section>
	);
}
