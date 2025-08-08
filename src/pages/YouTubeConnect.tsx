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
  const { toast } = useToast();

  // Fetch connected channels from Supabase to mark selected
  const fetchConnectedChannels = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setLoading(false);
      toast({
        title: "Ошибка",
        description: "Пользователь не аутентифицирован",
        variant: "destructive",
      });
      return;
    }
    const { data, error } = await supabase
      .from("youtube_channels")
      .select("channel_id")
      .eq("user_id", user.id);
    if (error) {
      toast({
        title: "Ошибка загрузки подключенных каналов",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const connectedIds = data?.map((c) => c.channel_id) || [];
    setChannels((prev) =>
      prev.map((ch) => ({ ...ch, selected: connectedIds.includes(ch.id) }))
    );
    setLoading(false);
  };

  // After OAuth redirect, handle code param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      (async () => {
        setAuthenticating(true);
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

          // После подключения обновим список подключенных каналов
          fetchConnectedChannels();
        } catch (error: any) {
          toast({
            title: "Ошибка авторизации",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setAuthenticating(false);
          // Убираем code из URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    }
  }, []);

  // Запрос списка каналов пользователя через YouTube API
  const fetchUserChannels = async () => {
    setLoading(true);
    try {
      // Получаем access token из Supabase (уже сохранен при oauth)
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast({
          title: "Ошибка",
          description: "Пользователь не аутентифицирован",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      // Получаем токен из таблицы youtube_channels для этого пользователя
      const { data, error } = await supabase
        .from("youtube_channels")
        .select("access_token")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (error || !data) {
        toast({
          title: "Ошибка",
          description: "Не найден токен доступа. Пожалуйста, подключите аккаунт Google.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const accessToken = data.access_token;

      // Запрос каналов через YouTube API
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

      // Формируем список каналов с selected = false
      const fetchedChannels: YouTubeChannel[] = json.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        selected: false,
      }));

      // Обновляем состояние, учитывая уже подключенные каналы
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
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось получить каналы",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Начать OAuth авторизацию Google
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

  // Обработка выбора канала для подключения/отключения
  const toggleChannelSelection = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, selected: !ch.selected } : ch))
    );
  };

  // Сохранить выбранные каналы в Supabase
  const handleSave = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Пользователь не аутентифицирован",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Для каждого выбранного канала делаем upsert (сохраняем токены и данные)
      for (const channel of channels.filter((ch) => ch.selected)) {
        // В реальном приложении нужно хранить access_token и refresh_token,
        // но у нас их нет, кроме как в edge function при oauth.
        // Здесь просто вставим канал с пустыми токенами, чтобы не ломать логику.
        const { error } = await supabase.from("youtube_channels").upsert({
          user_id: user.id,
          channel_id: channel.id,
          channel_title: channel.title,
          access_token: "", // TODO: токены должны быть сохранены при oauth
          refresh_token: "",
          token_expiry: new Date().toISOString(),
        });
        if (error) {
          toast({
            title: "Ошибка сохранения канала",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Удаляем каналы, которые были отключены
      const selectedIds = channels.filter((ch) => ch.selected).map((ch) => ch.id);
      const { error: deleteError } = await supabase
        .from("youtube_channels")
        .delete()
        .eq("user_id", user.id)
        .not("channel_id", "in", `(${selectedIds.map((id) => `'${id}'`).join(",")})`);

      if (deleteError) {
        toast({
          title: "Ошибка удаления каналов",
          description: deleteError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Каналы сохранены",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить каналы",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Подключение YouTube каналов</h1>
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