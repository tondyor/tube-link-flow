import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Send, Youtube, CheckCircle } from "lucide-react";
import { useChannels } from "@/context/ChannelsContext";

const Dashboard = () => {
  const { telegramChannels, youtubeChannels } = useChannels();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Панель управления</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Каналы Telegram</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{telegramChannels.length}</div>
            <p className="text-xs text-muted-foreground">Подключенные каналы</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Каналы YouTube</CardTitle>
            <Youtube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{youtubeChannels.length}</div>
            <p className="text-xs text-muted-foreground">Подключенные каналы</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Запланированные посты</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+144</div>
            <p className="text-xs text-muted-foreground">В ближайшие 24 часа</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего постов</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">Опубликовано с начала</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Недавняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Нет недавней активности для отображения.</p>
          {/* Placeholder for activity log */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;