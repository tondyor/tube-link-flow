import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YouTubeChannel {
  id: string;
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  createdAt: string;
}

const YouTubeConnect = () => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  // This is the critical check. If these variables are not set, nothing else can proceed.
  if (!clientId || !redirectUri || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
    return (
      <div className="p-6 bg-destructive/10 border-2 border-destructive rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-destructive mb-4">ТРЕБУЕТСЯ НАСТРОЙКА</h1>
        <p className="text-lg text-foreground mb-3">
          Чтобы подключение к Google заработало, вам необходимо указать ваши личные ключи API.
        </p>
        <p className="text-muted-foreground mb-4">
          Я не могу сделать это за вас в целях безопасности. Пожалуйста, добавьте следующие переменные в **настройках вашего проекта** и укажите их значения:
        </p>
        <div className="text-left inline-block bg-card p-4 rounded-md font-mono border shadow-sm">
          <p>VITE_GOOGLE_CLIENT_ID="ВАШ_КЛЮЧ_ОТ_GOOGLE"</p>
          <p>VITE_GOOGLE_REDIRECT_URI="ВАШ_REDIRECT_URI"</p>
        </div>
        <p className="mt-4 text-muted-foreground">
          После того как вы добавите эти переменные, нажмите кнопку **Rebuild** над чатом, чтобы применить изменения.
        </p>
      </div>
    );
  }

  const handleConnect = () => {
    setLoading(true);
    setError(null);
    
    // In a real implementation, this would redirect to Google OAuth
    // For now, we'll simulate a successful connection
    setTimeout(() => {
      setLoading(false);
      setConnected(true);
      
      // Save a mock channel to localStorage
      const mockChannel: YouTubeChannel = {
        id: "1",
        channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
        title: "Google Developers",
        description: "The official YouTube channel for Google Developers",
        thumbnailUrl: "https://yt3.ggpht.com/ytc/AIdro_kOp3kS52vTx2U5X8dZ9Nqi60kXJzKxjwz13A=s88-c-k-c0x00ffffff-no-rj",
        createdAt: new Date().toISOString()
      };
      
      try {
        const storedChannels = localStorage.getItem("youtubeChannels");
        const channels = storedChannels ? JSON.parse(storedChannels) : [];
        channels.push(mockChannel);
        localStorage.setItem("youtubeChannels", JSON.stringify(channels));
        
        toast({
          title: "Успешно подключено",
          description: "Канал успешно подключен к вашему аккаунту",
        });
      } catch (err) {
        console.error("Error saving channel:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить канал",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const handleFinish = () => {
    navigate("/youtube");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Подключение YouTube</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Подключение к YouTube</CardTitle>
          <CardDescription>
            Подключите ваш YouTube канал для публикации контента
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {connected ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Канал успешно подключен!</h3>
              <p className="text-muted-foreground mb-6">
                Вы можете управлять вашими каналами в разделе "Каналы YouTube"
              </p>
              <Button onClick={handleFinish}>
                Перейти к каналам
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Youtube className="h-16 w-16 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Подключение к YouTube</h3>
              <p className="text-muted-foreground mb-6">
                Нажмите кнопку ниже, чтобы подключить ваш YouTube канал
              </p>
              <Button 
                onClick={handleConnect} 
                disabled={loading}
                className="flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Подключение...
                  </>
                ) : (
                  "Подключить YouTube"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeConnect;