import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  url?: string;
  email?: string;
  status?: string;
}

interface ChannelListProps {
  channels: Channel[];
  onDelete: (id: string) => void;
  showUrl?: boolean;
  showEmail?: boolean;
  showStatus?: boolean;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  onDelete,
  showUrl = false,
  showEmail = false,
  showStatus = false,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          {showUrl && <TableHead>URL</TableHead>}
          {showEmail && <TableHead>Email</TableHead>}
          {showStatus && <TableHead>Статус</TableHead>}
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {channels.map((channel) => (
          <TableRow key={channel.id}>
            <TableCell className="font-medium">{channel.name}</TableCell>
            {showUrl && <TableCell>{channel.url}</TableCell>}
            {showEmail && <TableCell>{channel.email}</TableCell>}
            {showStatus && (
              <TableCell>
                {channel.status ? (
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    {channel.status}
                  </span>
                ) : null}
              </TableCell>
            )}
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => onDelete(channel.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ChannelList;