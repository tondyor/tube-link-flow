import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChannelList from "@/components/ChannelList";
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

  // Валидация: URL с t.me или @username
  const isValidTelegramInput = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;

    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname === "t.me" || parsed.hostname === "www.t.me") {
        if (parsed.pathname && parsed.pathname.length > 1) {
          return true;
        }
        return false;
      }
    } catch {
      // Не URL, проверяем @username
    }

    if (/^@?[a-zA-Z0-9_]{5,32}$/.test(trimmed)) {
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

      // Проверка дубликатов по URL или названию
      if (channels.some((c) => c.channel_url.toLowerCase() === trimmedInput.toLowerCase() || c.channel_title === info.title)) {
        toast({
          title: "Канал уже добавлен",
          description: info.title,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setChannels((prev) => [
        {
          id: crypto.randomUUID(),
          channel_url: trimmedInput,
          channel_title: info.title,
          channel_description: info.description,
          channel_image: info.image,
        },
        ...prev,
      ]);
      toast({
        title: "Канал добавлен",
        description: info.title,
      });
      setNewUrl("");
    } catch (e: any) {
      toast({
        title: "Ошибка",
        description: e.message || "Не удалось получить информацию о канале",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Канал удален",
    });
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