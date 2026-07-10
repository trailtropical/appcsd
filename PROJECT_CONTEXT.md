# PROJECT CONTEXT — Corredor Sem Dor (CSD)

> Arquivo único (`index.html`, ~1734 linhas) — HTML + CSS + JS embutidos.
> Deploy: `https://github.com/trailtropical/appcsd`

---

## 1. ARQUITETURA

### Tipo de Aplicação
SPA monolítica em arquivo único. Sem frameworks, sem build tools.

**Dependências externas:**
- Google Fonts (Inter 400–800, Syne 700–800) via CDN
- ConverteAI SmartPlayer (vídeos dos testes via iframe + SDK JS)

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
| `ex-detail` (overlay) | Detalhe do exercício |

### Componentes de UI
- Top Bar (navegação superior)
- Progress Bar + Dots (testes)
- Chat Area (onboarding)
- Checkbox List (testes)
- Score Ring (SVG animado — índice 0–100)
- Subscores Grid (5 categorias com barras)
- Body Map (SVG com dots coloridos)
- Exercise Cards (tag, descrição, "por quê")
- Plan Weeks (accordion)
- Bonus Cards + Detail
- Report Blocks

---

## 2. FLUXO DO APLICATIVO

```
LOGIN → DASHBOARD (vazio) → WELCOME → ONBOARDING (7 perguntas chat)
  → CHECK-UP (7 testes com vídeo) → RELATÓRIO → POR QUE SEU PLANO É DIFERENTE
  → PLANO DE RECUPERAÇÃO → SESSÃO → EXERCÍCIO (overlay)
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
1. Agachamento (mobilidade tornozelo/quadril)
2. Elevação Pélvica (força glúteo)
3. Equilíbrio Unilateral (propriocepção — define nível init/mid/adv)
4. Elevação Panturrilha (força + mobilidade)
5. Step-down (controle motor quadril)
6. Rotação Quadril 90/90 (mobilidade quadril)
7. Teste de Thomas (flexores quadril)

### Motor de Decisão
1. Respostas dos testes → sinais (ex: "calc" → `tornozelo`)
2. `signalCounts` acumula contagem por sinal
3. `criticalSignal` = sinal com maior contagem
4. `SIGNAL_MAP` mapeia sinal → exercícios por sessão (A/B/C)
5. Sessão montada: críticos primeiro → outros específicos → completar com gerais (4–5 total)
6. Sem duplicatas por nome entre específicos e gerais

### Índice Corporal (0–100)
5 categorias: mobilidade, estabilidade, controle motor, propulsão, equilíbrio
```
score[cat] = max(0, (1 - pontosNegativos / max) × 100)
overall = média das 5 categorias
```

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
| `csd_sessoes` | JSON | Exercícios por sessão `[[a],[b],[c]]` |
| `csd_lastScores` | JSON | Scores anteriores (reavaliação) |

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
| `currentPlanMonth` | Mês ativo (0–2) |
| `currentPlanWeek` | Semana expandida |

### Estruturas Principais
- **TESTS** — 7 objetos com id, título, vídeo (ConverteAI embed), opções com sinais
- **EX** — ~30 exercícios (7 gerais `g_*` + 23 específicos `e_*`), 3 níveis (di/dm/da)
- **SIGNAL_MAP** — sinal → exercícios por sessão A/B/C
- **CATEGORY_MAP** — teste/opção → categorias corporais
- **ONBOARDING** — 7 perguntas com tipos e condições
- **CONSEQUENCES** — sinais → causa, efeito, prioridade
- **PLAN_MONTHS** — 3 meses (Mês 1 ativo, 2–3 bloqueados)
- **BONUSES** — 3 itens (Ritual, Recuperação, Evolução)

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
- Animações: classes `.fade-in`, delays `d1`–`d4`
- CSS: dark theme (`#0F0F0E`), acento laranja (`#E8500A`)
- Layout: max-width 430px centralizado (mobile-first)

---

## 5. DECISÕES DE UX

### Design
- Tema escuro profundo (estilo app premium)
- Acento laranja consistente em CTAs
- Cards flat (sem sombras), borda sutil
- SVG inline para Score Ring e Body Map
- Paleta de cores por domínio (vermelho=tornozelo, verde=ok, roxo=propriocepção, etc.)

### Engajamento
- Chat simulado no onboarding (psicologia de conversa)
- Typewriter animation (expectativa e ritmo)
- Score Ring animado (impacto visual)
- Body Map SVG (representação visual intuitiva)
- "Por quê" em cada exercício (aumenta adesão)
- Contador de reavaliação 30 dias (gamificação)
- Mensagem "Já tenho uma hipótese" antes do check-up (expectativa)

### Animações
- fadeIn de baixo para cima (0.4s) com delays escalonados
- msgIn no chat (0.25s slide-up)
- typingDot (0.8s)
- Transições de onboarding: slide-up + fade-out
- Progress fill (0.4s cubic-bezier)
- Score ring stroke-dashoffset (0.8s)
- Accordion weeks (rotação 180deg, 0.2s)

---

## 6. ESTADO DE IMPLEMENTAÇÃO

### Funcional
- Login MVP (sem auth real)
- Dashboard (vazio + com dados)
- Onboarding chat (7 perguntas, typing, single/multi/slider)
- Check-up (7 testes, vídeos ConverteAI, checkboxes)
- Cálculo do índice corporal (5 categorias)
- Motor de decisão (sinais → exercícios personalizados)
- Relatório narrativo (queixa, hipótese, sinais, conclusão)
- "Por que é diferente" (evidências)
- Plano Mês 1 (4 semanas × 3 sessões, exercícios dinâmicos)
- Sessão detalhada (4–5 exercícios, priorização, geração dinâmica)
- Exercício detalhe (overlay com vídeo, séries, "por quê")
- Exercícios com progressão (init/mid/adv)
- Mix geral + específico (sem duplicatas)
- Bônus (3 itens + detalhe)
- Reavaliação (comparativo antes/depois)
- Countdown 30 dias no dashboard
- Persistência completa via localStorage
- Body Map SVG com 4 regiões
- Vídeos dos testes (ConverteAI embed)

### Parcial
- Mês 2 e 3 bloqueados (sem conteúdo real)
- Sem autenticação real
- Sem backend

---

## 7. PENDÊNCIAS

### Críticas
- Login sem autenticação real
- Dados apenas em localStorage (sem sync com servidor)
- Mês 2 e 3 do plano sem exercícios

### Alta Prioridade
- Sem tracking de treinos completados (checkbox "feito" + streak)
- Arquivo monolítico (1734 linhas) — considerar separar em módulos
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
