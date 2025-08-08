import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EDGE_FUNCTION_URL = "https://lvrusgtopkuuuxgdzacf.functions.supabase.co/youtube-oauth";

const YouTubeConnect = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      setLoading(true);
      setError(null);

      (async () => {
        try {
          const session = (await supabase.auth.getSession()).data.session;
          if (!session) throw new Error("Пользователь не аутентифицирован. Пожалуйста, войдите в систему.");

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
            throw new Error(data.error || "Произошла ошибка при подключении каналов.");
          }

          toast({
            title: "Успех!",
            description: `Следующие каналы были успешно подключены: ${data.channels}`,
          });

          // Redirect to the list of channels after success
          navigate("/youtube-channels");

        } catch (err: any) {
          setError(err.message);
          toast({
            title: "Ошибка подключения",
            description: err.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    }
  }, [navigate, toast]);

  const handleConnectGoogle = () => {
    setLoading(true);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
        setError("Конфигурация Google Client не найдена. Обратитесь к администратору.");
        setLoading(false);
        return;
    }

    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl"
    );
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    window.location.href = authUrl;
  };

  // If we are here after a redirect with a code, show a loading state.
  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold text-foreground">Подключаем ваши YouTube каналы...</p>
            <p className="mt-2 text-sm text-muted-foreground">Это может занять несколько секунд. Пожалуйста, не закрывайте страницу.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Подключение YouTube каналов</CardTitle>
          <CardDescription>
            Нажмите кнопку ниже, чтобы войти в свой аккаунт Google и разрешить доступ к вашим YouTube каналам. Все найденные каналы будут автоматически добавлены в систему.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
              <p className="font-bold">Ошибка:</p>
              <p>{error}</p>
            </div>
          )}
          <Button onClick={handleConnectGoogle} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Подключить Google аккаунт
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeConnect;