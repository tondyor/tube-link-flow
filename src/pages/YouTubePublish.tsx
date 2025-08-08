import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const YouTubePublish = () => {
  const navigate = useNavigate();

  const handleConnectClick = () => {
    navigate("/youtube-connect");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Публикация на YouTube</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Управление каналами</CardTitle>
          <CardDescription>
            Для начала работы необходимо подключить ваш Google аккаунт и выбрать каналы, на которые будет осуществляться публикация.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConnectClick}>
            Подключить или управлять каналами YouTube
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Настройки публикации</CardTitle>
          <CardDescription>
            Здесь будут находиться настройки публикации видео на YouTube.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">В разработке...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubePublish;