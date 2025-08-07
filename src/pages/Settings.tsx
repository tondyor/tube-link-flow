import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  const frequencies = [
    { value: "10", label: "Каждые 10 минут (144/день)" },
    { value: "20", label: "Каждые 20 минут (72/день)" },
    { value: "30", label: "Каждые 30 минут (48/день)" },
    { value: "40", label: "Каждые 40 минут (36/день)" },
    { value: "50", label: "Каждые 50 минут (около 28/день)" },
    { value: "60", label: "Каждый час (24/день)" },
    { value: "120", label: "Каждые 2 часа (12/день)" },
    { value: "360", label: "Каждые 6 часов (4/день)" },
    { value: "720", label: "Каждые 12 часов (2/день)" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Настройки</h1>
      <Card>
        <CardHeader>
          <CardTitle>График публикаций</CardTitle>
          <CardDescription>Установите общую частоту публикаций для всех каналов.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="frequency">Частота публикаций</Label>
            <Select defaultValue="60">
              <SelectTrigger id="frequency" className="w-full sm:w-[280px]">
                <SelectValue placeholder="Выберите частоту" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Настройки видео YouTube по умолчанию</CardTitle>
          <CardDescription>Эти настройки будут применяться ко всем видео по умолчанию.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Шаблон заголовка по умолчанию</Label>
            <Input id="title" placeholder="например, {{telegram_post_title}}" />
          </div>
          <div>
            <Label htmlFor="description">Шаблон описания по умолчанию</Label>
            <Textarea id="description" placeholder="например, Из нашего Telegram: {{telegram_post_link}}" />
          </div>
          <div>
            <Label htmlFor="tags">Теги по умолчанию</Label>
            <Input id="tags" placeholder="технологии, новости, обновления (через запятую)" />
          </div>
          <div>
            <Label htmlFor="visibility">Видимость по умолчанию</Label>
            <Select defaultValue="private">
              <SelectTrigger id="visibility" className="w-full sm:w-[280px]">
                <SelectValue placeholder="Выберите видимость" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Открытый доступ</SelectItem>
                <SelectItem value="private">Ограниченный доступ</SelectItem>
                <SelectItem value="unlisted">Доступ по ссылке</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="made-for-kids" />
            <Label htmlFor="made-for-kids">Это видео "для детей"?</Label>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button>Сохранить настройки</Button>
      </div>
    </div>
  );
};

export default Settings;