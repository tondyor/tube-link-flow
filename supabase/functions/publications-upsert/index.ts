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
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if publication exists
    const { data: existing, error: selectError } = await supabase
      .from("publications")
      .select("id")
      .eq("platform", platform)
      .eq("content_id", content_id)
      .limit(1)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows found, which is OK
      return new Response(JSON.stringify({ error: "Database error", details: selectError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existing) {
      // Already exists, no need to insert
      return new Response(JSON.stringify({ message: "Publication already exists" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert new publication
    const { error: insertError } = await supabase.from("publications").insert({
      platform,
      channel_id,
      content_id,
      content_url,
      published_at: new Date().toISOString(),
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: "Failed to insert publication", details: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cleanup: keep only latest 1000 records
    const { error: cleanupError } = await supabase.rpc("cleanup_publications", { max_records: 1000 });

    if (cleanupError) {
      // Log cleanup error but do not fail the request
      console.error("Cleanup error:", cleanupError.message);
    }

    return new Response(JSON.stringify({ message: "Publication saved" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});