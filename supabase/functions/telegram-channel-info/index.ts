import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractUsername(input: string): string | null {
  try {
    let username = input.trim();

    if (username.startsWith("http://") || username.startsWith("https://")) {
      const url = new URL(username);
      if (url.hostname === "t.me" || url.hostname === "www.t.me") {
        username = url.pathname.replace(/^\/+/, "");
      } else {
        return null;
      }
    }

    if (username.startsWith("@")) {
      username = username.slice(1);
    }

    if (/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
      return username;
    }

    return null;
  } catch (e) {
    console.error("extractUsername error:", e);
    return null;
  }
}

async function fetchTelegramChannelData(username: string) {
  try {
    const response = await fetch(`https://t.me/s/${username}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TelegramChannelInfoBot/1.0; +https://example.com/bot)",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch Telegram channel page for ${username}, status: ${response.status}`);
      return null;
    }

    const html = await response.text();

    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
    const descriptionMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);

    const title = titleMatch ? titleMatch[1].replace(/^Канал: /i, "").trim() : null;
    const description = descriptionMatch ? descriptionMatch[1].trim() : null;
    const image = imageMatch ? imageMatch[1].trim() : null;

    if (!title) {
      return null;
    }

    return { title, description, image };
  } catch (e) {
    console.error("fetchTelegramChannelData error:", e);
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

    const username = extractUsername(url);

    if (!username) {
      return new Response(JSON.stringify({ error: "Не удалось извлечь корректный username из ссылки" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const channelData = await fetchTelegramChannelData(username);

    if (!channelData) {
      return new Response(JSON.stringify({ error: "Канал не найден или не публичный" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ username, ...channelData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Internal error in telegram-channel-info:", e);
    return new Response(JSON.stringify({ error: "Внутренняя ошибка", details: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});