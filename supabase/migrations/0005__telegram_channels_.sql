-- Удаляем лишнюю колонку, чтобы осталась только одна для текста
ALTER TABLE public.telegram_channels DROP COLUMN IF EXISTS channel_username;