import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  const frequencies = [
    { value: "10", label: "Every 10 minutes (144/day)" },
    { value: "20", label: "Every 20 minutes (72/day)" },
    { value: "30", label: "Every 30 minutes (48/day)" },
    { value: "40", label: "Every 40 minutes (36/day)" },
    { value: "50", label: "Every 50 minutes (approx. 28/day)" },
    { value: "60", label: "Every 1 hour (24/day)" },
    { value: "120", label: "Every 2 hours (12/day)" },
    { value: "360", label: "Every 6 hours (4/day)" },
    { value: "720", label: "Every 12 hours (2/day)" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Publication Schedule</CardTitle>
          <CardDescription>Set the general posting frequency for all publications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="frequency">Post Frequency</Label>
            <Select defaultValue="60">
              <SelectTrigger id="frequency" className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select frequency" />
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
          <CardTitle>Default YouTube Video Settings</CardTitle>
          <CardDescription>These settings will be applied to all videos by default.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Default Title Template</Label>
            <Input id="title" placeholder="e.g., {{telegram_post_title}}" />
          </div>
          <div>
            <Label htmlFor="description">Default Description Template</Label>
            <Textarea id="description" placeholder="e.g., From our Telegram: {{telegram_post_link}}" />
          </div>
          <div>
            <Label htmlFor="tags">Default Tags</Label>
            <Input id="tags" placeholder="tech, news, updates (comma-separated)" />
          </div>
          <div>
            <Label htmlFor="visibility">Default Visibility</Label>
            <Select defaultValue="private">
              <SelectTrigger id="visibility" className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="made-for-kids" />
            <Label htmlFor="made-for-kids">Is this video "made for kids"?</Label>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;