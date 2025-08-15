'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVideos } from '@/lib/videosContext';

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const router = useRouter();
  const { addVideo, videos } = useVideos();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (videoUrl) {
      addVideo(videoUrl);
      
      // Логика для получения videoId
      let videoId: string;
      const videoIdMatch = videoUrl.match(/(?:v=)([^&?]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
          videoId = videoIdMatch[1];
      } else {
          try {
              const urlObject = new URL(videoUrl);
              videoId = `${urlObject.hostname}${urlObject.pathname.replace(/\//g, '_')}`;
          } catch (e) {
              videoId = `local-${Date.now()}`;
          }
      }
      
      router.push(`/video/${videoId}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-lg mx-auto mb-8">
        <CardHeader>
          <CardTitle>Создать новое видео</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="video-url">Ссылка на видео (YouTube, Vimeo, etc.)</Label>
              <Input
                id="video-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={handleUrlChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Создать
            </Button>
          </form>
        </CardContent>
      </Card>

      {videos.length > 0 && (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Ваши видео</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {videos.map((video) => (
                <li key={video.id}>
                  <Button variant="link" onClick={() => router.push(`/video/${video.id}`)}>
                    {video.title}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
