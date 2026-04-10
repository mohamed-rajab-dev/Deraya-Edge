import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { API_URL } from '@/services/api';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${API_URL}/chat`;

export function DonChatbot() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Msg[]>([
		{
			role: 'assistant',
			content:
				"Hi! I'm **Don**, your research assistant.\n\nHow can I help you today?",
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		if (isOpen) inputRef.current?.focus();
	}, [isOpen]);

	const send = async () => {
		const text = input.trim();
		if (!text || isLoading) return;

		const userMsg: Msg = { role: 'user', content: text };
		setInput('');
		setMessages((prev) => [...prev, userMsg]);
		setIsLoading(true);

		try {
			const resp = await fetch(CHAT_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ messages: [...messages, userMsg] }),
			});

			if (!resp.ok) {
				setMessages((prev) => [
					...prev,
					{
						role: 'assistant',
						content: `[Error] Failed to get response from Don.`,
					},
				]);
				setIsLoading(false);
				return;
			}

			const data = await resp.json();

			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content: data.reply },
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content:
						'[Error] Connection error. Please make sure the backend is running.',
				},
			]);
		}
		setIsLoading(false);
	};

	return (
		<>
			{/* FAB */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`fixed bottom-6 left-6 z-[150] w-14 h-14 rounded-full flex items-center justify-center elevated-shadow transition-all duration-300 cursor-pointer ${
					isOpen
						? 'bg-foreground text-background rotate-0'
						: 'bg-destructive text-destructive-foreground hover:scale-110'
				}`}>
				{isOpen ? <X className='w-5 h-5' /> : <Bot className='w-6 h-6' />}
			</button>

			{/* Chat Window */}
			{isOpen && (
				<div className='fixed bottom-24 left-6 z-[150] w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[70vh] bg-background clean-border rounded-2xl elevated-shadow flex flex-col overflow-hidden'>
					{/* Header */}
					<div className='bg-destructive text-destructive-foreground px-5 py-4 flex items-center gap-3 flex-shrink-0'>
						<div className='w-9 h-9 rounded-full bg-white/20 flex items-center justify-center'>
							<Bot className='w-5 h-5' />
						</div>
						<div>
							<h3 className='font-bold text-sm'>Don</h3>
							<p className='text-[11px] opacity-80'>Research Assistant</p>
						</div>
					</div>

					{/* Messages */}
					<div className='flex-1 overflow-y-auto p-4 space-y-3'>
						{messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div
									className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
										msg.role === 'user'
											? 'bg-destructive text-destructive-foreground rounded-br-md'
											: 'bg-card clean-border text-foreground rounded-bl-md'
									}`}>
									{msg.role === 'assistant' ? (
										<div className='prose prose-sm max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1 [&>p+p]:mt-2'>
											<ReactMarkdown>{msg.content}</ReactMarkdown>
										</div>
									) : (
										<p>{msg.content}</p>
									)}
								</div>
							</div>
						))}
						{isLoading && messages[messages.length - 1]?.role === 'user' && (
							<div className='flex justify-start'>
								<div className='bg-card clean-border rounded-2xl rounded-bl-md px-4 py-3'>
									<div className='flex gap-1'>
										<span
											className='w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce'
											style={{ animationDelay: '0ms' }}
										/>
										<span
											className='w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce'
											style={{ animationDelay: '150ms' }}
										/>
										<span
											className='w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce'
											style={{ animationDelay: '300ms' }}
										/>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input */}
					<div className='p-3 border-t border-border flex-shrink-0'>
						<div className='flex gap-2'>
							<input
								ref={inputRef}
								type='text'
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
								placeholder='Ask Don anything...'
								className='flex-1 bg-input clean-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/30'
								disabled={isLoading}
							/>
							<button
								onClick={send}
								disabled={isLoading || !input.trim()}
								className='bg-destructive text-destructive-foreground p-2.5 rounded-xl hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-40'>
								<Send className='w-4 h-4' />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
