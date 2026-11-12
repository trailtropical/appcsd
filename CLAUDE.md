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
git status            # confira: nada de keystore, PDF, planilha ou documento interno
git add <arquivos>    # adicione só o que mudou — evite `git add -A`
git commit -m "..." && git push origin main
```
**Tudo que entra no git fica público** em `trailtropical.github.io/appcsd/<arquivo>` (inclusive `.md` e `.sql`).
GitHub Pages publica `main` em ~1 min. Sempre confira com:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://trailtropical.github.io/appcsd/
```

**Cache:** `index.html` tem um cache-buster na linha 7: `const v='34'`. **Ao publicar mudanças no app, incremente esse número** (`v='35'`, ...). Sem isso, alunos com o PWA instalado continuam vendo a versão antiga. Também existe `sw.js` com `CACHE_NAME = 'csd-v19'` (só assets estáticos).

### Versão mínima do app nativo
- `index.html` tem `const APP_BUILD = 5`: **aumente a cada build nova enviada às lojas**. É um contador próprio do app (não precisa bater com o build da Apple nem com o versionCode do Android).
- O app nativo lê `app-config.json` (no site). Se `APP_BUILD < min_build`, mostra "Atualize o app" com o link da loja. Para forçar atualização, suba `min_build` e publique. Falha de rede deixa entrar.
- Só funciona a partir da build que tem esse código (APP_BUILD 5). Builds antigas (iOS 1.0 b3, Android vc4) não fazem a checagem.

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
| `native-app/` | Projeto Capacitor (iOS + Android) — `native-app/android` **não está no git** (ignorado no `.gitignore`) |
| `PROJECT_CONTEXT.md`, `DATA_FLOW.md` | Docs profundos, porém **históricos (jul/2026)** — descrevem o app antes de Supabase Auth, pagamentos e apps nativos. Servem só como referência de lógica antiga; confira sempre o código |
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
./build-www.sh              # monta www/ a partir do index.html, esconde UI de instalação e troca textos sobre compra por textos neutros (falha se não achar)
npx cap sync android        # copia para android/app/src/main/assets/public
```

Build do AAB (JDK 21):
```bash
cd native-app/android
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
  ./gradlew bundleRelease -PAPP_VERSION_CODE=6 -PAPP_VERSION_NAME=1.1.1
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

---

## 11. Estado atual — 12/nov/2026

> Esta seção envelhece. Atualize a data e os itens ao concluir marcos relevantes.

### No ar
- **Web/PWA:** publicado em `main` (GitHub Pages), com o fluxo novo de primeiro acesso.
- **iOS:** versão **1.0 (build 3)** publicada na App Store. **1.1.0 (build 5)** enviada para revisão da Apple em 12/nov, com lançamento automático após aprovação. A build 6 (mesmo conteúdo) também está no TestFlight, sem uso. Próximo build iOS: **7**.
- **Android:** **1.1.0 (versionCode 5)** gerada em 12/nov (`app-release.aab`), aguardando envio ao Play. Anterior: versão **1.0.1 (versionCode 4)** **aprovada e publicada na Play Store**: https://play.google.com/store/apps/details?id=br.com.corredorsemdor
- Botões "Android" (tela `s-app-download` e e-mails de compra/senha criada) apontam para a Play Store (antes: PWA).
- **Play Console:** países/regiões = **todos**; declaração de **comerciante** (DSA/UE) preenchida com Trail Tropical.
- **Páginas legais:** Política de Privacidade, Termos de Uso (`termos.html`), Suporte e Exclusão de Conta publicadas.

### Backend
- `supabase/migrations/012_access_control.sql` aplicada (tabela `purchases`, flags `password_set`/`access_blocked`, tentativas).
- Edge Functions deployadas: `first-access` (Verify JWT **off**), `hotmart-webhook`, `guru-webhook` (auth por `?key=` na URL).
- E-mails transacionais (Resend): e-mail 1 prioriza **"Criar minha senha"** com `?email=` pré-preenchido; e-mail 2 leva aos downloads.
- Edge Functions `first-access`, `hotmart-webhook` e `guru-webhook` **deployadas em 12/nov** iguais ao commit `5b15ca4` (botão Android → Play Store). O `guru-webhook` inclui o suporte a `bcc` (commit `1524a9f`), inativo: só age se o payload trouxer `bcc`/`copy_to`.

