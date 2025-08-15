-- Create telegram_channels table
CREATE TABLE public.telegram_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_username TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  channel_description TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, channel_username)
);

-- Add comments to the table and columns
COMMENT ON TABLE public.telegram_channels IS 'Stores Telegram channels added by users as content sources.';
COMMENT ON COLUMN public.telegram_channels.user_id IS 'The user who added this channel.';
COMMENT ON COLUMN public.telegram_channels.channel_username IS 'The unique username of the Telegram channel (e.g., @durov).';
COMMENT ON COLUMN public.telegram_channels.channel_title IS 'The display title of the Telegram channel.';

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.telegram_channels ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation
CREATE POLICY "Users can see their own channels" ON public.telegram_channels
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own channels" ON public.telegram_channels
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own channels" ON public.telegram_channels
FOR DELETE TO authenticated USING (auth.uid() = user_id);