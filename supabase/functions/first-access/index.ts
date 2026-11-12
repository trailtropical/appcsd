import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || ""
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@seudominio.com"
const APP_STORE_URL = Deno.env.get("APP_STORE_URL") || "https://apps.apple.com/br/app/corredor-sem-dor/id6824963334"
const APP_URL = Deno.env.get("APP_URL") || "https://trailtropical.github.io/appcsd/"
const PLAY_STORE_URL = Deno.env.get("PLAY_STORE_URL") || "https://play.google.com/store/apps/details?id=br.com.corredorsemdor"
const MAX_ATTEMPTS = 12
const WINDOW_MINUTES = 10

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  })
}

function normalizeEmail(value: string) {
  return (value || "").trim().toLowerCase()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

async function sendPasswordCreatedEmail(email: string, name: string) {
  if (!RESEND_API_KEY) {
    console.warn("[first-access] RESEND_API_KEY ausente; aviso não enviado")
    return
  }
  const firstName = (name || "").split(" ")[0] || "atleta"
  const when = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
  const html = `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background: #0F0F0E; color: #F0F0EE;">
      <div style="text-align: center; margin-bottom: 28px;">
        <div style="display: inline-block; background: #E8500A; color: white; font-weight: 800; font-size: 20px; padding: 8px 16px; border-radius: 8px;">CSD</div>
      </div>
      <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px; text-align: center;">Sua senha foi criada</h1>
      <p style="font-size: 15px; color: #8A8A87; text-align: center; margin: 0 0 24px;">Olá ${firstName}, sua conta no Corredor Sem Dor está ativa.</p>
      <div style="background: #1A1A18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
        <p style="font-size: 14px; color: #F0F0EE; margin: 0 0 8px;">E-mail: <strong>${email}</strong></p>
        <p style="font-size: 14px; color: #F0F0EE; margin: 0;">Data: <strong>${when}</strong></p>
      </div>

      <div style="background: #1A1A18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
        <p style="font-size: 14px; color: #F0F0EE; margin: 0 0 4px; font-weight: 600;">Leve o programa com você</p>
        <p style="font-size: 12px; color: #8A8A87; margin: 0 0 16px;">Entre com o mesmo e-mail e a senha que você acabou de criar.</p>

        <p style="font-size: 11px; color: #8A8A87; margin: 0 0 6px;">iPhone / iPad</p>
        <a href="${APP_STORE_URL}" style="display: block; background: #E8500A; color: white; text-align: center; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 24px; border-radius: 10px;">Baixar na App Store →</a>

        <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 18px 0;"></div>

        <p style="font-size: 11px; color: #8A8A87; margin: 0 0 6px;">Android</p>
        <a href="${PLAY_STORE_URL}" style="display: block; background: #FFFFFF; color: #0F0F0E; text-align: center; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 24px; border-radius: 10px;">Baixar no Google Play →</a>
      </div>

      <p style="font-size: 13px; color: #8A8A87; margin: 24px 0 0; text-align: center;">
        Se não foi você, responda este e-mail imediatamente para bloqueamos a conta.
      </p>
    </div>
  `
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Corredor Sem Dor <${FROM_EMAIL}>`,
        to: email,
        subject: "Sua senha foi criada — Corredor Sem Dor",
        html
      })
    })
    console.log("[first-access] aviso de senha criada:", res.status)
  } catch (e) {
    console.error("[first-access] falha ao enviar aviso:", e.message)
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body) return json({ ok: false, code: "invalid_body" }, 400)

    const action = String(body.action || "").trim()
    const email = normalizeEmail(body.email)
    const password = String(body.password || "")

    if (!isValidEmail(email)) {
      return json({ ok: false, code: "invalid_email" }, 400)
    }
    if (!["check", "set"].includes(action)) {
      return json({ ok: false, code: "invalid_action" }, 400)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // ── Limite de tentativas por e-mail ────────────────────
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString()
    const { count } = await supabase
      .from("access_attempts")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since)

    if ((count || 0) >= MAX_ATTEMPTS) {
      console.warn("[first-access] limite de tentativas:", email)
      return json({ ok: false, code: "rate_limited" }, 429)
    }

    await supabase.from("access_attempts").insert({
      email,
      action,
      ip: req.headers.get("x-forwarded-for") || ""
    })

    // ── Compra aprovada? ───────────────────────────────────
    const { data: purchases, error: purchaseError } = await supabase
      .from("purchases")
      .select("status, name")
      .eq("email", email)
      .order("created_at", { ascending: false })

    if (purchaseError) {
      console.error("[first-access] erro ao ler compras:", purchaseError.message)
      return json({ ok: false, code: "server_error" }, 500)
    }

    const hasApproved = (purchases || []).some(p => p.status === "approved")
    if (!hasApproved) {
      const hadRefund = (purchases || []).length > 0
      return json({ ok: false, code: hadRefund ? "blocked" : "no_purchase" })
    }

    // ── Perfil / bloqueio ──────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, password_set, access_blocked, email")
      .eq("email", email)
      .maybeSingle()

    if (profile?.access_blocked) {
      return json({ ok: false, code: "blocked" })
    }

    if (action === "check") {
      return json({ ok: true, needs_password: !profile?.password_set })
    }

    // ── Ação "set": cria a senha ───────────────────────────
    if (password.length < 6 || password.length > 72) {
      return json({ ok: false, code: "invalid_password" }, 400)
    }
    if (profile?.password_set) {
      return json({ ok: false, code: "already_set" })
    }

    let userId = profile?.id as string | undefined

    if (!userId) {
      // Compra aprovada, mas a conta ainda não foi criada (ex.: falha no webhook).
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true
      })
      if (createError) {
        const alreadyExists = createError.message?.toLowerCase().includes("already") ||
          createError.message?.toLowerCase().includes("registered")
        if (!alreadyExists) {
          console.error("[first-access] erro ao criar conta:", createError.message)
          return json({ ok: false, code: "server_error" }, 500)
        }
        const { data: found } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle()
        userId = found?.id
      } else {
        userId = created.user?.id
      }
    }

    if (!userId) {
      console.error("[first-access] conta não encontrada para:", email)
      return json({ ok: false, code: "server_error" }, 500)
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password })
    if (updateError) {
      console.error("[first-access] erro ao definir senha:", updateError.message)
      return json({ ok: false, code: "server_error" }, 500)
    }

    await supabase
      .from("profiles")
      .update({ password_set: true, access_blocked: false })
      .eq("id", userId)

    const name = purchases?.[0]?.name || ""
    await sendPasswordCreatedEmail(email, name)

    console.log("[first-access] senha criada:", email)
    return json({ ok: true })
  } catch (error) {
    console.error("[first-access] Catch:", error.message)
    return json({ ok: false, code: "server_error" }, 500)
  }
})
