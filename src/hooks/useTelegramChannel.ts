import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface TelegramChannelInfo {
  username: string;
  title: string;
  description: string | null;
  photoUrl?: string | null;
}

export const useTelegramChannel = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchChannelInfo = async (url: string): Promise<TelegramChannelInfo | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('telegram-channel-info', {
        body: { url },
      });

      if (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось связаться с сервером для проверки канала.",
          variant: "destructive",
        });
        console.error('Invoke error:', error);
        return null;
      }

      if (data.error) {
        toast({
          title: "Ошибка проверки канала",
          description: data.error,
          variant: "destructive",
        });
        return null;
      }

      return {
        username: data.username,
        title: data.title,
        description: data.description,
        photoUrl: data.image,
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchChannelInfo, loading };
};