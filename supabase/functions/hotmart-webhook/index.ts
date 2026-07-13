import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const HOTMART_TOKEN = Deno.env.get("HOTMART_TOKEN")!

serve(async (req) => {
  // Only accept POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    // Verify Hotmart token
    const hottok = req.headers.get("x-hotmart-hottok")
    if (HOTMART_TOKEN && hottok !== HOTMART_TOKEN) {
      console.log("[hotmart] Invalid token")
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    console.log("[hotmart] Event:", JSON.stringify(body))

    // Hotmart sends different event types
    const event = body.event || body.data?.status || ""

    // Only process approved purchases
    const validEvents = ["PURCHASE_COMPLETE", "PURCHASE_APPROVED", "COMPLETED", "APPROVED"]
    if (!validEvents.includes(event)) {
      console.log("[hotmart] Ignoring event:", event)
      return new Response(JSON.stringify({ ignored: true, event }), { status: 200 })
    }

    // Extract buyer data
    const buyer = body.data?.buyer || body.buyer || {}
    const email = buyer.email || ""
    const name = buyer.name || ""

    if (!email) {
      console.log("[hotmart] No email found")
      return new Response("No email", { status: 400 })
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Generate a random password (user will need to reset or we send it)
    const tempPassword = generatePassword()

    // Create user in Supabase Auth
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name: name }
    })

    if (createError) {
      // If user already exists, that's ok
      if (createError.message?.includes("already")) {
        console.log("[hotmart] User already exists:", email)
        return new Response(JSON.stringify({ exists: true, email }), { status: 200 })
      }
      console.error("[hotmart] Error creating user:", createError.message)
      return new Response("Error creating user", { status: 500 })
    }

    // Create profile
    if (userData?.user) {
      await supabase.from("profiles").upsert({
        id: userData.user.id,
        email: email,
        nome: name
      })
    }

    console.log("[hotmart] User created:", email, userData?.user?.id)

    // TODO: Send email with password (using Resend, SendGrid, etc.)
    // For now, return the temp password in the response (for testing)
    return new Response(JSON.stringify({
      success: true,
      user_id: userData?.user?.id,
      email: email,
      temp_password: tempPassword
    }), { status: 200 })

  } catch (error) {
    console.error("[hotmart] Error:", error.message)
    return new Response("Internal error", { status: 500 })
  }
})

function generatePassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
