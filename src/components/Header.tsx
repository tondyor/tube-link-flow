import { Menu, Bot, Home, Send, Youtube, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const navItems = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "Панель управления" },
    { to: "/telegram", icon: <Send className="h-5 w-5" />, label: "Каналы Telegram" },
    { to: "/youtube", icon: <Youtube className="h-5 w-5" />, label: "Каналы YouTube" },
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Настройки" },
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
        <SheetContent side="left" className="w-72 p-0">
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
                    "flex items-center px-4 py-2 text-lg font-medium rounded-md",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )
                }
              >
                {item.icon}
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