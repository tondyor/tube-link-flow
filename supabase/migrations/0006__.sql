-- Полностью удаляем старую таблицу со всеми ее правилами и ограничениями
DROP TABLE IF EXISTS public.telegram_channels;

-- Создаем новую, максимально простую таблицу с одной колонкой 'name'
CREATE TABLE public.telegram_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Убедимся, что на новой таблице точно нет никаких правил безопасности
ALTER TABLE public.telegram_channels DISABLE ROW LEVEL SECURITY;