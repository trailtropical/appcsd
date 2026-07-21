import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const HOTMART_TOKEN = Deno.env.get("HOTMART_TOKEN")!
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!
const APP_URL = Deno.env.get("APP_URL") || "https://trailtropical.github.io/appcsd/"
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@seudominio.com"

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const hottok = req.headers.get("x-hotmart-hottok")
    if (HOTMART_TOKEN && HOTMART_TOKEN !== "placeholder" && hottok !== HOTMART_TOKEN) {
      console.log("[hotmart] Invalid token:", hottok)
      return new Response("Unauthorized", { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch (e) {
      console.log("[hotmart] Failed to parse body")
      return new Response("Invalid JSON", { status: 400 })
    }

    console.log("[hotmart] Payload:", JSON.stringify(body).substring(0, 500))

    const event = body.event || body.data?.status || ""
    const validEvents = ["PURCHASE_COMPLETE", "PURCHASE_APPROVED", "COMPLETED", "APPROVED"]
    if (!validEvents.includes(event)) {
      console.log("[hotmart] Ignoring event:", event)
      return new Response(JSON.stringify({ ignored: true, event }), { status: 200 })
    }

    const buyer = body.data?.buyer || body.buyer || {}
    const email = buyer.email || ""
    const name = buyer.name || ""

    if (!email) {
      console.log("[hotmart] No email in payload")
      return new Response("No email", { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const signupUrl = `${APP_URL}?email=${encodeURIComponent(email)}`
    const firstName = name.split(" ")[0] || "atleta"

    const emailHtml = `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #0F0F0E; color: #F0F0EE;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #E8500A; color: white; font-weight: 800; font-size: 20px; padding: 8px 16px; border-radius: 8px;">CSD</div>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; text-align: center;">Bem-vindo ao Corredor Sem Dor! 🏃</h1>
        <p style="font-size: 16px; color: #8A8A87; text-align: center; margin-bottom: 32px;">Olá ${firstName}, sua compra foi confirmada!</p>
        <div style="background: #1A1A18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px 24px; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #8A8A87; margin-bottom: 16px;">Clique no botão abaixo para criar sua senha e começar seu programa de reabilitação:</p>
          <a href="${signupUrl}" style="display: block; background: #E8500A; color: white; text-align: center; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 12px;">Criar minha senha e começar →</a>
        </div>
        <p style="font-size: 12px; color: #5A5A57; text-align: center;">Se o botão não funcionar, copie e cole este link no navegador:<br><a href="${signupUrl}" style="color: #E8500A;">${signupUrl}</a></p>
      </div>
    `

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `Corredor Sem Dor <${FROM_EMAIL}>`,
        to: email,
        subject: "Bem-vindo ao Corredor Sem Dor — Crie sua senha",
        html: emailHtml
      })
    })

    const resendBody = await resendResponse.text()
    console.log("[hotmart] Resend status:", resendResponse.status, "body:", resendBody)

    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: "Resend failed", details: resendBody }), { status: 500 })
    }

    console.log("[hotmart] Email sent to:", email)
    return new Response(JSON.stringify({ success: true, email }), { status: 200 })

  } catch (error) {
    console.error("[hotmart] Catch:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
