import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const YouTubePublish = () => {
  const navigate = useNavigate();

  const handleConnectClick = () => {
    navigate("/youtube-connect");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Публикация на YouTube</h1>
      <p>Здесь будет управление настройками и публикацией видео на YouTube.</p>
      <div className="mt-6">
        <Button onClick={handleConnectClick}>Подключить Google аккаунт и выбрать каналы</Button>
      </div>
    </div>
  );
};

export default YouTubePublish;