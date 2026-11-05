# guru-webhook (Guru / Digital Manager Guru)

Recebe o postback da Guru quando a compra é aprovada, registra a compra,
cria a conta do aluno e envia o e-mail com o link da App Store.

O aluno não cria conta pelo site: baixa o app, toca em **Primeiro acesso**,
informa o e-mail da compra e cria a senha. A validação é feita pela Edge
Function `first-access` — igual ao fluxo da Hotmart.

## Fluxo

```
Compra aprovada na Guru
  → Guru envia POST para esta função
  → Grava a compra em public.purchases (transaction_id = "guru:<id>")
  → Cria a conta no Supabase Auth (e-mail já confirmado)
  → Desbloqueia o perfil (access_blocked = false)
  → Envia e-mail com o botão "Baixar na App Store"
```

Reembolso, chargeback, cancelamento, expiração ou bloqueio:

```
  → Atualiza a compra para status = refunded
  → Marca profiles.access_blocked = true
  → O app bloqueia o acesso no próximo login
```

## Formato aceito

A Guru pode enviar `application/json`, `application/x-www-form-urlencoded`
(padrão do postback) ou `multipart/form-data`. A função lê os três.

Campos reconhecidos (com variações de nome):

| Campo | Nomes aceitos |
|---|---|
| E-mail | `email`, `contact.email`, `buyer.email`, `customer.email` |
| Nome | `name`, `contact.name`, `buyer.name`, `full_name` |
| Status | `status`, `transaction_status`, `subscription_status` |
| Transação | `transaction_id`, `id`, `order_id`, `order_code`, `subscription_id`, `code` |
| Produto | `product_name`, `product.name`, `offer_name` |
| Data | `order_date`, `approved_date`, `date`, `created_at`, `paid_at` |

Status aprovados: `approved`, `active`, `confirmed`, `paid`, `complete`,
`completed`, `authorized`, `trialing`.

Status que bloqueiam: `refunded`, `chargeback`, `canceled`, `cancelled`,
`protest`, `blocked`, `expired`.

Qualquer outro status (ex.: `waiting_payment`, `in_review`) é ignorado.

## Token

A função recusa tudo se `GURU_TOKEN` (ou `GURU_API_TOKEN`) não estiver
configurado.

A Guru **não tem campo de token** na tela de webhook, então o caminho principal
é colocar a chave na própria URL:

```
https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/guru-webhook?key=SEU_TOKEN
```

A chave também é aceita em:

- header `x-guru-token`, `x-webhook-token`, `x-api-token`
- header `Authorization: Bearer <token>`
- campo no corpo: `token`, `api_token`, `webhook_token`, `secret`

> A chave aparece nos logs de acesso do Supabase. Como é longa e aleatória,
> o risco é baixo. Se quiser trocar, basta atualizar o secret e a URL na Guru.

## Variáveis de ambiente

| Secret | Descrição |
|---|---|
| `GURU_TOKEN` ou `GURU_API_TOKEN` | Chave da URL (`?key=...`) |
| `RESEND_API_KEY` | API key do Resend |
| `FROM_EMAIL` | Remetente verificado no Resend |
| `APP_STORE_URL` | Opcional. Padrão: link da App Store do Corredor Sem Dor |

## Configurar na Guru

1. Painel da Guru → **Configurações** → **Webhooks** (ou **Postback**).
2. URL: `https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/guru-webhook`
3. Token: o mesmo valor de `GURU_TOKEN`.
4. Eventos: compra aprovada, reembolso, chargeback, cancelamento e expiração.

## Deploy

```bash
supabase functions deploy guru-webhook --no-verify-jwt
```
