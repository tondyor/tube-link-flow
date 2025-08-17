-- Drop existing policies that depend on user_id
DROP POLICY IF EXISTS "Users can see their own channels" ON public.telegram_channels;
DROP POLICY IF EXISTS "Users can insert their own channels" ON public.telegram_channels;
DROP POLICY IF EXISTS "Users can delete their own channels" ON public.telegram_channels;

-- Drop the user_id column as it's no longer needed for a single-user app
ALTER TABLE public.telegram_channels DROP COLUMN IF EXISTS user_id;

-- Create new policies that allow access for any client (anonymous role)
-- This is suitable for a single-user application without a login system.
CREATE POLICY "Allow public read access" ON public.telegram_channels
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public insert access" ON public.telegram_channels
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON public.telegram_channels
FOR DELETE TO anon USING (true);