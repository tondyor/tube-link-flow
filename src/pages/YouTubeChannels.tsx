import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EDGE_FUNCTION_URL = "https://lvrusgtopkuuuxgdzacf.functions.supabase.co/youtube-oauth";

interface YouTubeChannel {
  id: string;
  channel_id: string;
  channel_title: string;
}

const YouTubeChannels = () => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchChannels = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      (async () => {
        setLoading(true);
        try {
          const session = supabase.auth.getSession ? (await supabase.auth.getSession()).data.session : null;
          if (!session) throw new Error("User not authenticated");

          const res = await fetch(EDGE_FUNCTION_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ code }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Ошибка подключения канала");
          }

          toast({
            title: "Канал подключен",
            description: data.channel,
          });

          fetchChannels();
        } catch (error: any) {
          toast({
            title: "Ошибка авторизации",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    }
  }, []);

  const handleConnect = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
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