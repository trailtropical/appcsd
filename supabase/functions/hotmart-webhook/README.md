# Hotmart Webhook → Supabase + Email (Resend)

## O que faz
Recebe webhook da Hotmart quando alguém compra, cria o usuário no Supabase e envia email com link de cadastro.

## Fluxo
```
Aluno compra na Hotmart
  → Hotmart envia POST para a Edge Function
  → Edge Function valida o token
  → Cria usuário no Supabase Auth (senha temporária)
  → Envia email via Resend com link para criar senha
  → Aluno clica no link → cria senha → começa o programa
```

## Deploy

### 1. Criar conta no Resend
- Acesse https://resend.com → Sign Up
- Crie uma API Key em **API Keys**
- Adicione seu domínio em **Domains** e configure DNS

### 2. Instalar Supabase CLI
```bash
npm install -g supabase
```

### 3. Login e link
```bash
supabase login
supabase link --project-ref zjsadtpxdexlflfykqzy
```

### 4. Setar as secrets
```bash
supabase secrets set HOTMART_TOKEN=seu_token_hotmart
supabase secrets set RESEND_API_KEY=re_sua_api_key
supabase secrets set APP_URL=https://trailtropical.github.io/appcsd/
supabase secrets set FROM_EMAIL=noreply@seudominio.com
```

### 5. Deploy
```bash
supabase functions deploy hotmart-webhook --no-verify-jwt
```

## Configurar na Hotmart
1. **Produtos → [produto] → Configurações → Webhooks**
2. URL: `https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/hotmart-webhook`
3. Evento: **Compra aprovada**

## Testar
```bash
curl -X POST https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/hotmart-webhook \
  -H "Content-Type: application/json" \
  -H "x-hotmart-hottok: seu_token_hotmart" \
  -d '{
    "event": "PURCHASE_COMPLETE",
    "data": {
      "buyer": {
        "name": "Aluno Teste",
        "email": "aluno@teste.com"
      }
    }
  }'
```

## Email enviado
O email contém:
- Logo CSD
- Mensagem de boas-vindas
- Botão "Criar minha senha e começar"
- Link backup caso o botão não funcione

## Variáveis de ambiente
| Secret | Descrição |
|---|---|
| `HOTMART_TOKEN` | Token de verificação do webhook Hotmart |
| `RESEND_API_KEY` | API key do Resend |
| `APP_URL` | URL do app (default: GitHub Pages) |
| `FROM_EMAIL` | Email remetente (precisa ser do domínio verificado) |
