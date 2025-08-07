import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, channel_id, content_id, content_url } = await req.json();

    if (!platform || !channel_id || !content_id || !content_url) {
      return new Response(JSON.stringify({ error: "Отсутствуют обязательные поля" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Проверяем, есть ли уже такая публикация
    const { data: existing, error: selectError } = await supabase
      .from("publications")
      .select("id")
      .eq("platform", platform)
      .eq("content_id", content_id)
      .limit(1)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 — это "строка не найдена", это нормально
      return new Response(JSON.stringify({ error: "Ошибка базы данных", details: selectError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existing) {
      // Публикация уже есть, не вставляем
      return new Response(JSON.stringify({ message: "Публикация уже существует" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Вставляем новую публикацию
    const { error: insertError } = await supabase.from("publications").insert({
      platform,
      channel_id,
      content_id,
      content_url,
      published_at: new Date().toISOString(),
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: "Ошибка вставки публикации", details: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Очищаем старые записи, оставляем только последние 1000
    const { error: cleanupError } = await supabase.rpc("cleanup_publications", { max_records: 1000 });

    if (cleanupError) {
      // Логируем ошибку очистки, но не прерываем работу
      console.error("Ошибка очистки публикаций:", cleanupError.message);
    }

    return new Response(JSON.stringify({ message: "Публикация сохранена" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Внутренняя ошибка сервера", details: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});