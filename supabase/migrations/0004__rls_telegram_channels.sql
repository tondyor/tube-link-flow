-- Удаляем существующие политики безопасности
DROP POLICY IF EXISTS "Allow public read access" ON public.telegram_channels;
DROP POLICY IF EXISTS "Allow public insert access" ON public.telegram_channels;
DROP POLICY IF EXISTS "Allow public delete access" ON public.telegram_channels;

-- Полностью отключаем систему безопасности (RLS) для этой таблицы
ALTER TABLE public.telegram_channels DISABLE ROW LEVEL SECURITY;