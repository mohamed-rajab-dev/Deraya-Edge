import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimationShowcase from "@/components/AnimationShowcase";
import GlassCard from "@/components/GlassCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-accent-purple/10 to-accent-emerald/20"></div>
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
          <h1 className="font-bagel text-6xl md:text-8xl text-shadow-strong">
            BAGEL FAT
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Демонстрация красивой дизайн-системы с анимациями и эффектами
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              className="glass-effect hover:glass-effect gentle-animation px-8 py-3"
              style={{ background: 'var(--accent-blue)', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Начать
            </Button>
            <Button 
              variant="outline"
              className="glass-effect hover:glass-effect gentle-animation px-8 py-3"
            >
              Узнать больше
            </Button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-accent-blue rounded-full float-gentle opacity-60"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-accent-emerald rounded-full drift-left opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-accent-purple rounded-full drift-right opacity-50"></div>
      </section>

      {/* Animation Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 font-bagel">
            Анимации и Эффекты
          </h2>
          <AnimationShowcase />
        </div>
      </section>

      {/* Glass Effects Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent-blue/5 via-accent-purple/5 to-accent-emerald/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 font-bagel">
            Стеклянные Эффекты
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard 
              title="Стекло"
              description="Основной стеклянный эффект с размытием и прозрачностью"
              className="glass-effect"
            />
            <GlassCard 
              title="Навигация"
              description="Усиленный эффект для навигационных элементов"
              className="glass-navbar"
            />
            <GlassCard 
              title="Свечение"
              description="Эффект с пульсирующим свечением"
              className="glass-effect pulse-glow"
            />
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold font-bagel">Типографика</h2>
          
          <div className="space-y-6">
            <h1 className="font-bagel text-shadow-medium">Заголовок H1 с Bagel Fat</h1>
            <h2>Заголовок H2 с системным шрифтом</h2>
            <h3>Заголовок H3 с улучшенной типографикой</h3>
            <p>
              Обычный текст с оптимизированными интервалами и читаемостью. 
              Система поддерживает адаптивные размеры и правильные пропорции.
            </p>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 font-bagel">
            Цветовая Палитра
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center subtle-shadow gentle-animation hover:elevated-shadow">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4"
                style={{ backgroundColor: 'var(--accent-blue)' }}
              ></div>
              <h3 className="text-xl font-semibold mb-2">Accent Blue</h3>
              <p className="text-muted-foreground">#2563eb</p>
            </Card>
            
            <Card className="p-8 text-center subtle-shadow gentle-animation hover:elevated-shadow">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4"
                style={{ backgroundColor: 'var(--accent-emerald)' }}
              ></div>
              <h3 className="text-xl font-semibold mb-2">Accent Emerald</h3>
              <p className="text-muted-foreground">#059669</p>
            </Card>
            
            <Card className="p-8 text-center subtle-shadow gentle-animation hover:elevated-shadow">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4"
                style={{ backgroundColor: 'var(--accent-purple)' }}
              ></div>
              <h3 className="text-xl font-semibold mb-2">Accent Purple</h3>
              <p className="text-muted-foreground">#7c3aed</p>
            </Card>
          </div>
        </div>
      {/* Developer Setup Section - Temporary */}
      <section className="py-12 bg-destructive/5 border-t border-destructive/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black text-foreground mb-4">Finalize Your Platform Setup</h2>
          <p className="text-muted-foreground mb-8">
            To prevent data from disappearing on refresh, you must run the database setup script in your Supabase project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://supabase.com/dashboard/project/_/sql" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-accent-blue text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-accent-blue/90 transition-all shadow-xl shadow-accent-blue/20"
            >
              1. Open SQL Editor
            </a>
            <Button 
              onClick={() => {
                const sql = `-- 1. Create Profiles table (This stores user details like name, avatar, bio)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  faculty TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Community Posts table
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

-- 3. Create Articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_url TEXT,
  faculty TEXT,
  read_time INTEGER DEFAULT 5,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Projects table
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

-- 5. Create Research Papers table
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

-- 6. Create Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  faculty TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Beginner',
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  type TEXT NOT NULL DEFAULT 'Online', -- Online, On-Campus, Hybrid
  faculty TEXT NOT NULL DEFAULT 'All Faculties',
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Create Course Enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'enrolled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 9. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- 10. Create Policies (Users can only delete/edit THEIR own data)

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- COMMUNITY POSTS
CREATE POLICY "Everyone can see posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- ARTICLES
CREATE POLICY "Everyone can see articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own articles" ON public.articles FOR DELETE USING (auth.uid() = user_id);

-- PROJECTS
CREATE POLICY "Everyone can see projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- EVENTS
CREATE POLICY "Everyone can see events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE USING (auth.uid() = user_id);

-- ENROLLMENTS
CREATE POLICY "Users can see their own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll themselves" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. AUTO-CREATE PROFILE ON SIGNUP (Important for persistent identity)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;
                navigator.clipboard.writeText(sql);
                alert("SQL Script copied to clipboard! Paste it into Supabase SQL Editor and click Run.");
              }}
              variant="outline"
              className="bg-card clean-border px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm"
            >
              2. Copy SQL Script
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;