import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChannelList from "@/components/ChannelList";

const TelegramChannels = () => {
  const [channels, setChannels] = useState([
    { id: "1", name: "Cool Tech", url: "https://t.me/cool_tech" },
    { id: "2", name: "Daily Memes", url: "https://t.me/daily_memes" },
  ]);
  const [newUrl, setNewUrl] = React.useState("");

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    const newChannel = {
      id: Date.now().toString(),
      name: newUrl.split("/").pop() || newUrl,
      url: newUrl,
    };
    setChannels((prev) => [...prev, newChannel]);
    setNewUrl("");
  };

  const handleDelete = (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Каналы Telegram</h1>
      <Card>
        <CardHeader>
          <CardTitle>Добавить новый канал</CardTitle>
          <CardDescription>Введите публичный URL-адрес канала Telegram.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="telegram-url">URL канала</Label>
              <Input
                id="telegram-url"
                placeholder="https://t.me/channel_name"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <Button className="w-full sm:w-auto" onClick={handleAdd}>
              Добавить канал
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Подключенные каналы</CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelList channels={channels} onDelete={handleDelete} showUrl />
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramChannels;