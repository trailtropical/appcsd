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
    // ── Autorização: valida o JWT real do chamador ──
    // Antes bastava mandar {"email": "<admin>"} no body, sem login, para receber PII de todos.
    const authorization = req.headers.get("Authorization") || req.headers.get("authorization") || ""
    const token = authorization.replace(/^Bearer\s+/i, "").trim()
    if (!token) {
      return new Response(JSON.stringify({ error: "missing token" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } })
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user || !user.email) {
      console.error("[admin] JWT inválido:", authError?.message)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } })
    }

    // Precisa ser o email admin (verificado pelo JWT emitido pelo Supabase Auth).
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    if (user.email !== ADMIN_EMAIL) {
      console.error("[admin] Sem permissão:", user.email)
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } })
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
    if (profile && profile.role !== "admin") {
      console.warn("[admin] role do admin não é 'admin':", profile.role)
    }

    const { data: profiles } = await admin.from("profiles").select("*")
    const { data: checkups } = await admin.from("checkups").select("*").order("first_checkup_at", { ascending: false })
    const { data: sessions } = await admin.from("sessions").select("*")

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
