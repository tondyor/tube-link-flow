import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTelegramChannel } from "@/hooks/useTelegramChannel";
import { useToast } from "@/hooks/use-toast";
import { Send, Plus, Trash2 } from "lucide-react";

interface TelegramChannel {
  id: string;
  username: string;
  title: string;
  description: string | null;
  photoUrl?: string | null;
}

const TelegramChannels = () => {
  const [channels, setChannels] = useState<TelegramChannel[]>([]);
  const [channelInput, setChannelInput] = useState("");
  const { fetchChannelInfo, loading } = useTelegramChannel();
  const { toast } = useToast();

  const handleAddChannel = async () => {
    if (!channelInput.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ссылку на канал или его @username",
        variant: "destructive",
      });
      return;
    }

    try {
      const channelInfo = await fetchChannelInfo(channelInput);
      
      if (channelInfo) {
        if (channels.some(channel => channel.username === `@${channelInfo.username}`)) {
          toast({
            title: "Канал уже добавлен",
            description: "Этот Telegram канал уже есть в вашем списке.",
            variant: "destructive",
          });
          return;
        }

        const newChannel: TelegramChannel = {
          id: channelInfo.username,
          username: `@${channelInfo.username}`,
          title: channelInfo.title,
          description: channelInfo.description,
          photoUrl: channelInfo.photoUrl
        };
        
        const updatedChannels = [...channels, newChannel];
        setChannels(updatedChannels);
        localStorage.setItem("telegramChannels", JSON.stringify(updatedChannels));
        
        toast({
          title: "Канал добавлен",
          description: `Канал ${newChannel.username} успешно добавлен.`,
        });
        
        setChannelInput("");
      }
    } catch (error) {
      console.error("Error adding channel:", error);
      toast({
        title: "Ошибка",
        description: "Произошла непредвиденная ошибка при добавлении канала.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveChannel = (channelId: string) => {
    const updatedChannels = channels.filter(channel => channel.id !== channelId);
    setChannels(updatedChannels);
    localStorage.setItem("telegramChannels", JSON.stringify(updatedChannels));
    
    toast({
      title: "Канал удален",
      description: "Канал успешно удален из списка.",
    });
  };

  React.useEffect(() => {
    const savedChannels = localStorage.getItem("telegramChannels");
    if (savedChannels) {
      try {
        setChannels(JSON.parse(savedChannels));
      } catch (error) {
        console.error("Error parsing saved channels:", error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Каналы Telegram</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Добавить канал</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-url">Ссылка на канал или @username</Label>
            <div className="flex gap-2">
              <Input
                id="channel-url"
                placeholder="https://t.me/durov или @durov"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChannel()}
              />
              <Button 
                onClick={handleAddChannel} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Добавить
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Введите публичную ссылку на Telegram канал или его имя пользователя (с @ или без).
            </p>
          </div>
        </CardContent>
      </Card>

      {channels.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                {channel.photoUrl ? (
                  <img
                    src={channel.photoUrl}
                    alt={channel.title}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{channel.title}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {channel.username}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {channel.description || "Нет описания"}
                </p>
              </CardContent>
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
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Send className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет добавленных каналов</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Добавьте Telegram каналы для мониторинга контента
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TelegramChannels;