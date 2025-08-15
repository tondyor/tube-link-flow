import { Outlet } from "react-router-dom";
import Header from "./Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="w-full flex-1" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
        <div className="md:hidden">
          <Header />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;