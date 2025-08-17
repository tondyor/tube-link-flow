ALTER TABLE public.telegram_channels
DROP COLUMN IF EXISTS channel_description,
DROP COLUMN IF EXISTS photo_url;