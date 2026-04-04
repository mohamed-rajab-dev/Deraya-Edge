
-- Research papers table
CREATE TABLE IF NOT EXISTS public.research_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT,
  faculty TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  pages INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  faculty TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  faculty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ongoing',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Research papers policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Research papers are viewable by everyone' AND tablename = 'research_papers') THEN
    CREATE POLICY "Research papers are viewable by everyone" ON public.research_papers FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own research' AND tablename = 'research_papers') THEN
    CREATE POLICY "Users can insert their own research" ON public.research_papers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own research' AND tablename = 'research_papers') THEN
    CREATE POLICY "Users can update their own research" ON public.research_papers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own research' AND tablename = 'research_papers') THEN
    CREATE POLICY "Users can delete their own research" ON public.research_papers FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Community posts policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Community posts are viewable by everyone' AND tablename = 'community_posts') THEN
    CREATE POLICY "Community posts are viewable by everyone" ON public.community_posts FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own posts' AND tablename = 'community_posts') THEN
    CREATE POLICY "Users can insert their own posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own posts' AND tablename = 'community_posts') THEN
    CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own posts' AND tablename = 'community_posts') THEN
    CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Projects policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Projects are viewable by everyone' AND tablename = 'projects') THEN
    CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own projects' AND tablename = 'projects') THEN
    CREATE POLICY "Users can insert their own projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own projects' AND tablename = 'projects') THEN
    CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own projects' AND tablename = 'projects') THEN
    CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Updated at triggers
DROP TRIGGER IF EXISTS update_research_papers_updated_at ON public.research_papers;
CREATE TRIGGER update_research_papers_updated_at BEFORE UPDATE ON public.research_papers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for research PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('research-files', 'research-files', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view research files" ON storage.objects FOR SELECT TO public USING (bucket_id = 'research-files');
CREATE POLICY "Authenticated users can upload research files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'research-files');
CREATE POLICY "Users can delete their own research files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'research-files' AND (storage.foldername(name))[1] = auth.uid()::text);
