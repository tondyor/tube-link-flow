import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { generateAuthUrl, getTokens } from "@/lib/youtubeAuth";
import { useToast } from "@/hooks/use-toast";

interface YouTubeChannel {
  id: string;
  channel_id: string;
  channel_title: string;
}

const YouTubeChannels = () => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch connected YouTube channels from Supabase
  const fetchChannels = async () => {
    setLoading(true);
    const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("youtube_channels")
      .select("id, channel_id, channel_title")
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
    setLoading(false);
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Handle OAuth redirect with code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      (async () => {
        setLoading(true);
        try {
          const tokens = await getTokens(code);
          // Use tokens to get channel info from YouTube API
          const res = await fetch(
            "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const channel = data.items[0];
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) throw new Error("User not authenticated");

            // Save channel info and tokens to Supabase
            const { error } = await supabase.from("youtube_channels").upsert({
              user_id: user.id,
              channel_id: channel.id,
              channel_title: channel.snippet.title,
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(),
            });
            if (error) {
              toast({
                title: "Ошибка сохранения канала",
                description: error.message,
                variant: "destructive",
              });
            } else {
              toast({
                title: "Канал подключен",
                description: `Канал ${channel.snippet.title} успешно подключен.`,
              });
              fetchChannels();
            }
          } else {
            toast({
              title: "Ошибка получения информации о канале",
              variant: "destructive",
            });
          }
        } catch (error: any) {
          toast({
            title: "Ошибка авторизации",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    }
  }, []);

  const handleConnect = () => {
    const authUrl = generateAuthUrl();
    window.location.href = authUrl;
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("youtube_channels").delete().eq("id", id);
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
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Каналы YouTube</h1>
      <Card>
        <CardHeader>
          <CardTitle>Подключенные каналы</CardTitle>
        </CardHeader>
        <CardContent>
          {channels.length === 0 && <p>Нет подключенных каналов.</p>}
          <ul className="space-y-2">
            {channels.map((channel) => (
              <li key={channel.id} className="flex justify-between items-center border p-2 rounded">
                <span>{channel.channel_title}</span>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(channel.id)} disabled={loading}>
                  Удалить
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button onClick={handleConnect} disabled={loading}>
              Подключить новый канал YouTube
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeChannels;