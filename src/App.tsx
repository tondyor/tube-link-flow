import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TelegramChannels from "./pages/TelegramChannels";
import YouTubeChannels from "./pages/YouTubeChannels";
import YouTubeConnect from "./pages/YouTubeConnect";
import TikTokSource from "./pages/TikTokSource";
import InstagramSource from "./pages/InstagramSource";
import TikTokPublish from "./pages/TikTokPublish";
import InstagramPublish from "./pages/InstagramPublish";
import YouTubePublish from "./pages/YouTubePublish";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ChannelsProvider } from "./context/ChannelsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChannelsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/telegram" element={<TelegramChannels />} />
              <Route path="/youtube" element={<YouTubeChannels />} />
              <Route path="/youtube-connect" element={<YouTubeConnect />} />
              <Route path="/tiktok-source" element={<TikTokSource />} />
              <Route path="/instagram-source" element={<InstagramSource />} />
              <Route path="/youtube-publish" element={<YouTubePublish />} />
              <Route path="/tiktok-publish" element={<TikTokPublish />} />
              <Route path="/instagram-publish" element={<InstagramPublish />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ChannelsProvider>
  </QueryClientProvider>
);

export default App;