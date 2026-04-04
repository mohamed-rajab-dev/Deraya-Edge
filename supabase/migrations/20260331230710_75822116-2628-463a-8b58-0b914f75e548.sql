
-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'research',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Function to notify all users when research is published
CREATE OR REPLACE FUNCTION public.notify_new_research()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_name TEXT;
  target_user RECORD;
BEGIN
  SELECT display_name INTO author_name FROM public.profiles WHERE user_id = NEW.user_id LIMIT 1;
  
  FOR target_user IN SELECT DISTINCT user_id FROM public.profiles WHERE user_id != NEW.user_id
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      target_user.user_id,
      'New Research Published',
      COALESCE(author_name, 'A researcher') || ' published: ' || NEW.title,
      'research',
      '/researcher/' || NEW.user_id
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_research_published
  AFTER INSERT ON public.research_papers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_research();

-- Storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Auth users can upload post images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post-images');
