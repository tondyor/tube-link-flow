import { NavLink } from "react-router-dom";
import { Home, Send, Youtube, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Sidebar = () => {
  const contentSources = [
    { to: "/telegram", icon: <Send className="h-5 w-5" />, label: "Каналы Telegram", disabled: false },
    { to: "/youtube", icon: <Youtube className="h-5 w-5" />, label: "Каналы YouTube", disabled: true },
    { to: "/tiktok-source", icon: <Send className="h-5 w-5" />, label: "Каналы TikTok", disabled: true },
    { to: "/instagram-source", icon: <Send className="h-5 w-5" />, label: "Каналы Instagram", disabled: true },
  ];

  const publishingPlatforms = [
    { to: "/youtube-publish", icon: <Youtube className="h-5 w-5" />, label: "Публикация на YouTube" },
    { to: "/youtube-connect", icon: <Youtube className="h-5 w-5" />, label: "Подключить YouTube каналы" },
    { to: "/tiktok-publish", icon: <Youtube className="h-5 w-5" />, label: "Публикация в TikTok" },
    { to: "/instagram-publish", icon: <Youtube className="h-5 w-5" />, label: "Публикация в Instagram" },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-card border-r">
      <div className="flex items-center h-16 px-6 border-b">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold">SplitRun</h1>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )
            }
          >
            <Home className="h-5 w-5" />
            <span className="ml-3">Дашборд</span>
          </NavLink>
        </div>
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="content-sources">
            <AccordionTrigger>Источники контента</AccordionTrigger>
            <AccordionContent className="space-y-1">
              {contentSources.map((item) =>
                item.disabled ? (
                  <div
                    key={item.to}
                    className="flex items-center px-8 py-2 text-sm font-medium rounded-md text-muted-foreground cursor-not-allowed"
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-8 py-2 text-sm font-medium rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      )
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                )
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="publishing-platforms">
            <AccordionTrigger>Площадки публикации</AccordionTrigger>
            <AccordionContent className="space-y-1">
              {publishingPlatforms.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-8 py-2 text-sm font-medium rounded-md",
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    )
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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