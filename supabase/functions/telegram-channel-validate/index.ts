/// <reference types="https://deno.land/std@0.190.0/http/server.ts" />

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractChannelUsername(url: string): string | null {
  try {
    if (url.startsWith("@")) return url.slice(1);
    if (url.includes("t.me/")) {
      const match = url.match(/t\.me\/([a-zA-Z0-9_]+)/);
      if (match) return match[1];
    }
    return null;
  } catch (e) {
    console.error("extractChannelUsername error:", e);
    return null;
  }
}

async function fetchChannelTitle(username: string): Promise<string | null> {
  try {
    const resp = await fetch(`https://t.me/s/${username}`);
    if (!resp.ok) {
      console.error(`Failed to fetch Telegram channel page for ${username}, status: ${resp.status}`);
      return null;
    }
    const html = await resp.text();
    const match = html.match(/<meta property="og:title" content="([^"]+)"/);
    if (match) {
      const title = match[1].replace(/^Канал: /, "").trim();
      return title;
    }
    console.error(`Channel title meta tag not found for ${username}`);
    return null;
  } catch (e) {
    console.error("fetchChannelTitle error:", e);
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
    console.error("Internal error in telegram-channel-validate:", e);
    return new Response(JSON.stringify({ error: "Внутренняя ошибка", details: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});