### Correções recentes
- **12/nov (web v=34):** convite "já está na App Store / no Google Play" para quem usa o site/PWA no celular (`maybeShowStoreInvite`): só a loja do aparelho, nunca no app nativo nem no computador, 1× por abertura, para após 3 "Agora não" ou ao tocar em baixar (`localStorage.csd_store_invite`).
- **12/nov (UX, web v=33):** painel com "Progresso do Mês" (12 treinos/mês; antes media só a semana e voltava a 0% ao fechar a semana) e "Semana X de 4"; relatório começa pela conclusão (`buildReportHtml` sem efeitos; `viewReport()` reabre pelo painel sem regravar); treino com tempo estimado, contador de feitos, descanso (30 s, até 1 min) e "Marcar treino como feito"; cards de exercício simplificados (nome, dose, ★ Crítico, "Ver vídeo"); cronômetro no detalhe dos exercícios em segundos; convite "Baixar App" leva às lojas; Termos nas configurações; checagem de versão mínima (`APP_BUILD`/`app-config.json`).
- **11/nov:** `admin.html` passou a reconstruir o plano com o mesmo motor do app (`effTier = max(tier, min(2, mês))`), resolvendo o caso "Copenhagen aparece no Treino C do aluno e não no painel". Também alinhados: `GEMEOS`, reforço do crítico filtrado por `!usedBefore`, fallback `baseExercisesForMonth` e preenchimento geral com giro por treino/mês.

---

## 12. Histórico resumido — 28/out a 12/nov/2026

Ordem cronológica do que foi feito (commits em `git log`):

**29/out — correções de plano**
- Reavaliação passou a avançar o mês e a não repetir exercícios do M1 (`csd_pendingReav`, tiers, anti-repetição).
- Botão de play maior (44px) no card do treino.

**5/nov — virada do modelo de acesso**
- Criado o fluxo **"Primeiro acesso" dentro do app**: valida compra aprovada no Supabase e deixa o aluno criar a senha. Fim do cadastro aberto pelo site.
- Tela de entrada com **"Primeiro acesso"** e **"Já tenho conta"**.
- `guru-webhook` criado para gravar compras da Guru e liberar acesso (a Hotmart já tinha webhook).
- Botão "Baixar na App Store" na página de marketing.

**6/nov — e-mails e pós-senha**
- E-mail de boas-vindas com botão Android (PWA).
- E-mail 1 (compra) passou a priorizar **criar senha**; e-mail 2 (senha criada) leva aos downloads.
- Nova tela `s-app-download` após criar a senha: App Store + Android + "entrar pelo navegador". No app nativo ela é escondida e o aluno entra direto.
- Suporte a `bcc` no e-mail da Guru (não deployado).

**10/nov — lojas e legal**
- Página de **Termos de Uso** criada e publicada (`/termos.html`).
- Build Android **1.0.1 / versionCode 4** gerado com os assets web atualizados.
- Play Console: países ampliados para todos, declaração de comerciante preenchida, versão promovida do teste aberto para produção.

**11–12/nov — painel admin**
- Correção do motor de plano no admin (ver seção 11).
- `CLAUDE.md` criado (este arquivo).

**Contexto operacional do período**
- Quatro alunos de cortesia/teste foram liberados manualmente via `guru-webhook` quando o primeiro acesso acusava `no_purchase` (o problema era sempre compra não vinculada ao e-mail, não o app).
- Conta demo dos revisores das lojas: `nmendes1994@gmail.com` / `123456`.

---

## 13. Próximos passos planejados

1. ~~Google Play~~ — aprovado em 12/nov.
2. ~~Botão Android → Play Store~~ — feito na web e nos e-mails (não precisou de build nativo: a tela `s-app-download` não aparece no app nativo). Edge Functions já redeployadas (12/nov).
3. **Link "Termos de Uso" nas configurações do app** — próximo build nativo (**versionCode 5**).
4. **Validar com dados reais** a divergência de plano relatada por uma aluna (comparar `sessions.signal_tiers`, `prev_signals`, `plan_month` e `checkups.answers` com o que o admin mostra). O motor já foi alinhado; falta confirmação em produção.
5. **Limpar registros de teste** do banco quando conveniente: `guru:GURU-TESTE-999`, `guru:CORTESIA-COPIA-001`, `TESTE-001`, `guru:TESTE-ACESSO-001/002/003`.
6. **Revisão jurídica** dos Termos de Uso (reembolso e responsabilidade) — recomendada, não bloqueante.
7. **Monitorar** novos casos de `no_purchase` no primeiro acesso: quase sempre é compra com e-mail diferente do informado.

### Ideias descartadas / decisões fechadas
- **Sem código de 6 dígitos** no primeiro acesso (validação é compra + `password_set` + rate limit).
- **Sem link de compra no app nativo** (política Apple).
- Após criar a senha, **não** entrar no check-up: mostrar a tela de download.
- Teste aberto do Play é **opcional**; o caminho é teste fechado → acesso à produção.
