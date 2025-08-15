import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { 
  Bot, 
  Home, 
  Send, 
  Youtube, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentSources = [
  { to: "/telegram", icon: Send, label: "Каналы Telegram" },
  { to: "/youtube", icon: Youtube, label: "Каналы YouTube" },
  { to: "/tiktok-source", icon: Send, label: "Каналы TikTok" },
  { to: "/instagram-source", icon: Send, label: "Каналы Instagram" },
];

const publishingPlatforms = [
  { to: "/youtube-publish", icon: Youtube, label: "Публикация на YouTube" },
  { to: "/tiktok-publish", icon: Youtube, label: "Публикация в TikTok" },
  { to: "/instagram-publish", icon: Youtube, label: "Публикация в Instagram" },
];

export function AppSidebar() {
  return (
    <Sidebar className="hidden md:flex">
      <div className="flex items-center p-4 border-b">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold">SplitRun</h1>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    end
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 py-2 text-base font-medium rounded-md w-full",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      )
                    }
                  >
                    <Home className="h-5 w-5" />
                    <span>Дашборд</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Источники контента</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentSources.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-4 py-2 text-base font-medium rounded-md w-full",
                          isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Площадки публикации</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publishingPlatforms.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-4 py-2 text-base font-medium rounded-md w-full",
                          isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 py-2 text-base font-medium rounded-md w-full",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      )
                    }
                  >
                    <Settings className="h-5 w-5" />
                    <span>Настройки</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
