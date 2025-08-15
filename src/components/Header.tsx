import { Menu, Bot, Home, Send, Youtube, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Дашборд" },
    { to: "/telegram", icon: Send, label: "Каналы Telegram" },
    { to: "/youtube", icon: Youtube, label: "Каналы YouTube" },
    { to: "/youtube-publish", icon: Youtube, label: "Публикация на YouTube" },
    { to: "/tiktok-publish", icon: Youtube, label: "Публикация в TikTok" },
    { to: "/instagram-publish", icon: Youtube, label: "Публикация в Instagram" },
    { to: "/settings", icon: Settings, label: "Настройки" },
  ];

  return (
    <header className="flex md:hidden items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-950">
      <div className="flex items-center">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold">SplitRun</h1>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 overflow-y-auto">
          <div className="flex items-center h-16 px-6 border-b">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-xl font-bold">SplitRun</h1>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-base font-medium rounded-md w-full",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-3">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;