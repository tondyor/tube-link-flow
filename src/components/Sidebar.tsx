import { NavLink } from "react-router-dom";
import { Home, Send, Youtube, Settings, Bot, Video, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const contentSources = [
    { to: "/telegram", icon: <Send className="h-5 w-5" />, label: "Каналы Telegram" },
    { to: "/youtube", icon: <Youtube className="h-5 w-5" />, label: "Каналы YouTube" },
    { to: "/tiktok-source", icon: <Video className="h-5 w-5" />, label: "Каналы TikTok" },
    { to: "/instagram-source", icon: <Instagram className="h-5 w-5" />, label: "Каналы Instagram" },
  ];

  const publishingPlatforms = [
    { to: "/youtube-publish", icon: <Youtube className="h-5 w-5" />, label: "Публикация на YouTube" },
    { to: "/tiktok-publish", icon: <Video className="h-5 w-5" />, label: "Публикация в TikTok" },
    { to: "/instagram-publish", icon: <Instagram className="h-5 w-5" />, label: "Публикация в Instagram" },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-card border-r">
      <div className="flex items-center h-16 px-6 border-b">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold">SplitRun</h1>
      </div>
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div>
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Источники контента</h2>
          <div className="space-y-2">
            {contentSources.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )
                }
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Площадки публикации</h2>
          <div className="space-y-2">
            {publishingPlatforms.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )
                }
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )
            }
          >
            <Settings className="h-5 w-5" />
            <span className="ml-3">Настройки</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;