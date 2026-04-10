'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Heart,
	MessageCircle,
	Share2,
	Image as ImageIcon,
	X,
	ThumbsUp,
	Send,
	Loader2,
	MoreHorizontal,
	Bookmark,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { apiUpload } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';

const FACULTIES = ['Business', 'Physical Therapy', 'Dentistry', 'Pharmacy'];
const FILTERS = ['All', ...FACULTIES];

/* ─── Static demo posts ──────────────────────────────────────── */
const STATIC_POSTS: any[] = [];

function timeAgo(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);
	if (hours < 1) return 'Just now';
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
}

function initials(name: string) {
	return name
		.split(' ')
		.map((w) => w[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

/* ─── Avatar ─────────────────────────────────────────────────── */
function Avatar({
	name,
	url,
	size = 10,
}: {
	name: string;
	url?: string | null;
	size?: number;
}) {
	const bg = [
		'bg-accent-red',
		'bg-accent-blue',
		'bg-accent-emerald',
		'bg-accent-purple',
	];
	const color = bg[name.charCodeAt(0) % bg.length];
	return (
		<div
			className={`w-${size} h-${size} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${color} text-white font-semibold text-sm`}>
			{url ? (
				<img
					src={url}
					alt={name}
					className='w-full h-full object-cover'
				/>
			) : (
				initials(name)
			)}
		</div>
	);
}

function PostCard({ post }: { post: any }) {
	const { user } = useAuth();
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(post.likes_count || 0);
	const [showComments, setShowComments] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const name =
		post.profiles?.display_name || post.User?.display_name || 'Researcher';
	const avatarUrl = post.profiles?.avatar_url || post.User?.avatar_url;

	const handleDelete = async () => {
		if (!window.confirm('Are you sure you want to delete this post?')) return;
		setIsDeleting(true);
		const { error } = await supabase
			.from('community_posts')
			.delete()
			.eq('id', post.id);
		if (error) {
			alert('Failed to delete: ' + error.message);
			setIsDeleting(false);
		}
		// useRealtimeTable handle removal
	};

	const toggleLike = () => {
		setLiked((l) => !l);
		setLikes((l: number) => (liked ? l - 1 : l + 1));
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className='bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300'>
			{/* Header */}
			<div className='flex items-start justify-between p-5 pb-4'>
				<div className='flex items-start gap-3'>
					<Avatar
						name={name}
						url={avatarUrl}
						size={11}
					/>
					<div>
						<a
							href={`/researcher/${post.user_id}`}
							className='font-semibold text-foreground text-[15px] hover:text-accent-red transition-colors leading-tight block'>
							{name}
						</a>
						<div className='flex items-center gap-2 mt-0.5'>
							<span className='text-xs text-muted-foreground'>
								{post.faculty}
							</span>
							<span className='text-muted-foreground/40 text-xs'>·</span>
							<span className='text-xs text-muted-foreground'>
								{timeAgo(post.createdAt)}
							</span>
						</div>
					</div>
				</div>
				{user?.id === post.user_id && (
					<button
						onClick={handleDelete}
						disabled={isDeleting}
						className='p-1.5 rounded-full hover:bg-destructive/10 cursor-pointer text-muted-foreground hover:text-destructive transition-colors'>
						{isDeleting ? (
							<Loader2 className='w-4 h-4 animate-spin' />
						) : (
							<X className='w-4 h-4' />
						)}
					</button>
				)}
			</div>

			{/* Content */}
			<div className='px-5 pb-3'>
				<p className='text-foreground text-[15px] leading-relaxed whitespace-pre-line'>
					{post.content}
				</p>
			</div>

			{/* Image */}
			{post.image_url && (
				<div className='mt-2 overflow-hidden border-t border-border'>
					<img
						src={post.image_url}
						alt=''
						className='w-full object-cover max-h-[400px]'
					/>
				</div>
			)}

			{/* Stats */}
			{(likes > 0 || post.comments_count > 0) && (
				<div className='flex items-center justify-between px-5 py-2.5 text-xs text-muted-foreground border-b border-border'>
					{likes > 0 && (
						<div className='flex items-center gap-1.5'>
							<div className='w-4 h-4 rounded-full bg-accent-red flex items-center justify-center'>
								<ThumbsUp className='w-2.5 h-2.5 text-white fill-white' />
							</div>
							<span>{likes}</span>
						</div>
					)}
					{post.comments_count > 0 && (
						<button
							onClick={() => setShowComments((s) => !s)}
							className='hover:text-foreground hover:underline cursor-pointer transition-colors ml-auto'>
							{post.comments_count} comment
							{post.comments_count !== 1 ? 's' : ''}
						</button>
					)}
				</div>
			)}

			{/* Actions */}
			<div className='flex items-center px-2 py-1 gap-1 border-b border-border'>
				<button
					onClick={toggleLike}
					className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:bg-secondary ${liked ? 'text-accent-red' : 'text-muted-foreground'}`}>
					<ThumbsUp className={`w-4 h-4 ${liked ? 'fill-accent-red' : ''}`} />
					Like
				</button>
				<button
					onClick={() => setShowComments((s) => !s)}
					className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary cursor-pointer transition-all'>
					<MessageCircle className='w-4 h-4' />
					Comment
				</button>
				<button className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary cursor-pointer transition-all'>
					<Share2 className='w-4 h-4' />
					Share
				</button>
				<button className='hidden sm:flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary cursor-pointer transition-all'>
					<Bookmark className='w-4 h-4' />
					Save
				</button>
			</div>

			{/* Comments placeholder */}
			<AnimatePresence>
				{showComments && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className='px-5 py-3 bg-secondary/30'>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 rounded-full bg-secondary' />
							<div className='flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm text-muted-foreground cursor-text'>
								Write a comment...
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

/* ─── Main Community Component ───────────────────────────────── */
export function Community() {
	const { user } = useAuth();
	const [posts, setPosts] = useState<any[]>([]);
	const [showAuth, setShowAuth] = useState(false);
	const [filter, setFilter] = useState('All');
	const [content, setContent] = useState('');
	const [faculty, setFaculty] = useState('Business');
	const [imageUrl, setImageUrl] = useState('');
	const [uploading, setUploading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const imgRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchPosts();
	}, []);

	// 🔴 Real-time: re-fetch whenever anyone posts, edits, or deletes a community post
	useRealtimeTable('community_posts', fetchPosts);

	async function fetchPosts() {
		try {
			const { data, error } = await supabase
				.from('community_posts')
				.select(`*, profiles(display_name, avatar_url)`)
				.order('created_at', { ascending: false });
			if (error) {
				console.error('Fetch error:', error);
				setPosts([]);
			} else {
				setPosts(data || []);
			}
		} catch (e) {
			console.error(e);
			setPosts([]);
		}
	}

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !user) return;
		setUploading(true);
		try {
			const url = await apiUpload(file);
			if (url) setImageUrl(url);
		} catch (error) {
			console.error(error);
			alert('Failed to upload image');
		} finally {
			setUploading(false);
		}
	};

	const handlePost = async () => {
		if (!user || !content.trim()) return;
		setSubmitting(true);
		try {
			const { data, error } = await supabase
				.from('community_posts')
				.insert({
					user_id: user.id,
					content,
					faculty,
					image_url: imageUrl || null,
				})
				.select()
				.single();

			if (error) {
				alert(`Failed to publish: ${error.message}`);
				return;
			}

			// No need to manually update state, useRealtimeTable will catch it
			setContent('');
			setImageUrl('');
		} catch (e: any) {
			alert(`Error: ${e.message}`);
		} finally {
			setSubmitting(false);
		}
	};

	const filtered = posts.filter(
		(p) => filter === 'All' || p.faculty === filter,
	);

	const name =
		user?.user_metadata?.full_name ||
		user?.user_metadata?.name ||
		user?.email?.split('@')[0] ||
		'You';

	return (
		<section
			id='community-section'
			className='bg-secondary/30 dark:bg-secondary/10 min-h-screen py-10'>
			<div className='max-w-3xl mx-auto px-4'>
				{/* Section heading */}
				<div className='mb-6'>
					<p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2'>
						Collaborate
					</p>
					<h2 className='font-playfair text-5xl text-foreground mb-2'>
						Research Community
					</h2>
					<div className='h-px bg-border mt-4' />
				</div>

				{/* Filter tabs */}
				<div className='flex gap-2 flex-wrap mb-5'>
					{FILTERS.map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
								filter === f
									? 'bg-foreground text-background border-foreground'
									: 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
							}`}>
							{f}
						</button>
					))}
				</div>

				{/* Create post — LinkedIn style */}
				<div className='bg-card border border-border rounded-2xl p-5 mb-5 shadow-sm'>
					<div className='flex items-start gap-3'>
						{user ? (
							<Avatar
								name={name}
								url={user.user_metadata?.avatar_url}
								size={11}
							/>
						) : (
							<div className='w-11 h-11 rounded-full bg-secondary flex-shrink-0' />
						)}
						<button
							onClick={() => (!user ? setShowAuth(true) : undefined)}
							className='flex-1 text-left bg-secondary/60 hover:bg-secondary border border-border rounded-full px-5 py-3 text-muted-foreground text-sm font-medium cursor-pointer transition-colors'>
							{user
								? `What's on your mind, ${name.split(' ')[0]}?`
								: 'Sign in to share your thoughts...'}
						</button>
					</div>

					{/* Text area when user is signed in */}
					{user && (
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								className='mt-4 space-y-3'
								onClick={(e) => e.stopPropagation()}>
								<textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder='Share a research update, insight, or question...'
									rows={3}
									className='w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/15 transition'
								/>
								{imageUrl && (
									<div className='relative'>
										<img
											src={imageUrl}
											alt=''
											className='rounded-xl max-h-48 object-cover w-full'
										/>
										<button
											onClick={() => setImageUrl('')}
											className='absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 cursor-pointer'>
											<X className='w-3.5 h-3.5' />
										</button>
									</div>
								)}
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<input
											type='file'
											ref={imgRef}
											accept='image/*'
											onChange={handleImageUpload}
											className='hidden'
										/>
										<button
											onClick={() => imgRef.current?.click()}
											disabled={uploading}
											className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-semibold transition cursor-pointer'>
											<ImageIcon className='w-4 h-4' />
											{uploading ? 'Uploading...' : 'Photo'}
										</button>
										<select
											value={faculty}
											onChange={(e) => setFaculty(e.target.value)}
											className='bg-secondary border border-border rounded-lg px-3 py-2 text-muted-foreground text-xs font-semibold focus:outline-none cursor-pointer'>
											{FACULTIES.map((f) => (
												<option
													key={f}
													value={f}>
													{f}
												</option>
											))}
										</select>
									</div>
									<button
										onClick={handlePost}
										disabled={submitting || !content.trim()}
										className='flex items-center gap-2 bg-foreground text-background px-5 py-2 rounded-full text-xs font-semibold cursor-pointer hover:opacity-90 disabled:opacity-40 transition'>
										{submitting ? (
											<Loader2 className='w-3.5 h-3.5 animate-spin' />
										) : (
											<Send className='w-3.5 h-3.5' />
										)}
										Post
									</button>
								</div>
							</motion.div>
						</AnimatePresence>
					)}
				</div>

				{/* Posts feed */}
				{filtered.length === 0 ? (
					<div className='text-center py-20 text-muted-foreground'>
						No posts yet. Be the first to share something!
					</div>
				) : (
					<div className='space-y-4'>
						{filtered.map((post) => (
							<PostCard
								key={post.id}
								post={post}
							/>
						))}
					</div>
				)}
			</div>

			<AuthModal
				isOpen={showAuth}
				onClose={() => setShowAuth(false)}
			/>
		</section>
	);
}
