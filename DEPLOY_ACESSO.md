# Deploy do novo fluxo de acesso (build 4)

O que muda: o aluno **não cria mais conta pelo site**. Ele baixa o app, toca em
**"Primeiro acesso"**, informa o e-mail da compra e cria a senha dentro do app.
Só e-mails com compra aprovada conseguem ativar.

> **Ordem importa.** Siga os passos na sequência abaixo. Se desligar o cadastro
> público antes de publicar o webhook, os novos compradores ficam sem conta.

---

## 1. Rodar o SQL no Supabase

1. Abra o projeto no Supabase.
2. Menu **SQL Editor** → **New query**.
3. Abra o arquivo `supabase/migrations/012_access_control.sql`, copie tudo e cole.
4. Clique em **Run**.

Isso cria a tabela `purchases`, as flags `password_set` e `access_blocked` no
perfil e a tabela de tentativas.

**Conferir:** em **Table Editor**, a tabela `purchases` deve aparecer.

---

## 2. Publicar a função `first-access`

1. Menu **Edge Functions** → **Deploy a new function**.
2. Nome: `first-access` (exatamente assim).
3. Escolha **Via Editor** (ou "Edit function").
4. Apague o conteúdo de exemplo e cole o código de
   `supabase/functions/first-access/index.ts`.
5. **Desligue** a opção **Verify JWT** (o aluno ainda não está logado).
6. Clique em **Deploy**.

Para copiar o código no Mac:

```bash
pbcopy < supabase/functions/first-access/index.ts
```

Depois é só colar no editor do Supabase.

---

## 3. Atualizar a função `hotmart-webhook`

1. Menu **Edge Functions** → `hotmart-webhook` → **Edit**.
2. Apague o conteúdo atual e cole o código de
   `supabase/functions/hotmart-webhook/index.ts`.
3. Mantenha **Verify JWT desligado**.
4. Clique em **Deploy**.

Para copiar:

```bash
pbcopy < supabase/functions/hotmart-webhook/index.ts
```

Confira em **Edge Functions → Secrets** se já existem:

- `HOTMART_TOKEN`
- `RESEND_API_KEY`
- `FROM_EMAIL`

Opcional: `APP_STORE_URL` (se não existir, usa o link oficial do app).

---

## 3.1 Publicar a função `guru-webhook` (vendas pela Guru)

A Guru **não tem campo de token** no webhook, então a chave de segurança vai na
própria URL.

1. Em **Secrets**, crie (ou atualize) `GURU_API_TOKEN` com uma chave longa.
   Se já existir, sobrescreva o valor para ter certeza de qual é.
2. Menu **Edge Functions** → `guru-webhook` → **Code**.
3. Substitua o conteúdo por `supabase/functions/guru-webhook/index.ts`.
4. **Verify JWT desligado** → **Deploy updates**.
5. No painel da Guru, no webhook, use a URL:

```
https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/guru-webhook?key=SUA_CHAVE
```

6. Deixe **apenas um webhook ativo** apontando para o Supabase, senão o aluno
   recebe dois e-mails.

A função aceita `application/json`, `application/x-www-form-urlencoded` e
`multipart/form-data`.

---

## 4. Testar antes de desligar o cadastro

1. No **SQL Editor**, crie uma compra de teste:

```sql
insert into public.purchases (email, name, product, transaction_id, status)
values ('mr.gossenheimer+teste@gmail.com', 'Teste', 'Corredor Sem Dor', 'TESTE-001', 'approved');
```

2. Abra `https://trailtropical.github.io/appcsd/` no navegador.
3. Toque em **Primeiro acesso? Criar senha**.
4. Informe `mr.gossenheimer+teste@gmail.com` e toque em **Continuar**.
5. A tela de senha deve aparecer. Crie uma senha e entre.
6. Confira se o e-mail "Sua senha foi criada" chegou (Resend).

Se funcionar, remova a compra e a conta de teste:

```sql
delete from public.purchases where transaction_id = 'TESTE-001';
```

E apague o usuário em **Authentication → Users**.

---

## 5. Desligar o cadastro público

Só faça isso **depois** que os passos 2, 3 e 4 estiverem OK.

1. Menu **Authentication** → **Sign In / Providers** → **Email**.
2. Desligue **Allow new users to sign up**.
3. Salve.

A partir daí, contas só são criadas pelo webhook da Hotmart (com a chave de
serviço), e não por qualquer pessoa.

> **Atenção:** alunos que compraram **antes** desta mudança não estão na tabela
> `purchases`. Para eles, insira a compra manualmente (e-mail + transação) ou
> reenvie o webhook pela Hotmart. Sem isso, o "Primeiro acesso" dirá que não
> encontrou a compra.

---

## 6. Build 4

Já está preparado no projeto:

- Versão: **1.0.1**
- Build: **4**
- Bundle web sincronizado com o código novo.

Para enviar:

1. Abra `native-app/ios/App/App.xcodeproj` no Xcode.
2. **Product → Archive**.
3. **Distribute App → App Store Connect → Upload**.
4. No App Store Connect, crie a versão **1.0.1** e selecione o build **4**.

Não é necessário mudar preço, classificação etária ou informações de compra.
Nas notas para a revisão, explique que o app agora valida a compra pelo e-mail.

---

## Resumo do que o aluno vê

```
E-mail da compra: "Baixar na App Store"
        ↓
Instala o app → "Primeiro acesso"
        ↓
Digita o e-mail da compra
        ↓
App confirma a compra no servidor
        ↓
Cria a senha → entra direto no check-up
```

Quem não comprou vê: *"Não encontramos uma compra com este e-mail."*
