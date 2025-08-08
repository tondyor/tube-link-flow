import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { TaggingProvider } from "@/context/TaggingContext";
import Taggable from "./Taggable";

const Layout = () => {
  return (
    <TaggingProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Пример использования Taggable: оборачиваем Outlet */}
            <Taggable id="main-outlet" name="Основной контент">
              <Outlet />
            </Taggable>
          </main>
        </div>
      </div>
    </TaggingProvider>
  );
};

export default Layout;