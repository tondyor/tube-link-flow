import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const YouTubeChannels = () => {
  const channels = [
    { name: "My Awesome Channel", email: "user@gmail.com", status: "Connected" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">YouTube Channels</h1>
      <Card>
        <CardHeader>
          <CardTitle>Connect New Channel</CardTitle>
          <CardDescription>
            Connect your YouTube channel by signing in with Google. This will require backend authentication to be set up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Connect via Google</Button>
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
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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