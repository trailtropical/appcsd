# first-access

Valida a compra e cria a senha do aluno **dentro do app**, no primeiro acesso.

Chamada anônima (o aluno ainda não tem sessão), por isso deve ser publicada
com `--no-verify-jwt`.

## Ações

### `check`

```json
{ "action": "check", "email": "aluno@email.com" }
```

Respostas:

```json
{ "ok": true, "needs_password": true }
{ "ok": false, "code": "no_purchase" }
{ "ok": false, "code": "blocked" }
{ "ok": false, "code": "rate_limited" }
```

### `set`

```json
{ "action": "set", "email": "aluno@email.com", "password": "nova-senha" }
```

Regras:

- Só define a senha se existir compra com `status = 'approved'`.
- Só define se `profiles.password_set = false` (primeiro acesso).
- Bloqueia se `profiles.access_blocked = true` (reembolso/chargeback).
- Limite de 12 tentativas por e-mail a cada 10 minutos.
- Envia um aviso "sua senha foi criada" por e-mail (Resend).

## Deploy

```bash
supabase functions deploy first-access --no-verify-jwt
```

## Segurança

O fluxo escolhido é "e-mail + criação de senha direta", sem código de
verificação. As travas são:

1. o e-mail precisa ter compra aprovada;
2. a senha só pode ser criada uma vez (`password_set`);
3. limite de tentativas;
4. e-mail de aviso imediato para o comprador.

Se for necessário endurecer no futuro, o próximo passo é exigir um código de
6 dígitos enviado ao e-mail antes de liberar a criação da senha.
