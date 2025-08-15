import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Youtube, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YouTubeChannel {
  id: string;
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  createdAt: string;
}

const YouTubeChannels = () => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching channels from local storage or context
    const fetchChannels = () => {
      try {
        const storedChannels = localStorage.getItem("youtubeChannels");
        if (storedChannels) {
          setChannels(JSON.parse(storedChannels));
        }
      } catch (err) {
        console.error("Error loading channels:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список каналов",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [toast]);

  const handleConnect = () => {
    navigate("/youtube-connect");
  };

  const handleRemoveChannel = (channelId: string) => {
    try {
      const updatedChannels = channels.filter(channel => channel.id !== channelId);
      setChannels(updatedChannels);
      localStorage.setItem("youtubeChannels", JSON.stringify(updatedChannels));
      toast({
        title: "Канал удален",
        description: "Канал успешно удален из списка",
      });
    } catch (err) {
      console.error("Error removing channel:", err);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить канал",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Каналы YouTube</h1>
        <Button onClick={handleConnect} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Подключить канал
        </Button>
      </div>

      {channels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Youtube className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет подключенных каналов</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Подключите ваш YouTube канал для начала публикации контента
            </p>
            <Button onClick={handleConnect} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Подключить канал
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                {channel.thumbnailUrl ? (
                  <img
                    src={channel.thumbnailUrl}
                    alt={channel.title}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                    <Youtube className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{channel.title}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {channel.description || "Нет описания"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex justify-end mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveChannel(channel.id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default YouTubeChannels;