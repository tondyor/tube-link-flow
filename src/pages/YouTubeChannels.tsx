import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChannelList from "@/components/ChannelList";

const YouTubeChannels = () => {
  const [channels, setChannels] = useState([
    { id: "1", name: "My Awesome Channel", email: "user@gmail.com", status: "Подключен" },
  ]);

  const handleDelete = (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Каналы YouTube</h1>
      <Card>
        <CardHeader>
          <CardTitle>Подключить новый канал</CardTitle>
          <CardDescription>
            Подключите свой канал YouTube, войдя в систему через Google. Для этого потребуется настройка аутентификации на бэкенде.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Подключить через Google</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Подключенные каналы</CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelList channels={channels} onDelete={handleDelete} showEmail showStatus />
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeChannels;