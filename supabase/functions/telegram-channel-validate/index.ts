import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractChannelUsername(url: string): string | null {
  // Поддержка форматов: https://t.me/username, t.me/username, @username
  try {
    if (url.startsWith("@")) return url.slice(1);
    if (url.includes("t.me/")) {
      const match = url.match(/t\.me\/([a-zA-Z0-9_]+)/);
      if (match) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchChannelTitle(username: string): Promise<string | null> {
  // Парсим публичную страницу Telegram-канала
  try {
    const resp = await fetch(`https://t.me/s/${username}`);
    if (!resp.ok) return null;
    const html = await resp.text();
    // Ищем <meta property="og:title" content="Название канала">
    const match = html.match(/<meta property="og:title" content="([^"]+)"/);
    if (match) {
      // Обычно формат: "Канал: Название"
      const title = match[1].replace(/^Канал: /, "").trim();
      return title;
    }
    return null;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Некорректная ссылка" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const username = extractChannelUsername(url.trim());
    if (!username) {
      return new Response(JSON.stringify({ error: "Не удалось извлечь username из ссылки" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const title = await fetchChannelTitle(username);
    if (!title) {
      return new Response(JSON.stringify({ error: "Канал не найден или не публичный" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ username, title }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Внутренняя ошибка", details: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});