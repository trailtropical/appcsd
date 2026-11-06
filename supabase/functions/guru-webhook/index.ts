import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const GURU_TOKEN = Deno.env.get("GURU_TOKEN") || Deno.env.get("GURU_API_TOKEN") || ""
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || ""
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@seudominio.com"
const APP_STORE_URL = Deno.env.get("APP_STORE_URL") || "https://apps.apple.com/br/app/corredor-sem-dor/id6824963334"
const APP_URL = Deno.env.get("APP_URL") || "https://trailtropical.github.io/appcsd/"

// Guru manda o status em minúsculas, mas já vi variações em maiúsculas.
const APPROVED_STATUSES = [
  "approved",
  "active",
  "confirmed",
  "paid",
  "complete",
  "completed",
  "authorized",
  "trialing"
]
const DENIED_STATUSES = [
  "refunded",
  "chargeback",
  "canceled",
  "cancelled",
  "protest",
  "blocked",
  "expired"
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

// A Guru pode mandar JSON ou formulário (x-www-form-urlencoded / multipart).
async function readBody(req: Request): Promise<Record<string, any>> {
  const contentType = (req.headers.get("content-type") || "").toLowerCase()

  if (contentType.includes("application/json")) {
    return (await req.json().catch(() => ({}))) as Record<string, any>
  }

  const text = await req.text().catch(() => "")
  if (!text) return {}

  if (contentType.includes("multipart/form-data")) {
    const form = await new Response(text, {
      headers: { "content-type": contentType }
    }).formData().catch(() => null)
    if (!form) return {}
    const out: Record<string, any> = {}
    for (const [k, v] of form.entries()) out[k] = typeof v === "string" ? v : ""
    return out
  }

  // application/x-www-form-urlencoded (padrão do postback da Guru)
  const params = new URLSearchParams(text)
  const out: Record<string, any> = {}
  for (const [k, v] of params.entries()) out[k] = v
  if (Object.keys(out).length > 0) return out

  // Último recurso: tentar JSON mesmo sem o content-type certo.
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

// Aceita campo plano ("email"), com ponto ("contact.email") ou aninhado ({contact:{email}}).
function pick(body: Record<string, any>, keys: string[]): string {
  for (const key of keys) {
    const nested = key.split(".").reduce<any>((acc, part) => {
      if (acc === undefined || acc === null) return undefined
      return acc[part]
    }, body)
    if (typeof nested === "string" && nested.trim()) return nested.trim()
    if (typeof nested === "number") return String(nested)
    const flat = body[key]
    if (typeof flat === "string" && flat.trim()) return flat.trim()
    if (typeof flat === "number") return String(flat)
  }
  return ""
}

// O token pode vir na URL, no header ou no corpo.
// A Guru não tem campo de token no webhook, então o caminho principal é
// a chave na própria URL: .../guru-webhook?key=SEU_TOKEN
function extractToken(req: Request, body: Record<string, any>): string {
  const url = new URL(req.url)
  const queryToken =
    url.searchParams.get("key") ||
    url.searchParams.get("token") ||
    url.searchParams.get("api_token") ||
    ""
  if (queryToken) return queryToken.trim()

  const headerToken =
    req.headers.get("x-guru-token") ||
    req.headers.get("x-webhook-token") ||
    req.headers.get("x-api-token") ||
    ""
  if (headerToken) return headerToken.trim()

  const auth = req.headers.get("authorization") || ""
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim()

  return pick(body, ["token", "api_token", "webhook_token", "secret", "hottok"])
}

function parseDate(value: string): string {
  if (!value) return new Date().toISOString()
  const asNumber = Number(value)
  if (Number.isFinite(asNumber) && asNumber > 1000000000000) {
    return new Date(asNumber).toISOString()
  }
  // Guru costuma mandar "2026-11-05 14:30:00"
  const normalized = value.includes("T") ? value : value.replace(" ", "T")
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200 })
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await readBody(req)
    console.log("[guru] Payload:", JSON.stringify(body).substring(0, 600))

    // Fail-closed: sem token configurado (ou "placeholder"), rejeita tudo.
    if (!GURU_TOKEN || GURU_TOKEN === "placeholder") {
      console.error("[guru] GURU_TOKEN não configurado")
      return new Response("Unauthorized", { status: 401 })
    }
    const token = extractToken(req, body)
    if (token !== GURU_TOKEN) {
      console.log("[guru] Token inválido")
      return new Response("Unauthorized", { status: 401 })
    }

    const rawStatus = pick(body, ["status", "transaction_status", "subscription_status"])
    const status = rawStatus.toLowerCase()

    const isApproved = APPROVED_STATUSES.includes(status)
    const isDenied = DENIED_STATUSES.includes(status)

    if (!isApproved && !isDenied) {
      console.log("[guru] Ignorando status:", rawStatus || "(vazio)")
      return json({ ignored: true, status: rawStatus })
    }

    const email = normalizeEmail(pick(body, ["email", "contact.email", "buyer.email", "customer.email"]))
    const name = pick(body, ["name", "contact.name", "buyer.name", "customer.name", "full_name"])
    const productName = pick(body, ["product_name", "product.name", "offer_name"]) || "Corredor Sem Dor"
    const productId = pick(body, ["product_id", "product.id"])
    const rawId = pick(body, [
      "transaction_id",
      "id",
      "order_id",
      "order_code",
      "subscription_id",
      "code"
    ])
    const rawDate = pick(body, ["order_date", "approved_date", "date", "created_at", "paid_at"])

    if (!email) {
      console.log("[guru] Sem e-mail no payload")
      return new Response("No email", { status: 400 })
    }

    // Prefixo evita colisão com IDs numéricos da Hotmart.
    const transactionId = rawId
      ? `guru:${rawId}`
      : `guru:${email}:${productId || "csd"}:${parseDate(rawDate).slice(0, 10)}`

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const purchaseStatus = isApproved ? "approved" : "refunded"
    const purchasedAt = parseDate(rawDate)

    // ── 1. Registra / atualiza a compra ─────────────────────
    const { error: purchaseError } = await supabase
      .from("purchases")
      .upsert(
        {
          email,
          name,
          product: productName,
          transaction_id: transactionId,
          status: purchaseStatus,
          purchased_at: purchasedAt,
          updated_at: new Date().toISOString()
        },
        { onConflict: "transaction_id" }
      )

    if (purchaseError) {
      console.error("[guru] Erro ao salvar compra:", purchaseError.message)
      return json({ error: "purchase save failed", details: purchaseError.message }, 500)
    }

    console.log("[guru] Compra salva:", { email, transactionId, status: purchaseStatus })

    // ── 2. Reembolso / chargeback / cancelamento ───────────
    if (isDenied) {
      const { error: blockError } = await supabase
        .from("profiles")
        .update({ access_blocked: true })
        .eq("email", email)

      if (blockError) console.error("[guru] Erro ao bloquear acesso:", blockError.message)
      console.log("[guru] Acesso bloqueado:", email, "status:", status)
      return json({ success: true, status: purchaseStatus, email, blocked: true })
    }

    // ── 3. Compra aprovada: garante a conta do aluno ───────
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, password_set")
      .eq("email", email)
      .maybeSingle()

    if (!existingProfile) {
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name }
      })

      if (createError) {
        const alreadyExists =
          createError.message?.toLowerCase().includes("already") ||
          createError.message?.toLowerCase().includes("registered") ||
          (createError as { code?: string }).code === "email_exists"
        if (!alreadyExists) {
          console.error("[guru] Erro ao criar conta:", createError.message)
          return json({ error: "user create failed", details: createError.message }, 500)
        }
        console.log("[guru] Conta já existia:", email)
      } else {
        console.log("[guru] Conta criada:", created.user?.id || email)
      }
    } else {
      console.log("[guru] Conta já existia:", email)
    }

    // Recompra ou regularização: libera o acesso.
    await supabase
      .from("profiles")
      .update({ access_blocked: false })
      .eq("email", email)

    // ── 4. E-mail: primeiro criar a senha, depois baixar o app ─
    const firstName = name.split(" ")[0] || "atleta"
    const activateUrl = `${APP_URL}?email=${encodeURIComponent(email)}`
    const emailHtml = `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background: #0F0F0E; color: #F0F0EE;">
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="display: inline-block; background: #E8500A; color: white; font-weight: 800; font-size: 20px; padding: 8px 16px; border-radius: 8px;">CSD</div>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">Seu acesso está liberado 🏃</h1>
        <p style="font-size: 16px; color: #8A8A87; text-align: center; margin: 0 0 28px;">Olá ${firstName}, sua compra foi confirmada!</p>

        <div style="background: #1A1A18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 26px 24px; margin-bottom: 24px;">
          <p style="font-size: 15px; color: #F0F0EE; margin: 0 0 6px; text-align: center; font-weight: 700;">Falta só criar sua senha</p>
          <p style="font-size: 13px; color: #8A8A87; margin: 0 0 20px; text-align: center;">Leva menos de 1 minuto.</p>
          <a href="${activateUrl}" style="display: block; background: #E8500A; color: white; text-align: center; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 12px;">Criar minha senha →</a>
          <p style="font-size: 12px; color: #8A8A87; margin: 16px 0 0; text-align: center; line-height: 1.6;">
            Use este e-mail:<br>
            <strong style="color: #F0F0EE; font-size: 13px; word-break: break-all;">${email}</strong>
          </p>
        </div>

        <div style="background: #1A1A18; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
          <p style="font-size: 14px; color: #F0F0EE; margin: 0 0 4px; font-weight: 600;">Prefere usar o app?</p>
          <p style="font-size: 12px; color: #8A8A87; margin: 0 0 16px;">Depois de criar a senha, entre com o mesmo e-mail.</p>

          <p style="font-size: 11px; color: #8A8A87; margin: 0 0 6px;">iPhone / iPad</p>
          <a href="${APP_STORE_URL}" style="display: block; background: #E8500A; color: white; text-align: center; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 24px; border-radius: 10px;">Baixar na App Store →</a>

          <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 18px 0;"></div>

          <p style="font-size: 11px; color: #8A8A87; margin: 0 0 6px;">Android</p>
          <a href="${APP_URL}" style="display: block; background: #FFFFFF; color: #0F0F0E; text-align: center; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 24px; border-radius: 10px;">Instalar no Android →</a>
          <p style="font-size: 11px; color: #8A8A87; margin: 10px 0 0; line-height: 1.6;">
            Abra no <strong style="color:#F0F0EE">Chrome</strong>, toque nos <strong style="color:#F0F0EE">3 pontos (⋮)</strong> e escolha
            <strong style="color:#F0F0EE">"Instalar app"</strong>.
          </p>
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
    console.log("[guru] Resend status:", resendResponse.status, "body:", resendBody)

    if (!resendResponse.ok) {
      return json({ error: "Resend failed", details: resendBody }, 500)
    }

    console.log("[guru] E-mail enviado para:", email)
    return json({ success: true, email, transactionId, status: purchaseStatus })
  } catch (error) {
    console.error("[guru] Catch:", error.message)
    return json({ error: error.message }, 500)
  }
})
