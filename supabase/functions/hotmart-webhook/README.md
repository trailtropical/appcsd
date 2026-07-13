# Hotmart Webhook → Supabase

## O que faz
Recebe webhook da Hotmart quando alguém compra, cria o usuário no Supabase automaticamente.

## Deploy

### 1. Instalar Supabase CLI
```bash
npm install -g supabase
```

### 2. Login no Supabase
```bash
supabase login
```

### 3. Linkar o projeto
```bash
supabase link --project-ref zjsadtpxdexlflfykqzy
```

### 4. Setar as secrets (variáveis de ambiente)
```bash
supabase secrets set HOTMART_TOKEN=seu_token_aqui
```
> O `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já são definidos automaticamente.

### 5. Deploy da função
```bash
supabase functions deploy hotmart-webhook --no-verify-jwt
```

## Configurar na Hotmart

1. Vá em **Produtos → [seu produto] → Configurações → Webhooks**
2. URL: `https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/hotmart-webhook`
3. Evento: **Compra aprovada** / **Purchase approved**
4. Opcional: cole o mesmo token que você setou no step 4

## Testar

```bash
curl -X POST https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/hotmart-webhook \
  -H "Content-Type: application/json" \
  -H "x-hotmart-hottok: seu_token_aqui" \
  -d '{
    "event": "PURCHASE_COMPLETE",
    "data": {
      "buyer": {
        "name": "Aluno Teste",
        "email": "aluno@teste.com"
      },
      "product": {
        "name": "Corredor Sem Dor",
        "id": 123
      }
    }
  }'
```

## Fluxo
```
Aluno compra na Hotmart
  → Hotmart envia POST para a Edge Function
  → Edge Function valida o token
  → Cria usuário no Supabase Auth (senha aleatória)
  → Cria profile na tabela profiles
  → Retorna { success: true, user_id: "..." }
```

## Próximos passos
- Integrar serviço de email (Resend, SendGrid) para enviar senha pro aluno
- Ou usar o Hotmart webhook para redirecionar pro app com cadastro automático
