import { NavLink } from "react-router-dom";
import { Home, Send, Youtube, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "Панель управления" },
    { to: "/telegram", icon: <Send className="h-5 w-5" />, label: "Каналы Telegram" },
    { to: "/youtube", icon: <Youtube className="h-5 w-5" />, label: "Каналы YouTube" },
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Настройки" },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-card border-r">
      <div className="flex items-center h-16 px-6 border-b">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold">SplitRun</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )
            }
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;