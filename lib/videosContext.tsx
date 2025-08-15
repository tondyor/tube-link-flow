'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Video {
  id: string;
  url: string;
  title: string;
}

interface VideosContextType {
  videos: Video[];
  addVideo: (url: string) => void;
  getVideo: (id: string) => Video | undefined;
}

const VideosContext = createContext<VideosContextType | undefined>(undefined);

export function VideosProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const storedVideos = localStorage.getItem('videos');
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('videos', JSON.stringify(videos));
    }
  }, [videos]);

  const addVideo = (url: string) => {
    // Простая логика для извлечения ID из URL YouTube
    const videoIdMatch = url.match(/(?:v=)([^&?]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : `local-${Date.now()}`;
    
    const newVideo: Video = {
      id: videoId,
      url,
      title: `Видео ${videoId}`, // Временный заголовок
    };
    setVideos((prevVideos) => [...prevVideos, newVideo]);
  };

  const getVideo = (id: string) => {
    return videos.find((video) => video.id === id);
  };

  return (
    <VideosContext.Provider value={{ videos, addVideo, getVideo }}>
      {children}
    </VideosContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideosContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideosProvider');
  }
  return context;
}
