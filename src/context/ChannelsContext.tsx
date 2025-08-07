import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Channel {
  id: string;
  name: string;
  url?: string;
  email?: string;
  status?: string;
}

interface ChannelsContextType {
  telegramChannels: Channel[];
  youtubeChannels: Channel[];
  addTelegramChannel: (channel: Channel) => void;
  removeTelegramChannel: (id: string) => void;
  addYouTubeChannel: (channel: Channel) => void;
  removeYouTubeChannel: (id: string) => void;
}

const ChannelsContext = createContext<ChannelsContextType | undefined>(undefined);

export const ChannelsProvider = ({ children }: { children: ReactNode }) => {
  const [telegramChannels, setTelegramChannels] = useState<Channel[]>([]);
  const [youtubeChannels, setYouTubeChannels] = useState<Channel[]>([]);

  const addTelegramChannel = (channel: Channel) => {
    setTelegramChannels((prev) => [...prev, channel]);
  };

  const removeTelegramChannel = (id: string) => {
    setTelegramChannels((prev) => prev.filter((c) => c.id !== id));
  };

  const addYouTubeChannel = (channel: Channel) => {
    setYouTubeChannels((prev) => [...prev, channel]);
  };

  const removeYouTubeChannel = (id: string) => {
    setYouTubeChannels((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ChannelsContext.Provider
      value={{
        telegramChannels,
        youtubeChannels,
        addTelegramChannel,
        removeTelegramChannel,
        addYouTubeChannel,
        removeYouTubeChannel,
      }}
    >
      {children}
    </ChannelsContext.Provider>
  );
};

export const useChannels = () => {
  const context = useContext(ChannelsContext);
  if (!context) {
    throw new Error("useChannels must be used within a ChannelsProvider");
  }
  return context;
};