-- Table to store last 1000 publications to avoid duplicates
CREATE TABLE public.publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL,
  platform TEXT NOT NULL, -- e.g. 'telegram', 'youtube'
  content_id TEXT NOT NULL, -- unique id of the content (e.g. message id, video id)
  content_url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index to quickly find duplicates
CREATE UNIQUE INDEX publications_unique_content ON public.publications(platform, content_id);

-- Enable RLS
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Policies for publications
CREATE POLICY publications_select_policy ON public.publications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY publications_insert_policy ON public.publications
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY publications_delete_policy ON public.publications
  FOR DELETE TO authenticated USING (true);

CREATE POLICY publications_update_policy ON public.publications
  FOR UPDATE TO authenticated USING (true);

-- Table to store Telegram channels
CREATE TABLE public.telegram_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  channel_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.telegram_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY telegram_channels_select_policy ON public.telegram_channels
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY telegram_channels_insert_policy ON public.telegram_channels
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY telegram_channels_update_policy ON public.telegram_channels
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY telegram_channels_delete_policy ON public.telegram_channels
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Table to store YouTube channels with OAuth tokens
CREATE TABLE public.youtube_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY youtube_channels_select_policy ON public.youtube_channels
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY youtube_channels_insert_policy ON public.youtube_channels
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY youtube_channels_update_policy ON public.youtube_channels
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY youtube_channels_delete_policy ON public.youtube_channels
  FOR DELETE TO authenticated USING (auth.uid() = user_id);