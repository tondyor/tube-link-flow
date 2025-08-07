import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const YouTubeChannels = () => {
  const channels = [
    { name: "My Awesome Channel", email: "user@gmail.com", status: "Подключен" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Каналы YouTube</h1>
      <Card>
        <CardHeader>
          <CardTitle>Подключить новый канал</CardTitle>
          <CardDescription>
            Подключите свой канал YouTube, войдя в систему через Google. Для этого потребуется настройка аутентификации на бэкенде.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Подключить через Google</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Подключенные каналы</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название канала</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.email}>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>{channel.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      {channel.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeChannels;