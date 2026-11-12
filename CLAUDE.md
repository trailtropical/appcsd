# CLAUDE.md — Corredor Sem Dor (CSD)

> Contexto para agentes de IA (Claude Code, opencode, Cursor) que trabalharem neste repositório.
> Leia este arquivo antes de mexer em qualquer coisa. Ele é curto de propósito: o detalhe está nos docs linkados no fim.

---

## 1. O que é o projeto

App **Corredor Sem Dor**: avaliação funcional + plano de reabilitação para corredores, operado pela **Trail Tropical** (CNPJ 68.420.244/0001-67).

- **Web (PWA):** https://trailtropical.github.io/appcsd/ — é o produto principal
- **App nativo:** iOS (App Store, Capacitor) e Android (Play Store, Capacitor) — empacotam a mesma UI web
- **Painel admin:** `admin.html` (mesmo domínio, exige login de admin)
- **Público:** brasileiros; UI 100% em português

## 2. Stack e arquitetura (importante)

- **SPA monolítica em arquivo único**: `index.html` (~4.000 linhas) com HTML + CSS + JS embutidos. **Sem framework, sem build, sem bundler.**
- `admin.html` (~1.260 linhas) é outro arquivo único, fala direto com o Supabase.
- Backend: **Supabase** (Postgres + Auth + Edge Functions em Deno/TypeScript).
- Pagamentos/entregas: **Hotmart** e **Guru** (webhooks liberam acesso).
- E-mails transacionais: **Resend** (chamado dentro das Edge Functions).
- Deploy web: **GitHub Pages** a partir da branch `main`.

**Consequência prática:** para mudar o app, edite `index.html` diretamente. Não introduza framework, bundler, npm no site raiz, nem "refatore para React" sem pedido explícito.

## 3. Deploy

### Web
```bash
git add -A && git commit -m "..." && git push origin main
```
GitHub Pages publica `main` em ~1 min. Sempre confira com:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://trailtropical.github.io/appcsd/
```

**Cache:** `index.html` tem um cache-buster na linha 7: `const v='31'`. **Ao publicar mudanças no app, incremente esse número** (`v='32'`, ...). Sem isso, alunos com o PWA instalado continuam vendo a versão antiga. Também existe `sw.js` com `CACHE_NAME = 'csd-v19'` (só assets estáticos).

### Edge Functions
O dono do projeto **não fornece token/CLI do Supabase**. Deploy é **manual pelo dashboard**:
1. Supabase → Edge Functions → escolher a função → Edit
2. Colar o conteúdo de `supabase/functions/<nome>/index.ts`
3. Deploy
4. `first-access` precisa de **Verify JWT desligado**

Para facilitar: `pbcopy < supabase/functions/<nome>/index.ts`.

### Migrations
`supabase/migrations/*.sql` são rodadas manualmente no **SQL Editor** do Supabase. Nunca assuma que já foram aplicadas — confirme.

## 4. Mapa de arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | App inteiro (13+ telas, motor de plano, login, check-up) |
| `admin.html` | Painel: lista alunos, check-ups, plano, extras, bloqueios, notas |
| `termos.html` / `privacy-policy.html` / `suporte.html` | Páginas legais (exigidas pelas lojas) |
| `reset.html` | Redefinição de senha |
| `delete-account.html` | Exclusão de conta (exigência Apple/Google) |
| `marketing.html` | Landing de vendas |
| `sw.js`, `manifest.json`, ícones | PWA |
| `supabase/functions/` | `first-access`, `hotmart-webhook`, `guru-webhook`, `admin-data` |
| `native-app/` | Projeto Capacitor (iOS + Android) — `native-app/android` **não está no git** |
| `PROJECT_CONTEXT.md`, `DATA_FLOW.md` | Docs profundos (parcialmente desatualizados: falam de ~2.000 linhas) |
| `DEPLOY_ACESSO.md` | Passo a passo do fluxo de primeiro acesso |

## 5. Fluxo de acesso (regra de negócio central)

1. Aluno compra na Hotmart/Guru → webhook grava em `purchases` (`status = approved`)
2. Aluno baixa o app e toca em **"Primeiro acesso"**
3. Informa o e-mail da compra → `first-access` valida compra aprovada + `password_set = false` + rate limit
4. Cria a senha → recebe e-mail 2 com links de download
5. Login normal

**Sem código de 6 dígitos.** Se um aluno "não consegue criar senha", quase sempre é **falta de compra vinculada ao e-mail** (`no_purchase`). Teste rápido:

```bash
curl -sS -X POST "https://zjsadtpxdexlflfykqzy.supabase.co/functions/v1/first-access" \
  -H "Content-Type: application/json" \
  -d '{"action":"check","email":"aluno@exemplo.com"}'
```

Para liberar cortesia/teste, use o `guru-webhook` com `?key=...` (a chave está no dashboard/Vercel do dono — **não está neste repo**).

## 6. Regras de produto que NÃO podem ser quebradas

- **Nenhum link de compra, preço ou CTA comercial dentro do app nativo** (política Apple 3.1.1).
- Pós-criação de senha: **não** entrar no check-up; mostrar tela `s-app-download` (App Store + Android + "entrar pelo navegador").
- E-mail de compra: botão principal é **"Criar minha senha"**; download é secundário.
- Conteúdo de saúde: sempre deixar claro que não substitui profissional.
- Conta é pessoal/intransferível (está nos Termos).

## 7. Motor do plano: app × admin precisam ficar em sincronia

O plano de exercícios é **gerado no cliente** e reconstruído no admin. Duas cópias da mesma lógica:

| App (`index.html`) | Admin (`admin.html`) |
|---|---|
| `SIGNAL_MAP` | `SIGNAL_POOL` |
| `signalExercisesForMonth` | `sigExForMonth` |
| `getSignalTier` + `effectiveSignalTier` | `effTier` (dentro de `rebuildPlanForStudent`) |
| `baseExercisesForMonth` | `baseExercisesForMonth` |
| `getGeralOrdem` | `geralOrdemIds` |
| `GEMEOS` | `GEMEOS_PLAN` |
| preenchimento 5–6 com offset `month*3 + sessIdx*2` | idem |

**Se mudar a geração em um lado, mude no outro.** Divergência aqui já causou bug real (Copenhagen aparecia no app e não no painel, porque o admin usava o tier cru em vez de `effectiveSignalTier`).

Regra do motor: sinal **em treino** acompanha o mês do plano → `max(tier_gravado, min(2, mes))`.

## 8. Android / iOS

```bash
cd native-app
./build-www.sh              # monta www/ a partir do index.html e esconde UI de instalação
npx cap sync android        # copia para android/app/src/main/assets/public
```

Build do AAB (JDK 21):
```bash
cd native-app/android
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
  ./gradlew bundleRelease -PAPP_VERSION_CODE=5 -PAPP_VERSION_NAME=1.0.2
```
- Saída: `native-app/android/app/build/outputs/bundle/release/app-release.aab`
- **versionCode é permanente**: nunca reuse um número já enviado ao Play
- Assinatura: `android/keystore.properties` (ignorado pelo git) aponta para o keystore, que fica **fora do repositório** — nunca copie o `.jks` nem as senhas para cá
- iOS: `native-app/ios/App/App/public` é ignorado no git mas sincronizado no disco

## 9. Contas e dados úteis

- Supabase project ref: `zjsadtpxdexlflfykqzy`
- Admin: `trailtropicalpodcast@gmail.com`
- Conta demo (revisores das lojas): `nmendes1994@gmail.com` / `123456`
- Para repetir o primeiro acesso: `update public.profiles set password_set = false where email = '...'`

**Nunca** grave tokens, chaves de webhook ou senhas neste repositório (ele é público via GitHub Pages).

## 10. Convenções

- Responder e escrever código/comentários em **português**.
- Commits no padrão `tipo: descrição` (`feat:`, `fix:`, `docs:`), em português.
- Mudanças pequenas e cirúrgicas; o dono não é programador e revisa pelo comportamento.
- Sempre validar sintaxe de JS embutido antes de publicar:
  ```bash
  python3 - <<'PY'
  import re,subprocess
  s=re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>',open('admin.html').read(),re.S)[0]
  open('/tmp/s.js','w').write(s); subprocess.run(['node','--check','/tmp/s.js'])
  PY
  ```
- Depois de publicar, confirme a versão no ar por `curl`.
- Este ambiente pode não ter `rg`; use `grep`.
