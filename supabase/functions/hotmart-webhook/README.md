# Hotmart Webhook → Supabase + E-mail (Resend)

Recebe o webhook da Hotmart quando a compra é aprovada, registra a compra,
cria a conta do aluno e envia o e-mail com o link da App Store.

O aluno **não cria mais a conta pelo site**: ele baixa o app, toca em
"Primeiro acesso", informa o e-mail da compra e cria a senha dentro do app.
A validação é feita pela Edge Function `first-access`.

## Fluxo

```
Aluno compra na Hotmart
  → Hotmart envia POST para esta função
  → Grava a compra em public.purchases (status approved)
  → Cria a conta no Supabase Auth (e-mail já confirmado)
  → Desbloqueia o perfil (access_blocked = false)
  → Envia e-mail com o botão "Baixar na App Store"
```

Reembolso, chargeback, cancelamento e protesto:

```
Hotmart envia PURCHASE_REFUNDED / PURCHASE_CHARGEBACK / ...
  → Atualiza a compra para status = refunded
  → Marca profiles.access_blocked = true
  → O app bloqueia o acesso no próximo login
```

## Variáveis de ambiente

| Secret | Descrição |
|---|---|
| `HOTMART_TOKEN` | Token de verificação do webhook Hotmart (`x-hotmart-hottok`) |
| `RESEND_API_KEY` | API key do Resend |
| `FROM_EMAIL` | Remetente verificado no Resend |
| `APP_STORE_URL` | Opcional. Padrão: link da App Store do Corredor Sem Dor |

## Configurar na Hotmart

1. Hotmart → Ferramentas → Webhook.
2. URL: `https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/hotmart-webhook`
3. Eventos: compra aprovada/completa, reembolso, chargeback, cancelamento e protesto.
4. Token: o mesmo valor de `HOTMART_TOKEN`.

## Deploy

```bash
supabase functions deploy hotmart-webhook --no-verify-jwt
```

## Teste rápido

```bash
curl -X POST https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/hotmart-webhook \
  -H "Content-Type: application/json" \
  -H "x-hotmart-hottok: seu_token" \
  -d '{
    "event": "PURCHASE_APPROVED",
    "data": {
      "buyer": { "email": "aluno@teste.com", "name": "Aluno Teste" },
      "product": { "id": 123, "name": "Corredor Sem Dor" },
      "purchase": { "transaction": "HP-TESTE-001", "status": "APPROVED" }
    }
  }'
```

Resposta esperada: `{"success":true,"email":"aluno@teste.com","transactionId":"HP-TESTE-001","status":"approved"}`.
