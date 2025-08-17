import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TelegramChannel {
  id: string;
  channel_username: string;
  channel_title: string;
}

const fetchTelegramChannels = async (): Promise<TelegramChannel[]> => {
  const { data, error } = await supabase
    .from('telegram_channels')
    .select('id, channel_username, channel_title')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const TelegramChannels = () => {
  const [channelInput, setChannelInput] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: channels = [], isLoading: isLoadingChannels } = useQuery({
    queryKey: ['telegramChannels'],
    queryFn: fetchTelegramChannels,
  });

  const addChannelMutation = useMutation({
    mutationFn: async (rawInput: string) => {
      const { data, error } = await supabase
        .from('telegram_channels')
        .insert({
          channel_username: rawInput,
          channel_title: rawInput,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error("Такая запись уже существует.");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegramChannels'] });
      toast({
        title: "Канал добавлен",
        description: "Канал успешно добавлен в ваш список.",
      });
      setChannelInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка добавления",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteChannelMutation = useMutation({
    mutationFn: async (channelId: string) => {
      const { error } = await supabase.from('telegram_channels').delete().eq('id', channelId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegramChannels'] });
      toast({
        title: "Канал удален",
        description: "Канал успешно удален из списка.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddChannel = async () => {
    if (!channelInput.trim()) {
      toast({
        title: "Ошибка",
        description: "Поле не может быть пустым.",
        variant: "destructive",
      });
      return;
    }
    addChannelMutation.mutate(channelInput);
  };

  const isLoading = addChannelMutation.isPending || deleteChannelMutation.isPending;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Каналы Telegram</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Добавить канал</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-url">Ссылка на канал или @username</Label>
            <div className="flex gap-2">
              <Input
                id="channel-url"
                placeholder="Введите любой текст..."
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChannel()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleAddChannel} 
                disabled={isLoading}
                className="flex items-center gap-2 w-32"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Добавить
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Введите любой текст. Он будет сохранен как есть.
            </p>
          </div>
        </CardContent>
      </Card>

      {isLoadingChannels ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : channels.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{channel.channel_title}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {channel.channel_username}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex justify-end mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteChannelMutation.mutate(channel.id)}
                  disabled={deleteChannelMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Send className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет добавленных каналов</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Добавьте Telegram каналы для мониторинга контента
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TelegramChannels;