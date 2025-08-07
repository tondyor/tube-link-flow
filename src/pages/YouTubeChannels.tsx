import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChannelList from "@/components/ChannelList";

const YouTubeChannels = () => {
  const [channels, setChannels] = useState([
    { id: "1", name: "My Favorite Channel", url: "https://www.youtube.com/c/MyFavoriteChannel" },
  ]);
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    const channelName = newUrl.split("/").pop() || newUrl;
    const newChannel = {
      id: Date.now().toString(),
      name: channelName,
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
      <h1 className="text-3xl font-bold">Каналы YouTube</h1>
      <Card>
        <CardHeader>
          <CardTitle>Добавить канал</CardTitle>
          <CardDescription>Введите ссылку на чужой канал YouTube для загрузки видео.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="youtube-url">URL канала</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/c/ChannelName"
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
          <CardTitle>Добавленные каналы</CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelList channels={channels} onDelete={handleDelete} showUrl />
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeChannels;