# PROJECT CONTEXT — Corredor Sem Dor (CSD)

> Arquivo único (`index.html`, ~2000 linhas) — HTML + CSS + JS embutidos.
> Deploy: `https://github.com/trailtropical/appcsd`

---

## 1. ARQUITETURA

### Tipo de Aplicação
SPA monolítica em arquivo único. Sem frameworks, sem build tools.

**Dependências externas:**
- Google Fonts (Inter 400–800, Syne 700–800) via CDN
- ConverteAI SmartPlayer (vídeos dos testes e exercícios via iframe + SDK JS)

### Screens (13 telas)
| ID | Função |
|---|---|
| `s-login` | Login (MVP — qualquer email/senha) |
| `s-dashboard` | Centro de Performance (dashboard principal) |
| `s-welcome` | Boas-vindas / pré-check-up |
| `s-onboarding` | Chat com 7 perguntas |
| `s-test` | 7 testes funcionais com vídeo |
| `s-result` | Relatório de resultados |
| `s-why-plan` | "Por que seu plano é diferente" |
| `s-protocol` | Plano de Recuperação (3 meses) |
| `s-bonus` | Lista de bônus (3 itens) |
| `s-bonus-detail` | Detalhe do bônus |
| `s-reavaliacao` | Reavaliação (comparativo) |
| `s-session-detail` | Detalhe da sessão (exercícios) |
| `ex-detail` (overlay) | Detalhe do exercício (com vídeo) |

### Componentes de UI
- Top Bar (navegação superior)
- Progress Bar + Dots (testes)
- Chat Area (onboarding)
- Checkbox List (testes)
- Score Ring (SVG animado — índice 0–100)
- Subscores Grid (5 categorias com barras)
- Body Map (SVG com dots coloridos)
- Exercise Cards (checkbox, tag, descrição, "por quê")
- Plan Weeks (accordion)
- Plan Months (accordion com lock dinâmico)
- Bonus Cards + Detail
- Report Blocks
- Confetti animation (ao completar treino)

---

## 2. FLUXO DO APLICATIVO

```
LOGIN → DASHBOARD (vazio) → WELCOME → ONBOARDING (7 perguntas chat)
  → CHECK-UP (7 testes com vídeo) → RELATÓRIO → POR QUE SEU PLANO É DIFERENTE
  → PLANO DE RECUPERAÇÃO → SESSÃO → EXERCÍCIO (overlay com vídeo)
```

### Onboarding (7 perguntas)
- `painToday`: Dor hoje? (single)
- `painLocation`: Onde? (multi, condicional — só se Sim)
- `painIntensity`: Intensidade 0–10 (slider)
- `painMoment`: Quando aparece? (single, condicional)
- `painDuration`: Há quanto tempo? (single)
- `weeklyRuns`: Corre por semana? (single)
- `goal`: Objetivo? (single)

Uma pergunta por vez. Animação de slide-up ao confirmar. Typewriter no chat.

### Check-up (7 testes)
1. Agachamento completo — mobilidade tornozelo/quadril
2. Elevação Pélvica — força glúteo
3. Equilíbrio Unilateral — propriocepção (define nível init/mid/adv)
4. Elevação Panturrilha — força + mobilidade
5. Step-down — controle motor quadril
6. Rotação Quadril 90/90 — mobilidade quadril
7. Teste de Thomas — flexores quadril

### Motor de Decisão
1. Respostas dos testes → sinais (ex: "calc" → `tornozelo`)
2. `signalCounts` acumula contagem por sinal
3. `criticalSignal` = sinal com maior contagem
4. `SIGNAL_MAP` mapeia sinal → exercícios por sessão (A/B/C)
5. Sessão montada: críticos primeiro → outros específicos → completar com gerais (4–5 total)
6. Deduplicação com `Set` — nenhum exercício aparece 2x na mesma sessão

### Índice Corporal (0–100)
5 categorias: mobilidade, estabilidade, controle motor, propulsão, equilíbrio
```
score[cat] = max(0, (1 - pontosNegativos / max) × 100)
overall = média das 5 categorias
```

### Exercícios (21 total)
- 7 gerais (`g_*`): volta_mundo, cocoras, prancha, panturrilha, equilibrio, stepdown, terra
- 14 específicos (`e_*`): tornozelo (5), quadril_mob (3), glúteo (3), propriocepção (3), panturrilha (1), controle (2), flexores (2)
- 3 exercícios adicionais: agach_salto, prancha_lat, escalador
- Cada exercício tem campo `vid` (ID do player vturb) para vídeo
- Progressão por nível: di (iniciante), dm (intermediário), da (avançado)

---

## 3. DADOS E ESTADO

### localStorage
| Chave | Tipo | Descrição |
|---|---|---|
| `csd_logged` | `'1'` | Flag de login |
| `csd_checkup` | `'1'` | Check-up concluído |
| `csd_answers` | JSON | Respostas dos testes |
| `csd_nivel` | `'init'`/`'mid'`/`'adv'` | Nível |
| `csd_onboarding` | JSON | Respostas do onboarding |
| `csd_lastCheckup` | Timestamp | Data do último check-up |
| `csd_firstCheckup` | Timestamp | Data do primeiro check-up (para calcular semana) |
| `csd_sessoes` | JSON | Exercícios por sessão `[[a],[b],[c]]` |
| `csd_sessionChecks` | JSON | Checks por sessão `{sess_0:{exId:true,...}, ...}` |
| `csd_sessionExercises` | JSON | IDs dos exercícios renderizados por sessão |
| `csd_lastScores` | JSON | Scores anteriores (reavaliação) |
| `csd_planMonth` | `'0'`/`'1'`/`'2'` | Mês ativo do plano |
| `csd_reav_confirm` | `'1'` | Flag de reavaliação em andamento |

### Variáveis Globais (Runtime)
| Variável | Descrição |
|---|---|
| `currentTest` | Índice do teste atual (0–6) |
| `answers` | Respostas em memória |
| `nivel` | Nível de dificuldade |
| `criticalSignal` | Sinal crítico |
| `signalCounts` | Contagem de sinais |
| `onboardingData` | Respostas do onboarding |
| `onboardingStep` | Passo atual |
| `onboardingLocked` | Lock durante transição |
| `currentPlanMonth` | Mês ativo (0–2, persistido em localStorage) |
| `currentPlanWeek` | Semana expandida |
| `currentSessionIdx` | Índice da sessão atual (0–2) |

### Estruturas Principais
- **TESTS** — 7 objetos com id, título, vídeo (ConverteAI embed), opções com sinais
- **EX** — ~24 exercícios (7 gerais `g_*` + 17 específicos `e_*`), 3 níveis (di/dm/da), campo `vid` para vídeo
- **SIGNAL_MAP** — sinal → exercícios por sessão A/B/C
- **CATEGORY_MAP** — teste/opção → categorias corporais
- **ONBOARDING** — 7 perguntas com tipos e condições
- **CONSEQUENCES** — sinais → causa, efeito, prioridade
- **PLAN_MONTHS** — 3 meses (Mês 1 ativo, 2–3 bloqueados dinamicamente)
- **BONUSES** — 3 itens (Ritual, Recuperação, Evolução)
- **SESSION_INFO** — 3 sessões (A/B/C) com day, focus, color
- **GERAL_ORDEM** — 3 blocos de exercícios gerais

---

## 4. CONVENÇÕES DE CÓDIGO

### Nomenclatura
- Screens: `s-` + kebab-case (`s-session-detail`)
- IDs: prefixo funcional (`btn-`, `db-`, `ex-`, `sess-`)
- Funções: camelCase (`showScreen`, `renderDashboard`)
- Constantes: SCREAMING_SNAKE (`TESTS`, `SIGNAL_MAP`)
- CSS: kebab-case (`btn-primary`, `ex-card`)
- CSS vars: `--` + kebab (`--orange`, `--surface`)

### Padrões
- Renderização: `render*()` com template literals → `innerHTML`
- Navegação: `showScreen(id)` — toggle classe `.active`
- Estado: globais + localStorage
- Eventos: inline `onclick`
- Animações: classes `.fade-in`, `.sr` (scroll reveal), delays `d1`–`d4`
- CSS: dark theme (`#0F0F0E`), acento laranja (`#E8500A`)
- Layout: max-width 430px centralizado (mobile-first)
- Vídeos: `vturbEmbed(vid)` gera iframe HTML a partir do ID do player

---

## 5. DECISÕES DE UX

### Design
- Tema escuro profundo (estilo app premium)
- Acento laranja consistente em CTAs
- Cards flat (sem sombras), borda sutil
- SVG inline para Score Ring e Body Map
- Paleta de cores por domínio (vermelho=tornozelo, verde=ok, roxo=propriocepção, etc.)
- Badge de categoria em branco

### Engajamento
- Chat simulado no onboarding (psicologia de conversa)
- Typewriter animation (expectativa e ritmo)
- Score Ring animado (contagem numérica + anel SVG)
- Body Map SVG (representação visual intuitiva)
- "Por quê" em cada exercício (aumenta adesão)
- Contador de reavaliação 30 dias (gamificação)
- Checkbox nos exercícios (estado persistido)
- Confetti ao completar todos os exercícios do treino
- Mensagem "Parabéns! Treino completo." ao finalizar

### Animações Dashboard
- Barra de progresso: cresce de 0 ao valor (1.6s ease)
- Score ring: contagem numérica 0→valor (2.4s) + anel SVG (2.4s)
- Barras de categorias: crescem de 0 ao valor (1.8s ease)
- Números das categorias: contagem 0→valor (1.8s)
- Scroll reveal: elementos aparecem ao entrar no viewport (Intersection Observer)
- Timing escalonado por seção (0ms, 100ms, 200ms, etc.)

### Progressão
- Barra de progresso por semana (33% por treino concluído)
- Semana calculada pela data do primeiro checkup (7 dias por semana)
- Meses do plano desbloqueiam progressivamente (após reavaliação)
- `currentPlanMonth` persistido no localStorage

---

## 6. ESTADO DE IMPLEMENTAÇÃO

### Funcional
- Login MVP (sem auth real)
- Dashboard com animações (barra, score, categorias, scroll reveal)
- Onboarding chat (7 perguntas, typing, single/multi/slider)
- Check-up (7 testes, vídeos ConverteAI, checkboxes)
- Cálculo do índice corporal (5 categorias)
- Motor de decisão (sinais → exercícios personalizados)
- Relatório narrativo (queixa, hipótese, sinais, conclusão)
- "Por que é diferente" (evidências)
- Plano Mês 1–3 (4 semanas × 3 sessões, exercícios dinâmicos)
- Sessão detalhada (4–5 exercícios, priorização, deduplicação com Set)
- Exercício detalhe (overlay com vídeo vturb, séries, "por quê")
- Exercícios com progressão (init/mid/adv)
- Mix geral + específico (sem duplicatas)
- Checkbox nos exercícios (estado persistido, animação de check)
- Confetti ao completar treino
- Bônus (3 itens + detalhe)
- Reavaliação 30 dias (comparativo antes/depois)
- Meses do plano desbloqueiam progressivamente
- Progressão por semana (33% por treino)
- Body Map SVG com 4 regiões
- Vídeos nos exercícios (ConverteAI embed via vturbEmbed)
- 21 exercícios com vídeo mapeado

### Parcial
- Mês 2 e 3 do plano (desbloqueiam mas usam mesmos exercícios)
- Sem autenticação real
- Sem backend

---

## 7. PENDÊNCIAS

### Críticas
- Login sem autenticação real
- Dados apenas em localStorage (sem sync com servidor)

### Alta Prioridade
- Arquivo monolítico (~2000 linhas) — considerar separar em módulos
- Sem testes automatizados
- innerHTML com template literals (risco XSS)

### Média Prioridade
- Sem loading states / skeleton
- Sem animação de transição entre telas
- Sem modo offline (service worker)
- Sem acessibilidade (ARIA, contraste WCAG)
- Sem timer/cronômetro nos exercícios
- Sem compartilhamento de resultado
- Sem notificações / push
- Sem profile do usuário (nome, foto, histórico)
- Sem integração Garmin/Strava
- Dados hardcoded — mover para JSON/API

### Baixa Prioridade
- Sem feedback de erro inline (usa alert)
- Sem export de dados (PDF)
- Sem i18n (ok para mercado brasileiro)
- Sem dark/light mode toggle
- Sem versão desktop responsiva
- Sem analytics

---

*Gerado automaticamente — Julho 2026*
