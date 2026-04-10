-- Persist event registrations and keep the event registered count in sync.

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE IF EXISTS public.event_registrations
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'event_registrations'
      AND policyname = 'Users can see their own event registrations'
  ) THEN
    CREATE POLICY "Users can see their own event registrations"
      ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'event_registrations'
      AND policyname = 'Users can register themselves for events'
  ) THEN
    CREATE POLICY "Users can register themselves for events"
      ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'event_registrations'
      AND policyname = 'Users can delete their own event registrations'
  ) THEN
    CREATE POLICY "Users can delete their own event registrations"
      ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.increment_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events
  SET registered = COALESCE(registered, 0) + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrement_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events
  SET registered = GREATEST(COALESCE(registered, 0) - 1, 0)
  WHERE id = OLD.event_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_event_registration_capacity()
RETURNS TRIGGER AS $$
DECLARE
  current_registered INTEGER;
  max_capacity INTEGER;
BEGIN
  SELECT COALESCE(registered, 0), COALESCE(capacity, 0)
  INTO current_registered, max_capacity
  FROM public.events
  WHERE id = NEW.event_id
  FOR UPDATE;

  IF max_capacity > 0 AND current_registered >= max_capacity THEN
    RAISE EXCEPTION 'Event is full';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS validate_event_registration_capacity ON public.event_registrations;
CREATE TRIGGER validate_event_registration_capacity
  BEFORE INSERT ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.check_event_registration_capacity();

DROP TRIGGER IF EXISTS on_event_registration_created ON public.event_registrations;
CREATE TRIGGER on_event_registration_created
  AFTER INSERT ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.increment_event_registration_count();

DROP TRIGGER IF EXISTS on_event_registration_deleted ON public.event_registrations;
CREATE TRIGGER on_event_registration_deleted
  AFTER DELETE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.decrement_event_registration_count();