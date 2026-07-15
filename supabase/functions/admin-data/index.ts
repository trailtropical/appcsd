import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const ADMIN_EMAIL = "trailtropicalpodcast@gmail.com"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const { email } = await req.json()

    if (email !== ADMIN_EMAIL) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { data: profiles } = await supabase.from("profiles").select("*")
    const { data: checkups } = await supabase.from("checkups").select("*").order("first_checkup_at", { ascending: false })
    const { data: sessions } = await supabase.from("sessions").select("*")

    return new Response(JSON.stringify({
      profiles: profiles || [],
      checkups: checkups || [],
      sessions: sessions || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    })

  } catch (error) {
    console.error("[admin] Error:", error.message)
    return new Response("Internal error", { status: 500, headers: corsHeaders })
  }
})
