import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const HOTMART_TOKEN = Deno.env.get("HOTMART_TOKEN")!
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@seudominio.com"
const APP_STORE_URL = Deno.env.get("APP_STORE_URL") || "https://apps.apple.com/br/app/corredor-sem-dor/id6824963334"

const APPROVED_EVENTS = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE", "COMPLETED", "APPROVED"]
const REFUNDED_EVENTS = [
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_PROTEST",
  "REFUNDED",
  "CHARGEBACK",
  "CANCELED"
]

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  })
}

function normalizeEmail(value: string) {
  return (value || "").trim().toLowerCase()
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const hottok = req.headers.get("x-hotmart-hottok")
    // Fail-closed: sem token configurado (ou "placeholder"), rejeita tudo.
    if (!HOTMART_TOKEN || HOTMART_TOKEN === "placeholder" || hottok !== HOTMART_TOKEN) {
      console.log("[hotmart] Invalid or missing token")
      return new Response("Unauthorized", { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      console.log("[hotmart] Failed to parse body")
      return new Response("Invalid JSON", { status: 400 })
    }

    console.log("[hotmart] Payload:", JSON.stringify(body).substring(0, 600))

    const event = body.event || body.data?.status || ""
    const isApproved = APPROVED_EVENTS.includes(event)
    const isRefunded = REFUNDED_EVENTS.includes(event)

    if (!isApproved && !isRefunded) {
      console.log("[hotmart] Ignoring event:", event)
      return json({ ignored: true, event })
    }

    const buyer = body.data?.buyer || body.buyer || {}
    const purchase = body.data?.purchase || body.purchase || {}
    const product = body.data?.product || body.product || {}

    const email = normalizeEmail(buyer.email || "")
    const name = (buyer.name || "").trim()
    const productName = product.name || "Corredor Sem Dor"
    const productId = String(product.id || "")
    const transactionId = String(
      purchase.transaction || body.data?.transaction || body.transaction || `${email}:${productId || "csd"}`
    )

    if (!email) {
      console.log("[hotmart] No email in payload")
      return new Response("No email", { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const status = isApproved ? "approved" : "refunded"

    // A Hotmart pode enviar a data em milissegundos ou como texto ISO.
    const rawDate = purchase.order_date || purchase.approved_date
    let purchasedAt = new Date().toISOString()
    if (typeof rawDate === "number") {
      purchasedAt = new Date(rawDate).toISOString()
    } else if (typeof rawDate === "string" && rawDate) {
      const asNumber = Number(rawDate)
      purchasedAt = Number.isFinite(asNumber) && asNumber > 1000000000000
        ? new Date(asNumber).toISOString()
        : rawDate
    }

    // ── 1. Registra / atualiza a compra ─────────────────────
    const { error: purchaseError } = await supabase
      .from("purchases")
      .upsert(
        {
          email,
          name,
          product: productName,
          transaction_id: transactionId,
          status,
          purchased_at: purchasedAt,
          updated_at: new Date().toISOString()
        },
        { onConflict: "transaction_id" }
      )

    if (purchaseError) {
      console.error("[hotmart] Erro ao salvar compra:", purchaseError.message)
      return json({ error: "purchase save failed", details: purchaseError.message }, 500)
    }

    console.log("[hotmart] Compra salva:", { email, transactionId, status })

    // ── 2. Reembolso / chargeback: bloqueia o acesso ────────
    if (isRefunded) {
      const { error: blockError } = await supabase
        .from("profiles")
        .update({ access_blocked: true })
        .eq("email", email)

      if (blockError) console.error("[hotmart] Erro ao bloquear acesso:", blockError.message)
      console.log("[hotmart] Acesso bloqueado por reembolso:", email)
      return json({ success: true, status, email, blocked: true })
    }

    // ── 3. Compra aprovada: garante a conta do aluno ────────
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, password_set")
      .eq("email", email)
      .maybeSingle()

    if (!existingProfile) {
      // Cria a conta já confirmada (o trigger handle_new_user cria o profile).
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name }
      })

      if (createError) {
        // Se a conta já existir (ex.: compra anterior), não é erro.
        const alreadyExists =
          createError.message?.toLowerCase().includes("already") ||
          createError.message?.toLowerCase().includes("registered") ||
          (createError as { code?: string }).code === "email_exists"
        if (!alreadyExists) {
          console.error("[hotmart] Erro ao criar conta:", createError.message)
          return json({ error: "user create failed", details: createError.message }, 500)
        }
        console.log("[hotmart] Conta já existia:", email)
      } else {
        console.log("[hotmart] Conta criada:", created.user?.id || email)
      }
    } else {
      console.log("[hotmart] Conta já existia:", email)
    }

    // Recompra ou regularização: libera o acesso.
    await supabase
      .from("profiles")
      .update({ access_blocked: false })
      .eq("email", email)

    // ── 4. E-mail: só o download + instruções dentro do app ─
    const firstName = name.split(" ")[0] || "atleta"
    const emailHtml = `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background: #0F0F0E; color: #F0F0EE;">
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="display: inline-block; background: #E8500A; color: white; font-weight: 800; font-size: 20px; padding: 8px 16px; border-radius: 8px;">CSD</div>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">Seu acesso está liberado 🏃</h1>
        <p style="font-size: 16px; color: #8A8A87; text-align: center; margin: 0 0 28px;">Olá ${firstName}, sua compra foi confirmada!</p>

        <div style="background: #1A1A18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 26px 24px; margin-bottom: 24px;">
          <p style="font-size: 15px; color: #F0F0EE; margin: 0 0 18px; text-align: center; font-weight: 600;">Baixe o app para começar</p>
          <a href="${APP_STORE_URL}" style="display: block; background: #E8500A; color: white; text-align: center; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 12px;">Baixar na App Store →</a>
          <p style="font-size: 12px; color: #8A8A87; margin: 14px 0 0; text-align: center;">Grátis para baixar no iPhone. O acesso é liberado após a compra.</p>
        </div>

        <div style="background: #1A1A18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
          <p style="font-size: 14px; color: #8A8A87; margin: 0 0 12px;">Depois de instalar:</p>
          <p style="font-size: 14px; color: #F0F0EE; margin: 0 0 8px;">1. Abra o app e toque em <strong>Primeiro acesso</strong>.</p>
          <p style="font-size: 14px; color: #F0F0EE; margin: 0 0 8px;">2. Informe este e-mail:</p>
          <p style="font-size: 15px; color: #E8500A; margin: 0 0 8px; font-weight: 700; word-break: break-all;">${email}</p>
          <p style="font-size: 14px; color: #F0F0EE; margin: 0;">3. Crie sua senha e comece o check-up.</p>
        </div>

        <p style="font-size: 12px; color: #5A5A57; margin: 24px 0 0; text-align: center;">Se você já tem conta, é só entrar com seu e-mail e senha. Dúvidas? Responda este e-mail.</p>
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
        subject: "Seu acesso ao Corredor Sem Dor",
        html: emailHtml
      })
    })

    const resendBody = await resendResponse.text()
    console.log("[hotmart] Resend status:", resendResponse.status, "body:", resendBody)

    if (!resendResponse.ok) {
      return json({ error: "Resend failed", details: resendBody }, 500)
    }

    console.log("[hotmart] E-mail enviado para:", email)
    return json({ success: true, email, transactionId, status })
  } catch (error) {
    console.error("[hotmart] Catch:", error.message)
    return json({ error: error.message }, 500)
  }
})
