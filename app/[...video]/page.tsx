'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVideos } from '@/lib/videosContext';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface Video {
  id: string;
  url: string;
  title: string;
}

export default function VideoPage() {
  const params = useParams();
  const { getVideo, updateVideo } = useVideos();
  const videoId = Array.isArray(params.video) ? params.video.join('/') : params.video;
  
  const [video, setVideo] = useState<Video | undefined>(undefined);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (videoId) {
      const foundVideo = getVideo(videoId);
      setVideo(foundVideo);
      if (foundVideo) {
        setTitle(foundVideo.title);
      }
    }
  }, [videoId, getVideo]);

  const handleTitleSave = () => {
    if (video) {
      updateVideo(video.id, { title });
      toast.success('Название видео обновлено!');
    }
  };

  const handleProcessingAction = (action: string) => {
    toast.info(`Запущена обработка: ${action}`);
  };

  if (!video) {
    return (
      <div className="container mx-auto p-4">
        <p>Видео не найдено.</p>
      </div>
    );
  }

  const youtubeIdMatch = video.url.match(/(?:v=)([^&?]+)/);
  const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : null;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{video.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
              {youtubeId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>Не удалось отобразить видео. Поддерживаются только ссылки YouTube.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Инструменты</CardTitle>
            <CardDescription>Редактирование и обработка</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="video-title">Название видео</Label>
              <div className="flex space-x-2">
                <Input
                  id="video-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button onClick={handleTitleSave}>Сохранить</Button>
              </div>
            </div>
            
            <Separator />

            <div className="space-y-2">
                <Label>Обработка</Label>
                <div className="flex flex-col space-y-2">
                    <Button variant="outline" onClick={() => handleProcessingAction('Обрезка видео')}>
                        Обрезать видео
                    </Button>
                    <Button variant="outline" onClick={() => handleProcessingAction('Создание субтитров')}>
                        Создать субтитры
                    </Button>
                    <Button variant="outline" onClick={() => handleProcessingAction('Улучшение звука')}>
                        Улучшить звук
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
