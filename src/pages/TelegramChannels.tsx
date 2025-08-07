import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChannelList from "@/components/ChannelList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TelegramChannel {
  id: string;
  channel_name: string;
  channel_url: string;
}

const TelegramChannels = () => {
  const [channels, setChannels] = useState<TelegramChannel[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const { toast } = useToast();

  const fetchChannels = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    const { data, error } = await supabase
      .from("telegram_channels")
      .select("id, channel_name, channel_url")
      .eq("user_id", user.id);
    if (error) {
      toast({
        title: "Ошибка загрузки каналов",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setChannels(data || []);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleAdd = async () => {
    const trimmedUrl = newUrl.trim();
    if (!trimmedUrl) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Пользователь не аутентифицирован",
        variant: "destructive",
      });
      return;
    }

    // Сохраняем полный URL как channel_url, channel_name можно оставить пустым или равным URL
    const channelName = trimmedUrl; // или "" если не нужно

    const { error } = await supabase.from("telegram_channels").insert([
      {
        user_id: user.id,
        channel_name: channelName,
        channel_url: trimmedUrl,
      },
    ]);
    if (error) {
      toast({
        title: "Ошибка добавления канала",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Канал добавлен",
        description: `Ссылка ${trimmedUrl} успешно добавлена.`,
      });
      setNewUrl("");
      fetchChannels();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("telegram_channels").delete().eq("id", id);
    if (error) {
      toast({
        title: "Ошибка удаления канала",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Канал удален",
      });
      fetchChannels();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Каналы Telegram</h1>
      <Card>
        <CardHeader>
          <CardTitle>Добавить новый канал</CardTitle>
          <CardDescription>Введите публичный URL-адрес канала Telegram.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="telegram-url">URL канала</Label>
              <Input
                id="telegram-url"
                placeholder="https://t.me/channel_name"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <Button className="w-full sm:w-auto" onClick={handleAdd}>
              Добавить канал
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Подключенные каналы</CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelList
            channels={channels.map((c) => ({
              id: c.id,
              name: c.channel_url, // отображаем URL, а не имя
              url: c.channel_url,
            }))}
            onDelete={handleDelete}
            showUrl
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramChannels;