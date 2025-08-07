import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const TelegramChannels = () => {
  const channels = [
    { name: "Cool Tech", url: "https://t.me/cool_tech" },
    { name: "Daily Memes", url: "https://t.me/daily_memes" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Telegram Channels</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Channel</CardTitle>
          <CardDescription>Enter the public URL of the Telegram channel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="telegram-url">Channel URL</Label>
              <Input id="telegram-url" placeholder="https://t.me/channel_name" />
            </div>
            <Button className="w-full sm:w-auto">Add Channel</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Connected Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.url}>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>{channel.url}</TableCell>
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

export default TelegramChannels;