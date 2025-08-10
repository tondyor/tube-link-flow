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
  channel_url: string;
  channel_title?: string;
  channel_description?: string;
  channel_image?: string;
}

const EDGE_FUNCTION_URL = "https://lvrusgtopkuuuxgdzacf.functions.supabase.co/telegram-channel-info";

const TelegramChannels = () => {
  const [channels, setChannels] = useState<TelegramChannel[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from("telegram_channels")
      .select("id, channel_url, channel_title, channel_description, channel_image")
      .order("created_at", { ascending: false });
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

  // Validate input as either a valid t.me URL or a valid @username
  const isValidTelegramInput = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;

    // Check if input is a valid URL with hostname t.me or www.t.me
    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname === "t.me" || parsed.hostname === "www.t.me") {
        // Also check pathname for username presence
        if (parsed.pathname && parsed.pathname.length > 1) {
          return true;
        }
        return false;
      }
    } catch {
      // Not a valid URL, continue to check if it's @username
    }

    // Check if input is @username format
    if (/^@[a-zA-Z0-9_]{5,}$/.test(trimmed)) {
      return true;
    }

    return false;
  };

  const handleAdd = async () => {
    const trimmedInput = newUrl.trim();
    if (!trimmedInput) {
      toast({
        title: "Ошибка",
        description: "Введите ссылку на канал или @username",
        variant: "destructive",
      });
      return;
    }
    if (!isValidTelegramInput(trimmedInput)) {
      toast({
        title: "Ошибка",
        description: "Введите корректный URL канала Telegram или @username",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // Запрос информации о канале
      const resp = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedInput }),
      });
      const info = await resp.json();
      if (!resp.ok) {
        toast({
          title: "Ошибка",
          description: info.error || "Не удалось получить информацию о канале",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      // Сохраняем ссылку и данные
      const { error } = await supabase.from("telegram_channels").insert([
        {
          channel_url: trimmedInput,
          channel_title: info.title,
          channel_description: info.description,
          channel_image: info.image,
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
          description: info.title,
        });
        setNewUrl("");
        fetchChannels();
      }
    } catch (e: any) {
      toast({
        title: "Ошибка",
        description: e.message || "Не удалось получить информацию о канале",
        variant: "destructive",
      });
    }
    setLoading(false);
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
      <h1 className="text-3xl font-bold">Ссылки на Telegram каналы</h1>
      <Card>
        <CardHeader>
          <CardTitle>Добавить новый канал</CardTitle>
          <CardDescription>Введите публичный URL-адрес канала Telegram или @username.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="telegram-url">URL канала или @username</Label>
              <Input
                id="telegram-url"
                placeholder="https://t.me/channel_name или @channel_name"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button className="w-full sm:w-auto" onClick={handleAdd} disabled={loading}>
              {loading ? "Сохраняем..." : "Добавить ссылку"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Добавленные ссылки</CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelList
            channels={channels.map((c) => ({
              id: c.id,
              name: c.channel_title || c.channel_url,
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