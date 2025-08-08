import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EDGE_FUNCTION_URL = "https://lvrusgtopkuuuxgdzacf.functions.supabase.co/youtube-oauth";

interface YouTubeChannel {
  id: string;
  title: string;
  description?: string;
  selected: boolean;
}

const YouTubeConnect = () => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConnectedChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        setError("Пользователь не аутентифицирован");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("youtube_channels")
        .select("channel_id")
        .eq("user_id", user.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const connectedIds = data?.map((c) => c.channel_id) || [];
      setChannels((prev) =>
        prev.map((ch) => ({ ...ch, selected: connectedIds.includes(ch.id) }))
      );
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки каналов");
    }
    setLoading(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      (async () => {
        setAuthenticating(true);
        setError(null);
        try {
          const session = supabase.auth.getSession ? (await supabase.auth.getSession()).data.session : null;
          if (!session) throw new Error("Пользователь не аутентифицирован");

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

          await fetchConnectedChannels();
        } catch (error: any) {
          setError(error.message);
          toast({
            title: "Ошибка авторизации",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setAuthenticating(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    } else {
      fetchConnectedChannels();
    }
  }, []);

  const fetchUserChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        setError("Пользователь не аутентифицирован");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("youtube_channels")
        .select("access_token")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (error || !data) {
        setError("Не найден токен доступа. Пожалуйста, подключите аккаунт Google.");
        setLoading(false);
        return;
      }

      const accessToken = data.access_token;

      const res = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error?.message || "Ошибка получения каналов");
      }

      const json = await res.json();

      if (!json.items || json.items.length === 0) {
        toast({
          title: "Информация",
          description: "Каналы не найдены в вашем аккаунте.",
        });
        setChannels([]);
        setLoading(false);
        return;
      }

      const fetchedChannels: YouTubeChannel[] = json.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        selected: false,
      }));

      const connectedIds = (await supabase
        .from("youtube_channels")
        .select("channel_id")
        .eq("user_id", user.id)
        .then((res) => res.data?.map((c) => c.channel_id) || [])) || [];

      setChannels(
        fetchedChannels.map((ch) => ({
          ...ch,
          selected: connectedIds.includes(ch.id),
        }))
      );
    } catch (e: any) {
      setError(e.message || "Не удалось получить каналы");
      toast({
        title: "Ошибка",
        description: e.message || "Не удалось получить каналы",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleConnectGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl"
    );
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const toggleChannelSelection = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, selected: !ch.selected } : ch))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setError("Пользователь не аутентифицирован");
      setLoading(false);
      return;
    }

    try {
      for (const channel of channels.filter((ch) => ch.selected)) {
        const { error } = await supabase.from("youtube_channels").upsert({
          user_id: user.id,
          channel_id: channel.id,
          channel_title: channel.title,
          access_token: "", // TODO: токены должны быть сохранены при oauth
          refresh_token: "",
          token_expiry: new Date().toISOString(),
        });
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
      }

      const selectedIds = channels.filter((ch) => ch.selected).map((ch) => ch.id);
      const { error: deleteError } = await supabase
        .from("youtube_channels")
        .delete()
        .eq("user_id", user.id)
        .not("channel_id", "in", `(${selectedIds.map((id) => `'${id}'`).join(",")})`);

      if (deleteError) {
        setError(deleteError.message);
        setLoading(false);
        return;
      }

      toast({
        title: "Каналы сохранены",
      });
    } catch (e: any) {
      setError(e.message || "Не удалось сохранить каналы");
      toast({
        title: "Ошибка",
        description: e.message || "Не удалось сохранить каналы",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Подключение YouTube каналов</h1>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Ошибка: {error}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Шаг 1: Подключите Google аккаунт</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConnectGoogle} disabled={authenticating}>
            {authenticating ? "Авторизация..." : "Подключить Google аккаунт"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Шаг 2: Выберите каналы для подключения</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchUserChannels} disabled={loading || authenticating} className="mb-4">
            Загрузить мои каналы
          </Button>
          {loading && <p>Загрузка каналов...</p>}
          {!loading && channels.length === 0 && <p>Каналы не загружены.</p>}
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {channels.map((channel) => (
              <li key={channel.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={channel.id}
                  checked={channel.selected}
                  onChange={() => toggleChannelSelection(channel.id)}
                  className="w-4 h-4"
                />
                <label htmlFor={channel.id} className="cursor-pointer select-none">
                  {channel.title}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={loading || authenticating}>
              Сохранить выбранные каналы
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeConnect;