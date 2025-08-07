import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setWatermarkFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!watermarkFile) {
      alert("Пожалуйста, загрузите видео вотермарку перед сохранением.");
      return;
    }
    // Здесь будет логика сохранения файла (например, загрузка на сервер)
    alert(`Вотермарка "${watermarkFile.name}" сохранена.`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Настройки</h1>
      <Card>
        <CardHeader>
          <CardTitle>Видео вотермарка</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Загрузите видео вотермарку, которая будет автоматически добавляться в конец всех видео перед публикацией на всех площадках для уникализации контента.
          </p>
          <div>
            <Label htmlFor="watermark-upload" className="block mb-2">
              Выберите видео файл вотермарки
            </Label>
            <input
              id="watermark-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            {watermarkFile && (
              <p className="mt-2 text-sm text-green-600">Выбран файл: {watermarkFile.name}</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;