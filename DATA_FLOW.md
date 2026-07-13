# DATA_FLOW.md — Documento Técnico Completo: Fluxo de Dados

> **Projeto:** Corredor Sem Dor (CSD)
> **Arquivo fonte:** `index.html` (~2008 linhas, SPA monolítica)
> **Deploy:** `https://github.com/trailtropical/appcsd`
> **Data:** Julho 2026
> **Público-alvo:** Arquiteto de software (Supabase/PostgreSQL)

---

## 1. VISÃO GERAL

### O que é o CSD?

O Corredor Sem Dor é um aplicativo web mobile-first que funciona como um **sistema de avaliação funcional para corredores**. O aplicativo:

1. Coleta dados pessoais do corredor (onboarding conversacional)
2. Aplica 7 testes funcionais com vídeo (check-up)
3. Calcula um "Índice Corporal" (0–100) baseado em 5 categorias biomecânicas
4. Identifica sinais de compensação muscular (diagnóstico)
5. Gera um plano personalizado de recuperação (3 meses, 3 sessões/semana)
6. Acompanha o progresso do aluno (checkbox + porcentagem)

### Fluxo Completo

```
Login (email/senha)
  ↓
Dashboard (vazio ou com dados)
  ↓
Welcome (boas-vindas)
  ↓
Onboarding (7 perguntas conversacionais)
  ↓
Check-up (7 testes com vídeo + checkboxes)
  ↓
Relatório (diagnóstico + hipótese + conclusão)
  ↓
"Por que seu plano é diferente" (evidências)
  ↓
Plano de Recuperação (3 meses × 4 semanas × 3 sessões)
  ↓
Sessão (4–5 exercícios com checkbox + vídeo)
  ↓
Detalhe do Exercício (overlay com vídeo + séries)
  ↓
Dashboard (atualizado com progresso + score + body map)
  ↓
Reavaliação (a cada 30 dias — refaz check-up)
```

---

## 2. FLUXO COMPLETO DO USUÁRIO

### 2.1 Login

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-login` |
| **Objetivo** | Autenticar o usuário (MVP — qualquer email/senha) |
| **Dados recebidos** | Email (string), Senha (string) |
| **Dados produzidos** | `csd_logged = '1'` (localStorage) |
| **Dados utilizados depois** | Nenhum (flag de controle apenas) |
| **Navegação** | → Dashboard |

### 2.2 Dashboard (primeira vez)

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-dashboard` |
| **Objetivo** | Mostrar estado atual do aluno ou convite ao check-up |
| **Dados recebidos** | `csd_checkup`, `csd_answers`, `csd_nivel`, `csd_sessoes`, `csd_sessionChecks`, `csd_planMonth`, `csd_lastCheckup`, `csd_firstCheckup` |
| **Dados produzidos** | Nenhum (somente leitura) |
| **Estado vazio** | Se `csd_checkup !== '1'`: mostra "Nenhuma avaliação ainda" + botão "Iniciar check-up" |
| **Estado com dados** | Mostra: score ring, barras de categorias, progress bar, body map, plano, bônus, countdown reavaliação |
| **Navegação** | → Welcome (check-up) / → Sessão (treino) / → Plano / → Bônus |

### 2.3 Welcome (boas-vindas)

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-welcome` |
| **Objetivo** | Preparar o usuário para o onboarding |
| **Dados recebidos** | Nenhum |
| **Dados produzidos** | Nenhum |
| **Navegação** | → Onboarding |

### 2.4 Onboarding Conversacional

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-onboarding` |
| **Objetivo** | Coletar dados pessoais do corredor |
| **Dados recebidos** | Nenhum (inicia vazio) |
| **Dados produzidos** | `onboardingData` (objeto em memória) → `csd_onboarding` (localStorage) |
| **Perguntas** | 7 (ver seção 8) |
| **Navegação** | → Check-up |

### 2.5 Check-up (7 testes)

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-test` |
| **Objetivo** | Avaliar limitações funcionais do corredor |
| **Dados recebidos** | `csd_onboarding` (para contexto no teste 1), `TESTS` (constante) |
| **Dados produzidos** | `answers` (objeto em memória) → `csd_answers` (localStorage), `nivel` → `csd_nivel`, `signalCounts`, `criticalSignal` |
| **Navegação** | → Relatório |

### 2.6 Relatório

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-result` |
| **Objetivo** | Mostrar diagnóstico completo |
| **Dados recebidos** | `answers`, `signalCounts`, `criticalSignal`, `csd_onboarding`, `calculateIndex()` |
| **Dados produzidos** | `csd_checkup = '1'`, `csd_lastCheckup`, `csd_firstCheckup`, `csd_answers`, `csd_nivel` |
| **Navegação** | → "Por que é diferente" |

### 2.7 "Por que seu plano é diferente"

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-why-plan` |
| **Objetivo** | Conectar dados do onboarding + check-up em uma narrativa |
| **Dados recebidos** | `csd_onboarding`, `signalCounts`, `criticalSignal`, `CONSEQUENCES`, `SIGNAL_MAP` |
| **Dados produzidos** | Nenhum (somente leitura) |
| **Navegação** | → Plano de Recuperação |

### 2.8 Plano de Recuperação

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-protocol` |
| **Objetivo** | Mostrar estrutura do plano (3 meses, 4 semanas, 3 sessões) |
| **Dados recebidos** | `signalCounts`, `criticalSignal`, `SIGNAL_MAP`, `currentPlanMonth` |
| **Dados produzidos** | `csd_sessoes` (exercícios por sessão), `csd_sessionExercises` |
| **Navegação** | → Sessão / → Dashboard |

### 2.9 Sessão (detalhe do treino)

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-session-detail` |
| **Objetivo** | Mostrar exercícios do dia com checkbox |
| **Dados recebidos** | `csd_sessoes`, `csd_sessionChecks`, `criticalSignal`, `SIGNAL_MAP`, `EX` |
| **Dados produzidos** | `csd_sessionChecks` (checks por exercício), `csd_sessionExercises` |
| **Navegação** | → Detalhe do Exercício / → Dashboard |

### 2.10 Detalhe do Exercício

| Aspecto | Detalhe |
|---|---|
| **Tela** | `ex-detail` (overlay) |
| **Objetivo** | Mostrar vídeo, séries, "por quê" do exercício |
| **Dados recebidos** | `EX[id]`, `nivel` (para progressão) |
| **Dados produzidos** | Nenhum |
| **Navegação** | ← Sessão (botão voltar) |

### 2.11 Reavaliação

| Aspecto | Detalhe |
|---|---|
| **Tela** | `s-reavaliacao` |
| **Objetivo** | Comparar resultados antes/depois |
| **Dados recebidos** | `csd_lastScores`, `csd_lastCheckup` |
| **Dados produzidos** | `csd_reav_confirm = '1'` (flag de reavaliação) |
| **Navegação** | → Welcome (refaz check-up) |

---

## 3. ESTRUTURA DAS TELAS

### 3.1 s-login

- **Componentes:** Logo (CSD), título, sub-título, campo email, campo senha, botão "Entrar"
- **Estados:** `login-email` (input), `login-senha` (input)
- **Eventos:** `doLogin()` no botão, Enter no campo senha
- **Navegação:** `showScreen('s-dashboard')`

### 3.2 s-dashboard

- **Componentes:** Hero (título + phase), Next Session Card, Progress Bar, Score Ring (SVG), Subscores (5 barras), Meta (índice atual → meta), Countdown reavaliação, Body Map (SVG), Plan Months (accordion), Última avaliação, Botão bônus
- **Estados:** `db-content` (innerHTML dinâmico), `db-phase` (innerHTML)
- **Eventos:** `goToSession(idx)`, `showPlan()`, `showBonuses()`, `showReavaliacao()`, `togglePlanMonth(idx)`
- **Navegação:** → Sessão, → Plano, → Bônus, → Reavaliação

### 3.3 s-welcome

- **Componentes:** Hero (eyebrow, título, sub), Stats Grid (4 boxes), Info Card (3 itens), CTA "Iniciar check-up"
- **Estados:** Nenhum
- **Eventos:** `startOnboarding()`
- **Navegação:** → Onboarding

### 3.4 s-onboarding

- **Componentes:** Top bar (voltar + progresso), Chat Area (mensagens + opções), Opções (single/multi/slider)
- **Estados:** `onboardingData` (objeto), `onboardingStep` (índice), `onboardingLocked` (boolean)
- **Eventos:** `selectOnbOpt(id, val)`, `toggleMultiOpt(id, val, el)`, `confirmMultiOpt(id)`, `goBackOnboarding()`
- **Navegação:** → Check-up

### 3.5 s-test

- **Componentes:** Top bar (voltar + label), Progress Bar + Dots, Context (queixa do onboarding), Video Placeholder, Checkbox List (opções), Botão "Próximo teste"
- **Estados:** `currentTest` (índice), `answers` (objeto)
- **Eventos:** `toggleOpt(testId, opt, row, allOptions)`, `nextTest()`, `goBack()`
- **Navegação:** → Próximo teste / → Relatório

### 3.6 s-result

- **Componentes:** Top bar, Report Content (innerHTML dinâmico)
- **Estados:** `report-content` (innerHTML)
- **Eventos:** `showWhyPlan()`
- **Navegação:** → "Por que é diferente"

### 3.7 s-why-plan

- **Componentes:** Top bar, Why List (itens com check), Why Conclusion
- **Estados:** `why-list` (innerHTML), `why-conclusion` (innerHTML)
- **Eventos:** `showPlan()`
- **Navegação:** → Plano

### 3.8 s-protocol

- **Componentes:** Top bar (badge + mês), Plan Months (botões), Plan View (innerHTML dinâmico)
- **Estados:** `currentPlanMonth`, `currentPlanWeek`, `plan-view` (innerHTML)
- **Eventos:** `switchPlanMonth(idx)`, `togglePlanWeek(idx)`, `showSessionFromPlan(idx)`
- **Navegação:** → Sessão / → Dashboard

### 3.9 s-session-detail

- **Componentes:** Top bar (voltar ⌂ + label + badge), Botões Treino A/B/C, Exercise Cards (com checkbox)
- **Estados:** `currentSessionIdx`, `sessao-exercises` (innerHTML)
- **Eventos:** `toggleExCheck(exId, el)`, `showExerciseDetail(id)`, `showSessionFromPlan(idx)`
- **Navegação:** → Detalhe do Exercício / → Dashboard

### 3.10 ex-detail (overlay)

- **Componentes:** Top bar (voltar + label + badge), Video (iframe ConverteAI), Body (nome, séries, why)
- **Estados:** `open` (classe CSS)
- **Eventos:** `closeExDetail()`
- **Navegação:** ← Sessão

### 3.11 s-bonus

- **Componentes:** Top bar, Bonus Grid (3 cards)
- **Estados:** `bonus-grid` (innerHTML)
- **Eventos:** `showBonusDetail(idx)`
- **Navegação:** → Detalhe do Bônus / → Dashboard

### 3.12 s-bonus-detail

- **Componentes:** Top bar (voltar + label), Bonus Content (innerHTML)
- **Estados:** `bonus-detail-content` (innerHTML)
- **Eventos:** Nenhum (somente voltar)
- **Navegação:** ← Bônus

### 3.13 s-reavaliacao

- **Componentes:** Top bar, Reavaliação Compare (innerHTML)
- **Estados:** `reav-compare` (innerHTML)
- **Eventos:** `startReavaliacao()`
- **Navegação:** → Welcome (refaz check-up)

---

## 4. COMPONENTES

### 4.1 Score Ring (SVG)

- **Props:** `overall` (0–100)
- **Estados:** `stroke-dashoffset` (animado via JS)
- **Eventos:** Nenhum
- **Dependências:** `calculateIndex()`
- **Utilizado por:** Dashboard

### 4.2 Subscores (barras de categorias)

- **Props:** `scores` (objeto com 5 categorias)
- **Estados:** `width` (animado via JS)
- **Eventos:** Nenhum
- **Dependências:** `calculateIndex()`, `CATEGORY_INFO`
- **Utilizado por:** Dashboard

### 4.3 Body Map (SVG)

- **Props:** `signalCounts` (objeto)
- **Estados:** Cor dos dots (baseada em severidade)
- **Eventos:** Nenhum
- **Dependências:** `getBodyStatus()`, `signalCounts`, `criticalSignal`
- **Utilizado por:** Dashboard

### 4.4 Exercise Card

- **Props:** `exId`, `num`, `isEspecifico`, `isCritico`
- **Estados:** `checked` (classe CSS), `done` (no checkbox)
- **Eventos:** `toggleExCheck()`, `showExerciseDetail()`
- **Dependências:** `EX[id]`, `getDetail(ex)`, `nivel`
- **Utilizado por:** Session Detail

### 4.5 Progress Bar

- **Props:** `progressPct` (0–100)
- **Estados:** `width` (animado via JS)
- **Eventos:** Nenhum
- **Dependências:** `getCompletionPct()`
- **Utilizado por:** Dashboard

### 4.6 Plan Months (accordion)

- **Props:** `currentPlanMonth`
- **Estados:** `active` (classe CSS), `locked` (classe CSS)
- **Eventos:** `togglePlanMonth(idx)`
- **Dependências:** `PLAN_MONTHS`, `currentPlanMonth`
- **Utilizado por:** Dashboard

### 4.7 Chat Message (onboarding)

- **Props:** `type` (system/user), `text`
- **Estados:** Animação (typing dots, fade-in)
- **Eventos:** Nenhum
- **Dependências:** `typeText()`
- **Utilizado por:** Onboarding

### 4.8 Checkbox List (testes)

- **Props:** `options` (array de opções do teste)
- **Estados:** `checked` (classe CSS)
- **Eventos:** `toggleOpt()`
- **Dependências:** `TESTS[idx].options`
- **Utilizado por:** Check-up

### 4.9 Confetti Animation

- **Props:** Nenhuma
- **Estados:** Posição, cor, delay (aleatórios)
- **Eventos:** Nenhum (auto-destroy após 2s)
- **Dependências:** Nenhuma
- **Utilizado por:** Session Detail (ao completar treino)

### 4.10 Overlay (ex-detail)

- **Props:** Nenhuma
- **Estados:** `open` (classe CSS)
- **Eventos:** `closeExDetail()`
- **Dependências:** `EX[id]`, `vturbEmbed(vid)`
- **Utilizado por:** Session Detail

---

## 5. OBJETOS DE DADOS

### 5.1 TESTS (constante global)

Array de 7 objetos. Cada objeto representa um teste funcional.

```javascript
{
  id: string,           // ID único (ex: 'agachamento', 'pelvica')
  eyebrow: string,      // Label acima do título (ex: 'Teste 1 — Mobilidade')
  title: string,        // Título do teste (ex: 'Agachamento completo (cócora)')
  video: string,        // Nome do vídeo (label)
  videoEmbed: string,   // HTML do iframe ConverteAI
  videoScript: string,  // URL do SDK JS
  hint: string,         // Dica para o usuário
  options: Array<{      // Opções de resposta
    id: string,         // ID da opção (ex: 'calc', 'fundo', 'ok')
    label: string,      // Texto principal
    sub: string,        // Texto secundário
    signals: string[],  // Sinais ativados (ex: ['tornozelo'])
    ok?: boolean        // Se true = sem problema
  }>
}
```

**Onde é criado:** Linha 621 (constante)
**Onde é alterado:** Nunca (imutável)
**Onde é utilizado:** `loadTest()`, `toggleOpt()`, `nextTest()`, `getActiveSignals()`, `showReport()`, `calculateIndex()`

### 5.2 CATEGORY_MAP (constante global)

Mapeia teste/opção → categorias corporais afetadas.

```javascript
{
  [testId: string]: {
    [optId: string]: string[]  // Array de categorias (ex: ['mobilidade', 'estabilidade'])
  }
}
```

**Categorias possíveis:** `mobilidade`, `estabilidade`, `controle_motor`, `propulsao`, `equilibrio`

**Onde é criado:** Linha 690
**Onde é alterado:** Nunca
**Onde é utilizado:** `calculateIndex()`

### 5.3 CATEGORY_INFO (constante global)

Metadados de cada categoria do índice corporal.

```javascript
{
  [category: string]: {
    label: string,    // Nome legível (ex: 'Mobilidade')
    color: string,    // Cor hex (ex: '#38BDF8')
    max: number       // Pontuação máxima possível (ex: 7)
  }
}
```

**Categorias:** mobilidade (max:7), estabilidade (max:5), controle_motor (max:5), propulsao (max:4), equilibrio (max:2)

**Onde é criado:** Linha 713
**Onde é alterado:** Nunca
**Onde é utilizado:** `calculateIndex()`, `renderDashboard()`

### 5.4 CATEGORY_ORDER (constante global)

Ordem fixa das categorias.

```javascript
['mobilidade', 'estabilidade', 'controle_motor', 'propulsao', 'equilibrio']
```

**Onde é criado:** Linha 720
**Onde é alterado:** Nunca
**Onde é utilizado:** `calculateIndex()`, `renderDashboard()`

### 5.5 CONSEQUENCES (constante global)

Mapeia sinal → causa, efeito, prioridade (para relatório e dashboard).

```javascript
{
  [signal: string]: {
    priority: string,   // Texto de prioridade (ex: 'Restaurar mobilidade do tornozelo')
    cause: string,      // Explicação da causa
    effect: string      // Explicação do efeito
  }
}
```

**Sinais:** tornozelo, quadril_mob, gluteo, propriocepcao, panturrilha, quadril_forca, flexores

**Onde é criado:** Linha 723
**Onde é alterado:** Nunca
**Onde é utilizado:** `showReport()`, `showWhyPlan()`, `getPersonalizedMsg()`, `renderDashboard()`

### 5.6 EX (constante global)

Mapa de todos os exercícios (~24 itens). Chave = ID do exercício.

```javascript
{
  [exerciseId: string]: {
    name: string,       // Nome do exercício
    di: string|null,    // Instrução nível iniciante
    dm: string,         // Nível intermediário (padrão)
    da: string,         // Nível avançado
    tag: string,        // Label da categoria (ex: 'tornozelo')
    tc: string,         // Chave de cor (ex: 'torn')
    why: string,        // Por quê esse exercício
    vid?: string,       // ID do player vturb (opcional)
    adv_only?: boolean  // Se true, só aparece nível avançado
  }
}
```

**Prefixos:**
- `g_*` = exercício geral (7 itens): g_volta_mundo, g_cocoras, g_prancha, g_panturrilha, g_equilibrio, g_stepdown, g_terra
- `e_*` = exercício específico (17 itens): e_cocoras, e_meio_ajoel, e_pe_fechado, e_agach_ponta, e_saltos_quad, e_volta_mundo, e_noventa, e_iliopsoas, e_elev_pelv, e_coice, e_bulg, e_prop_fechado, e_prop_ponta, e_prop_step, e_plant, e_step_esp, e_skatista, e_iliopsoas_esp, e_agach_salto, e_prancha_lat, e_escalador

**Onde é criado:** Linha 753
**Onde é alterado:** Nunca
**Onde é utilizado:** `renderExCard()`, `showExerciseDetail()`, `showSessionFromPlan()`, `renderPlanView()`

### 5.7 SIGNAL_MAP (constante global)

Mapeia sinal → exercícios por sessão (A/B/C).

```javascript
{
  [signal: string]: {
    label: string,          // Nome legível
    color: string,          // Cor CSS
    a: string[],            // Exercícios sessão A
    b: string[],            // Exercícios sessão B
    c: string[]             // Exercícios sessão C
  }
}
```

**Sinais:** tornozelo, quadril_mob, gluteo, propriocepcao, panturrilha, quadril_forca, flexores

**Onde é criado:** Linha 802
**Onde é alterado:** Nunca
**Onde é utilizado:** `renderPlanView()`, `showSessionFromPlan()`, `getActiveSignals()`, `showReport()`, `showWhyPlan()`

### 5.8 SIGNAL_ORDER (constante global)

Ordem de prioridade dos sinais.

```javascript
['tornozelo', 'quadril_mob', 'gluteo', 'propriocepcao', 'panturrilha', 'quadril_forca', 'flexores']
```

**Onde é criado:** Linha 819
**Onde é alterado:** Nunca
**Onde é utilizado:** `getActiveSignals()` (para determinar criticalSignal)

### 5.9 GERAL_ORDEM (constante global)

Exercícios gerais organizados por bloco.

```javascript
[
  {bloco: string, ids: string[]},
  ...
]
```

**Onde é criado:** Linha 821
**Onde é alterado:** Nunca
**Onde é utilizado:** `showSessionFromPlan()` (para completar sessão com exercícios gerais)

### 5.10 SESSION_INFO (constante global)

Metadados de cada sessão.

```javascript
[
  {day: string, focus: string, color: string},
  ...
]
```

**Onde é criado:** Linha 827
**Onde é alterado:** Nunca
**Onde é utilizado:** `showSessionFromPlan()`, `renderDashboard()`, `renderPlanWeek()`

### 5.11 BONUSES (constante global)

Lista de bônus.

```javascript
[
  {
    id: string,
    icon: string,
    css: string,
    title: string,
    desc: string,
    items: string[]
  },
  ...
]
```

**Onde é criado:** Linha 833
**Onde é alterado:** Nunca
**Onde é utilizado:** `renderBonuses()`, `showBonusDetail()`

### 5.12 ONBOARDING (constante global)

Perguntas do onboarding.

```javascript
[
  {
    id: string,         // Chave da resposta (ex: 'painToday')
    q: string,          // Pergunta (HTML)
    type: string,       // 'single' | 'multi' | 'slider'
    opts?: string[],    // Opções (para single/multi)
    min?: number,       // Mínimo (para slider)
    max?: number,       // Máximo (para slider)
    show?: function     // Condição de exibição
  },
  ...
]
```

**Onde é criado:** Linha 846
**Onde é alterado:** Nunca
**Onde é utilizado:** `renderOnboardingStep()`, `renderOptions()`

### 5.13 PLAN_MONTHS (constante global)

Estrutura do plano de 3 meses.

```javascript
[
  {
    id: number,
    label: string,
    title: string,
    desc: string,
    goal: string,
    locked?: boolean
  },
  ...
]
```

**Onde é criado:** Linha 1515
**Onde é alterado:** Nunca
**Onde é utilizado:** `renderDashboard()`, `renderPlanMonths()`, `renderPlanView()`

### 5.14 VTURB_BASE (constante global)

URL base do ConverteAI SmartPlayer.

```javascript
'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/'
```

**Onde é criado:** Linha 748
**Onde é alterado:** Nunca
**Onde é utilizado:** `vturbEmbed()`

### 5.15 TAG_COLORS (constante global)

Estilos CSS para tags de exercício.

```javascript
{
  torn: string,   // ex: 'color:var(--torn);border-color:var(--torn)'
  qmob: string,
  glut: string,
  prop: string,
  pant: string,
  qfor: string,
  flex: string
}
```

**Onde é criado:** Linha 1169
**Onde é alterado:** Nunca
**Onde é utilizado:** `renderExCard()`

### 5.16 onboardingData (variável global)

Respostas do onboarding em memória.

```javascript
{
  painToday?: 'Sim' | 'Não',
  painLocation?: string[],     // ex: ['Joelho', 'Quadril']
  painIntensity?: number,      // 0–10
  painMoment?: string,         // ex: 'Durante a corrida'
  painDuration?: string,       // ex: '1–3 meses'
  weeklyRuns?: string,         // ex: '3'
  goal?: string                // ex: 'Correr sem dor'
}
```

**Onde é criado:** `startOnboarding()` (linha 1789) — inicializado como `{}`
**Onde é alterado:** `selectOnbOpt()`, `toggleMultiOpt()`
**Onde é utilizado:** `renderOnboardingStep()`, `finishOnboarding()`, `showReport()`, `showWhyPlan()`, `loadTest()` (contexto no teste 1)
**Persistência:** `csd_onboarding` (localStorage)

### 5.17 answers (variável global)

Respostas dos testes do check-up.

```javascript
{
  [testId: string]: string[]   // Array de IDs das opções marcadas
}
```

**Exemplo:** `{ agachamento: ['calc'], pelvica: ['ok'], equilibrio: ['fechado_fail'], ... }`

**Onde é criado:** `startCheckup()` (linha 1231) — inicializado como `{}`
**Onde é alterado:** `toggleOpt()`
**Onde é utilizado:** `calculateIndex()`, `getActiveSignals()`, `showReport()`, `loadTest()` (restaurar estado)
**Persistência:** `csd_answers` (localStorage)

### 5.18 nivel (variável global)

Nível de dificuldade do exercício.

```javascript
'init' | 'mid' | 'adv'
```

**Onde é criado:** `startCheckup()` — valor padrão `'mid'`
**Onde é alterado:** `nextTest()` — baseado na resposta do teste 3 (equilíbrio):
  - `'aberto_fail'` → `'init'`
  - `'fechado_fail'` → `'mid'`
  - `'ok'` → `'adv'`
**Onde é utilizado:** `getDetail(ex)`, `renderExCard()`, `showExerciseDetail()`
**Persistência:** `csd_nivel` (localStorage)

### 5.19 signalCounts (variável global)

Contagem de sinais detectados.

```javascript
{
  [signal: string]: number   // ex: { tornozelo: 2, gluteo: 1 }
}
```

**Onde é criado:** `getActiveSignals()` (linha 1348)
**Onde é alterado:** `getActiveSignals()` (recalculado a cada chamada)
**Onde é utilizado:** `renderDashboard()`, `renderPlanView()`, `renderBodyMap()`, `showReport()`, `showWhyPlan()`

### 5.20 criticalSignal (variável global)

Sinal com maior contagem.

```javascript
string | null   // ex: 'tornozelo'
```

**Onde é criado:** `getActiveSignals()` (linha 1364)
**Onde é alterado:** `getActiveSignals()` (recalculado)
**Onde é utilizado:** `renderDashboard()`, `renderPlanView()`, `showSessionFromPlan()`, `showReport()`, `showWhyPlan()`, `getBodyStatus()`, `renderBodyMap()`

### 5.21 currentTest (variável global)

Índice do teste atual (0–6).

**Onde é criado:** `startCheckup()` — valor 0
**Onde é alterado:** `nextTest()`, `goBack()`
**Onde é utilizado:** `loadTest()`, `nextTest()`

### 5.22 currentPlanMonth (variável global)

Mês ativo do plano (0–2).

**Onde é criado:** Parse de `csd_planMonth` (localStorage) ou 0
**Onde é alterado:** `switchPlanMonth()`, `showReport()` (após reavaliação)
**Onde é utilizado:** `renderDashboard()`, `renderPlanMonths()`, `renderPlanView()`
**Persistência:** `csd_planMonth` (localStorage)

### 5.23 currentPlanWeek (variável global)

Semana expandida no accordion (0–3 ou -1 para fechado).

**Onde é criado:** `showPlan()` — valor 0
**Onde é alterado:** `togglePlanWeek()`
**Onde é utilizado:** `renderPlanWeeks()`

### 5.24 currentSessionIdx (variável global)

Índice da sessão atual (0–2).

**Onde é criado:** `showSessionFromPlan()` — valor do parâmetro
**Onde é alterado:** `showSessionFromPlan()`
**Onde é utilized:** `toggleExCheck()`, `showSessionFromPlan()`

---

## 6. ESTADOS GLOBAIS

### Variáveis de Estado Global

| Variável | Tipo | Mutável | Quem altera | Quem consome |
|---|---|---|---|---|
| `currentTest` | number (0–6) | Sim | `startCheckup`, `nextTest`, `goBack` | `loadTest`, `nextTest` |
| `answers` | object | Sim | `startCheckup`, `toggleOpt` | `calculateIndex`, `getActiveSignals`, `showReport`, `loadTest` |
| `nivel` | string | Sim | `startCheckup`, `nextTest` | `getDetail`, `renderExCard`, `showExerciseDetail` |
| `criticalSignal` | string\|null | Sim | `getActiveSignals` | `renderDashboard`, `renderPlanView`, `showSessionFromPlan`, `showReport`, `getBodyStatus` |
| `signalCounts` | object | Sim | `getActiveSignals` | `renderDashboard`, `renderPlanView`, `renderBodyMap`, `showReport` |
| `onboardingData` | object | Sim | `startOnboarding`, `selectOnbOpt`, `toggleMultiOpt` | `renderOnboardingStep`, `finishOnboarding`, `showReport`, `showWhyPlan` |
| `onboardingStep` | number | Sim | `startOnboarding`, `selectOnbOpt` | `renderOnboardingStep` |
| `onboardingLocked` | boolean | Sim | `startOnboarding`, `selectOnbOpt` | `selectOnbOpt`, `goBackOnboarding` |
| `currentPlanMonth` | number (0–2) | Sim | `showReport`, `switchPlanMonth` | `renderDashboard`, `renderPlanMonths`, `renderPlanView` |
| `currentPlanWeek` | number (-1–3) | Sim | `togglePlanWeek` | `renderPlanWeeks` |
| `currentSessionIdx` | number (0–2) | Sim | `showSessionFromPlan` | `toggleExCheck`, `showSessionFromPlan` |

### Fluxo de Alterações

```
Login
  → csd_logged = '1'

Dashboard (leitura)
  → Ler csd_checkup, csd_answers, csd_nivel, csd_sessoes, etc.
  → Recalcular: calculateIndex(), getActiveSignals(), getCompletionPct()

Onboarding (escrita)
  → onboardingData[id] = val
  → ao final: csd_onboarding = JSON.stringify(onboardingData)

Check-up (escrita)
  → answers[testId] = [optIds]
  → after test 3: nivel = 'init'|'mid'|'adv'
  → after all tests: csd_checkup = '1', csd_answers, csd_nivel, csd_lastCheckup

Relatório (leitura + escrita)
  → Ler: answers, csd_onboarding
  → Calcular: calculateIndex(), getActiveSignals()
  → Gravar: csd_checkup, csd_lastCheckup, csd_firstCheckup, csd_answers, csd_nivel

Plano (escrita)
  → Calcular sessões baseado em signalCounts + criticalSignal + SIGNAL_MAP
  → Gravar: csd_sessoes

Sessão (leitura + escrita)
  → Ler: csd_sessoes, csd_sessionChecks
  → Gravar: csd_sessionChecks, csd_sessionExercises
```

---

## 7. FLUXO DOS DADOS

### 7.1 Resposta do Onboarding

```
Usuário clica em opção
  ↓
selectOnbOpt(id, val)
  ↓
onboardingData[id] = val (em memória)
  ↓
Animação slide-up + fade-out
  ↓
onboardingStep++
  ↓
renderOnboardingStep() (próxima pergunta)
  ↓
[ao final] finishOnboarding()
  ↓
localStorage.setItem('csd_onboarding', JSON.stringify(onboardingData))
  ↓
startCheckup()
```

**Dados influenciados:**
- `csd_onboarding` → usado em `showReport()`, `showWhyPlan()`, `loadTest()` (contexto teste 1)

### 7.2 Resposta do Check-up

```
Usuário clica em opção
  ↓
toggleOpt(testId, opt, row, allOptions)
  ↓
answers[testId] = [optIds] (em memória)
  ↓
[após teste 3] nivel = 'init'|'mid'|'adv'
  ↓
[após todos] showReport()
  ↓
getActiveSignals() → signalCounts, criticalSignal
  ↓
calculateIndex() → overall, scores, raw
  ↓
localStorage.setItem('csd_checkup', '1')
localStorage.setItem('csd_lastCheckup', Date.now())
localStorage.setItem('csd_firstCheckup', Date.now())  // só primeira vez
localStorage.setItem('csd_answers', JSON.stringify(answers))
localStorage.setItem('csd_nivel', nivel)
```

**Dados produzidos:**
- `csd_checkup` → controla se dashboard mostra dados ou estado vazio
- `csd_lastCheckup` → usado para countdown de reavaliação (30 dias)
- `csd_firstCheckup` → usado para calcular semana atual
- `csd_answers` → usado para restaurar estado do check-up
- `csd_nivel` → usado para selecionar progressão dos exercícios

### 7.3 Cálculo do Índice Corporal

```
calculateIndex()
  ↓
Para cada teste respondido em answers:
  Para cada opção marcada:
    Buscar em CATEGORY_MAP[testId][optId]
    Incrementar cats[categoria]
  ↓
Para cada categoria:
  score[cat] = max(0, (1 - cats[cat] / CATEGORY_INFO[cat].max) × 100)
  ↓
overall = média dos 5 scores
  ↓
Retorna { overall, scores, raw }
```

**Exemplo:**
- Teste agachamento: opção 'calc' → `['tornozelo']` → `cats.mobilidade++` (via CATEGORY_MAP)
- CATEGORY_MAP.agachamento.calc = `['mobilidade']`
- score.mobilidade = max(0, (1 - 1/7) × 100) = 86

### 7.4 Geração do Plano

```
renderPlanView()
  ↓
sigs = Object.keys(signalCounts)  // sinais ativos
  ↓
Para cada sessão (a, b, c):
  ids = []
  Para cada sinal ativo:
    Adicionar SIGNAL_MAP[sinal][sessionKey] (sem duplicatas)
  Se criticalSignal existir:
    Adicionar SIGNAL_MAP[criticalSignal][sessionKey] (sem duplicatas)
  Se vazio:
    Fallback: ['e_prop_fechado', 'e_agach_ponta']
  ↓
localStorage.setItem('csd_sessoes', JSON.stringify(sessoes))
```

### 7.5 Montagem da Sessão (exercícios)

```
showSessionFromPlan(sessIdx)
  ↓
specific = [...new Set(sessoes[si])]  // exercícios específicos (deduplicados)
  ↓
critIds = SIGNAL_MAP[criticalSignal]?.[sessionKey] || []
  ↓
finalIds = critIds + specific (deduplicados, máx 5)
  ↓
Se < 4: completar com GERAL_ORDEM (sem duplicatas por nome)
  ↓
Renderizar: renderExCard(id, num, isEsp, isCrit)
  ↓
Salvar: csd_sessionExercises[sess_${idx}] = [ids renderizados]
  ↓
Restaurar checks: csd_sessionChecks[sess_${idx}]
```

### 7.6 Progresso (checkbox)

```
Usuário clica no checkbox
  ↓
toggleExCheck(exId, el)
  ↓
checks[sess_${currentSessionIdx}][exId] = !checks[...][exId]
  ↓
localStorage.setItem('csd_sessionChecks', JSON.stringify(checks))
  ↓
Atualizar visual (checkbox + card)
  ↓
Verificar se todos os exercícios da sessão estão marcados:
  Se sim → showDoneAnimation() (confetti + overlay)
  ↓
getCompletionPct() → atualizar barra de progresso
```

### 7.7 Semana Atual

```
getCurrentWeek()
  ↓
first = csd_firstCheckup (timestamp)
days = (Date.now() - first) / 86400000
week = min(4, floor(days / 7) + 1)
  ↓
Retorna 1–4
```

### 7.8 Reavaliação

```
checkReavaliacao()
  ↓
last = csd_lastCheckup (timestamp)
days = (Date.now() - last) / 86400000
  ↓
Retorna days >= 30
  ↓
Se true: dashboard mostra "refaça o check-up"
  ↓
Usuário clica → showReavaliacao()
  ↓
startReavaliacao()
  ↓
Salva csd_lastScores (scores atuais para comparação)
  ↓
csd_reav_confirm = '1'
  ↓
Redireciona para Welcome → Onboarding → Check-up
  ↓
[após check-up] showReport()
  ↓
Se csd_reav_confirm existir:
  currentPlanMonth = min(2, currentPlanMonth + 1)
  csd_planMonth = currentPlanMonth
  ↓
Mostra comparativo antes/depois
```

---

## 8. ONBOARDING

### Perguntas

| # | ID | Pergunta | Tipo | Opções | Condicional |
|---|---|---|---|---|---|
| 1 | `painToday` | Hoje você sente alguma dor durante a corrida? | single | Sim, Não | — |
| 2 | `painLocation` | Onde você sente essa dor? | multi | Joelho, Quadril, Panturrilha, Tornozelo, Pé, Canela, Lombar | Só se painToday = 'Sim' |
| 3 | `painIntensity` | Qual a intensidade da dor? (0–10) | slider | 0–10 | — |
| 4 | `painMoment` | Quando ela aparece? | single | Logo no início, Durante a corrida, No final, Após correr, No dia seguinte | Só se painToday = 'Sim' |
| 5 | `painDuration` | Há quanto tempo você convive com isso? | single | Menos de 1 semana, 1–4 semanas, 1–3 meses, Mais de 3 meses | — |
| 6 | `weeklyRuns` | Quantas vezes você corre por semana? | single | 1, 2, 3, 4, 5+ | — |
| 7 | `goal` | Qual seu principal objetivo agora? | single | Correr sem dor, Melhorar performance, Voltar a correr, Primeira prova, Meia Maratona, Maratona | — |

### Armazenamento

```javascript
// Em memória
onboardingData = {
  painToday: 'Sim',
  painLocation: ['Joelho', 'Tornozelo'],
  painIntensity: 6,
  painMoment: 'Durante a corrida',
  painDuration: '1–3 meses',
  weeklyRuns: '3',
  goal: 'Correr sem dor'
}

// Persistido
localStorage.setItem('csd_onboarding', JSON.stringify(onboardingData))
```

### Influência no Aplicativo

| Dado | Onde é utilizado |
|---|---|
| `painToday` + `painLocation` | `loadTest()` (contexto no teste 1), `showReport()` (queixa principal), `showWhyPlan()` (itens) |
| `painIntensity` | `showReport()` (intensidade) |
| `painMoment` | `showReport()` (quando aparece), `showWhyPlan()` (itens) |
| `painDuration` | `showReport()` (duração) |
| `weeklyRuns` | `showWhyPlan()` (itens) |
| `goal` | `showReport()` (objetivo), `showWhyPlan()` (itens) |

---

## 9. CHECK-UP

### Testes

| # | ID | Título | Sinais Possíveis |
|---|---|---|---|
| 1 | `agachamento` | Agachamento completo (cócora) | tornozelo, quadril_mob |
| 2 | `pelvica` | Elevação pélvica | gluteo |
| 3 | `equilibrio` | Equilíbrio unilateral | propriocepcao |
| 4 | `panturrilha` | Elevação de panturrilha unilateral | panturrilha, tornozelo |
| 5 | `stepdown` | Step-down test | quadril_forca |
| 6 | `noventa` | Rotação de quadril 90/90 | quadril_mob |
| 7 | `thomas` | Teste de Thomas | flexores |

### Regras de Nível (Teste 3)

| Resposta | Nível |
|---|---|
| `aberto_fail` | `init` (iniciante) |
| `fechado_fail` | `mid` (intermediário) |
| `ok` | `adv` (avançado) |

### Exemplo de Fluxo

```
Resposta do Teste 1: ['calc', 'fundo']
  ↓
Sinais ativados: tornozelo, quadril_mob
  ↓
signalCounts = { tornozelo: 1, quadril_mob: 1 }

Resposta do Teste 2: ['ok']
  ↓
Nenhum sinal
  ↓
signalCounts = { tornozelo: 1, quadril_mob: 1 }

... (após todos os testes)
  ↓
signalCounts = { tornozelo: 3, quadril_mob: 2, gluteo: 1 }
criticalSignal = 'tornozelo' (maior contagem)
```

---

## 10. ALGORITMO DE DIAGNÓSTICO

### 10.1 Detecção de Sinais

```
Para cada teste respondido em answers:
  Para cada opção marcada:
    Para cada sinal na opção (opt.signals):
      signalCounts[sinal]++
      sigSources[sinal].push({test, opt})
```

### 10.2 Sinal Crítico

```
criticalSignal = sinal com maior signalCounts
Em caso de empate: primeiro na ordem de SIGNAL_ORDER
```

### 10.3 Índice Corporal

```
Para cada categoria (5 no total):
  pontosNegativos = CATEGORY_MAP[testId][optId].length (para cada resposta)
  score[cat] = max(0, (1 - pontosNegativos / CATEGORY_INFO[cat].max) × 100)

overall = média dos 5 scores
```

### 10.4 Meta

```
Se overall < 50: meta = 65
Se overall < 70: meta = 80
Se overall >= 70: meta = 90
```

### 10.5 Severidade (Body Map)

```
Para cada região:
  Se não tem sinal: 'ok'
  Se tem sinal:
    Se é criticalSignal: 'critical'
    Se contagem >= 2: 'warning'
    Se contagem == 1: 'leve'
```

---

## 11. PLANO DE RECUPERAÇÃO

### Estrutura

```
Plano
  ├── Mês 0 (ativo) — "Eliminar as compensações principais"
  │   ├── Semana 1
  │   │   ├── Treino A (Segunda) — mobilidade, tornozelo, quadril
  │   │   ├── Treino B (Quarta) — força, glúteo, controle motor
  │   │   └── Treino C (Sexta) — propriocepção, revisão crítica
  │   ├── Semana 2 (mesmos exercícios)
  │   ├── Semana 3 (mesmos exercícios)
  │   └── Semana 4 (mesmos exercícios)
  ├── Mês 1 (bloqueado até reavaliação)
  └── Mês 2 (bloqueado até 2ª reavaliação)
```

### Geração dos Exercícios

1. Para cada sinal ativo em `signalCounts`:
   - Buscar exercícios em `SIGNAL_MAP[sinal][a|b|c]`
   - Adicionar à lista da sessão (sem duplicatas via `Set`)
2. Se `criticalSignal` existir:
   - Adicionar exercícios de `SIGNAL_MAP[criticalSignal][a|b|c]` (sem duplicatas)
3. Se lista vazia:
   - Fallback: `['e_prop_fechado', 'e_agach_ponta']`
4. Salvar em `csd_sessoes`

### Progressão por Nível

| Nível | Campo | Exemplo |
|---|---|---|
| `init` | `ex.di` | "3 séries · 8 reps" |
| `mid` | `ex.dm` | "3 séries · 10 reps" |
| `adv` | `ex.da` | "3 séries · 12 reps" |

### Exercícios `adv_only`

Apenas `e_saltos_quad` — só aparece quando `nivel === 'adv'`.

---

## 12. DASHBOARD

### Fontes de Dados

| Dado | Fonte | Função |
|---|---|---|
| Índice corporal | `calculateIndex()` | `overall`, `scores` |
| Meta do mês | `getTargetScore(overall)` | Baseado em faixas |
| Próxima sessão | `getNextSession()` | Baseado no dia da semana |
| Mensagem personalizada | `getPersonalizedMsg()` | `CONSEQUENCES[criticalSignal].priority` |
| Progresso | `getCompletionPct()` | Checks / total por sessão |
| Semana atual | `getCurrentWeek()` | `csd_firstCheckup` → dias / 7 |
| Countdown reavaliação | `csd_lastCheckup` → 30 - dias |
| Body map | `renderBodyMap(signalCounts)` | `getBodyStatus()` |
| Plano | `PLAN_MONTHS[currentPlanMonth]` | Título, descrição, meta |
| Sinais | `getActiveSignals()` | `signalCounts`, `criticalSignal` |

### Animações

| Elemento | Tipo | Duração |
|---|---|---|
| Barra de progresso | width 0→target | 1.6s |
| Score ring (anel) | stroke-dashoffset | 2.4s |
| Score ring (número) | count 0→target | 2.4s |
| Barras de categorias | width 0→target | 1.8s |
| Números de categorias | count 0→target | 1.8s |
| Scroll reveal | opacity + translateY | 0.5s |

---

## 13. EXERCÍCIOS

### Estrutura

```javascript
EX[exerciseId] = {
  name: string,       // "Cócoras"
  di: string|null,    // "2 séries · 30 segundos" (iniciante)
  dm: string,         // "3 séries · 60s" (intermediário)
  da: string,         // "3 séries · 60s com carga leve" (avançado)
  tag: string,        // "tornozelo"
  tc: string,         // "torn" (chave de cor)
  why: string,        // "Mobiliza o tornozelo progressivamente..."
  vid?: string,       // "6a54e6240a9f72b511fbefb4" (vturb player ID)
  adv_only?: boolean  // true (só para e_saltos_quad)
}
```

### Vídeos

- **Testes:** embed HTML direto no objeto `TESTS[].videoEmbed`
- **Exercícios:** função `vturbEmbed(vid)` gera HTML dinâmico
- **Formato:** iframe + SDK JS do ConverteAI SmartPlayer
- **Exemplo de URL:** `https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/{vid}/v4/embed.html`

### Seleção

1. `renderPlanView()` gera `csd_sessoes` (lista de IDs por sessão)
2. `showSessionFromPlan()` lê `csd_sessoes[si]`
3. Merge com exercícios do `criticalSignal`
4. Preenche com gerais se < 4
5. Renderiza com `renderExCard()`

---

## 14. NAVEGAÇÃO

### Fluxograma Completo

```
s-login
  ↓ (doLogin)
s-dashboard
  ├─ [checkup vazio] → s-welcome
  │     ↓ (startOnboarding)
  │   s-onboarding
  │     ↓ (finishOnboarding)
  │   s-test (7 vezes)
  │     ↓ (showReport)
  │   s-result
  │     ↓ (showWhyPlan)
  │   s-why-plan
  │     ↓ (showPlan)
  │   s-protocol
  │     ↓ (showSessionFromPlan)
  │   s-session-detail
  │     ├─ (toggleExCheck) → checkbox mark
  │     ├─ (showExerciseDetail) → ex-detail (overlay)
  │     │     ↓ (closeExDetail)
  │     └─ ← s-session-detail
  │
  ├─ [checkup feito] → cards de ação
  │     ├─ "▶ Começar" → s-session-detail
  │     ├─ "▶ Continuar Treinos" → s-protocol
  │     ├─ "Ver bônus" → s-bonus
  │     │     └─ (showBonusDetail) → s-bonus-detail
  │     └─ "refaça o check-up" → s-reavaliacao
  │           └─ (startReavaliacao) → s-welcome (refaz tudo)
  │
  └─ [top bar] ⌂ → s-dashboard (goToDashboard)

s-protocol
  ├─ (showSessionFromPlan) → s-session-detail
  └─ ⌂ → s-dashboard

s-session-detail
  ├─ (showExerciseDetail) → ex-detail
  └─ ⌂ → s-dashboard

s-bonus-detail
  └─ ← → s-bonus

s-reavaliacao
  └─ (startReavaliacao) → s-welcome
```

### Botões de Navegação

| Tela | Botão | Ação |
|---|---|---|
| s-login | "Entrar" | `doLogin()` |
| s-dashboard | ⌂ | `goToDashboard()` |
| s-dashboard | "Iniciar check-up" | `showScreen('s-welcome')` |
| s-dashboard | "▶ Começar" | `goToSession(idx)` |
| s-dashboard | "▶ Continuar Treinos" | `showPlan()` |
| s-dashboard | "Ver bônus" | `showBonuses()` |
| s-welcome | "Iniciar check-up" | `startOnboarding()` |
| s-onboarding | ← | `goBackOnboarding()` |
| s-test | ← | `goBack()` |
| s-test | "Próximo teste" | `nextTest()` |
| s-result | "Continuar" | `showWhyPlan()` |
| s-why-plan | "Ver plano" | `showPlan()` |
| s-protocol | ← | `goToDashboard()` |
| s-protocol | "Treino A/B/C" | `showSessionFromPlan(idx)` |
| s-session-detail | ⌂ | `goToDashboard()` |
| s-session-detail | Card exercício | `showExerciseDetail(id)` |
| s-session-detail | Checkbox | `toggleExCheck(id, el)` |
| ex-detail | ← | `closeExDetail()` |
| s-bonus | Card bônus | `showBonusDetail(idx)` |
| s-bonus-detail | ← | `showScreen('s-bonus')` |
| s-reavaliacao | "Refazer check-up" | `startReavaliacao()` |

---

## 15. ARQUITETURA ATUAL

### Tecnologias

- **HTML5** — estrutura
- **CSS3** — estilização (variáveis CSS, flexbox, grid, animações)
- **JavaScript ES6+** — lógica (template literals, arrow functions, destructuring, Set, Promise)
- **localStorage** — persistência local
- **Google Fonts** — Inter (400–800), Syne (700–800)
- **ConverteAI SmartPlayer** — vídeos (iframe + SDK JS)

### Estrutura do Arquivo

```
index.html (2008 linhas)
  ├── <head>
  │   ├── Meta tags
  │   ├── Google Fonts
  │   └── <style> (CSS inline ~400 linhas)
  │       ├── Variáveis CSS
  │       ├── Reset
  │       ├── Login
  │       ├── Top Bar
  │       ├── Progress
  │       ├── Welcome
  │       ├── Testes
  │       ├── Checkbox
  │       ├── Chat (onboarding)
  │       ├── Report
  │       ├── Why Plan
  │       ├── Protocol
  │       ├── Session
  │       ├── Bonus
  │       ├── Reavaliação
  │       ├── Score Ring
  │       ├── Subscores
  │       ├── Body Map
  │       ├── Exercise Detail
  │       ├── Confetti
  │       └── Animações
  ├── <body>
  │   ├── s-login
  │   ├── s-dashboard
  │   ├── s-welcome
  │   ├── s-onboarding
  │   ├── s-test
  │   ├── s-result
  │   ├── s-why-plan
  │   ├── s-protocol
  │   ├── s-bonus
  │   ├── s-bonus-detail
  │   ├── s-reavaliacao
  │   ├── s-session-detail
  │   └── ex-detail (overlay)
  └── <script> (JS inline ~1400 linhas)
      ├── Constantes (TESTS, EX, SIGNAL_MAP, etc.)
      ├── Estado global
      ├── Funções de cálculo (calculateIndex, etc.)
      ├── Funções de renderização (renderDashboard, etc.)
      ├── Funções de navegação (showScreen, etc.)
      ├── Login
      ├── Check-up
      ├── Relatório
      ├── Onboarding
      ├── Plano
      ├── Sessão
      ├── Exercício
      ├── Bônus
      ├── Reavaliação
      └── Animações
```

### Padrões

- **Renderização:** `render*()` com template literals → `innerHTML`
- **Navegação:** `showScreen(id)` — toggle classe `.active`
- **Estado:** globais + localStorage
- **Eventos:** inline `onclick` (não addEventListener)
- **Vídeos:** ConverteAI iframe + SDK JS
- **Animações:** CSS transitions + JS (requestAnimationFrame)

---

## 16. FLUXO FUTURO

### Planejado (não implementado)

1. **Persistência com Supabase**
   - Migrar localStorage → PostgreSQL
   - API REST ou GraphQL

2. **Autenticação Real**
   - Email/senha ou magic link
   - JWT tokens
   - Middleware de autenticação

3. **Múltiplas Avaliações**
   - Histórico de check-ups
   - Comparativo entre datas
   - Gráficos de evolução

4. **Plano Progressivo**
   - Exercícios diferentes por semana
   - Periodização real
   - Adaptação baseada em progresso

5. **Dashboard Persistente**
   - Dados do servidor
   - Sincronização entre dispositivos
   - Cache offline

6. **Reavaliação Automática**
   - Notificação push
   - Lembrete por email
   - Check-up automático

7. **Notificações**
   - Lembrete de treino
   - Marcações de progresso
   - Alertas de reavaliação

8. **IA Futura**
   - Recomendação inteligente de exercícios
   - Análise de padrões
   - Ajuste automático do plano

9. **Integrações**
   - Garmin/Strava
   - Apple Health/Google Fit
   - Relatórios em PDF

10. **Gamificação**
    - Streak de treinos
    - Conquistas
    - Ranking

---

## 17. DADOS QUE DEVEM SER PERSISTIDOS

### Atualmente em localStorage (devem migrar para DB)

| Dado | Chave Atual | Tipo | Obrigatório |
|---|---|---|---|
| Usuário logado | `csd_logged` | flag | Sim |
| Check-up concluído | `csd_checkup` | flag | Sim |
| Respostas do onboarding | `csd_onboarding` | JSON | Sim |
| Respostas do check-up | `csd_answers` | JSON | Sim |
| Nível | `csd_nivel` | string | Sim |
| Último check-up | `csd_lastCheckup` | timestamp | Sim |
| Primeiro check-up | `csd_firstCheckup` | timestamp | Sim |
| Exercícios por sessão | `csd_sessoes` | JSON | Sim |
| Checks por exercício | `csd_sessionChecks` | JSON | Sim |
| Exercícios renderizados | `csd_sessionExercises` | JSON | Não |
| Scores anteriores | `csd_lastScores` | JSON | Não |
| Mês do plano | `csd_planMonth` | string | Sim |
| Flag reavaliação | `csd_reav_confirm` | flag | Não |

### Dados em memória (devem ser calculados ou persistidos)

| Dado | Variável | Origem |
|---|---|---|
| Índice corporal | `calculateIndex()` | `answers` + `CATEGORY_MAP` |
| Sinais ativos | `getActiveSignals()` | `answers` + `TESTS` |
| Sinal crítico | `getActiveSignals()` | `signalCounts` |
| Progresso semanal | `getCompletionPct()` | `csd_sessionChecks` + `csd_sessionExercises` |
| Semana atual | `getCurrentWeek()` | `csd_firstCheckup` |
| Próxima sessão | `getNextSession()` | Dia da semana |
| Meta | `getTargetScore()` | `overall` |

### Dados que NÃO existem hoje (devem ser criados)

| Dado | Descrição |
|---|---|
| Perfil do usuário | Nome, email, foto, data de nascimento |
| Histórico de treinos | Data, sessão, exercícios completados |
| Histórico de avaliações | Data, scores, sinais |
| Preferências | Notificações, tema, idioma |
| Metricas de uso | Tempo de uso, frequência |

---

## 18. DEPENDÊNCIAS ENTRE OS DADOS

### Diagrama de Dependências

```
Onboarding (csd_onboarding)
  ├──→ Relatório (queixa principal, hipótese)
  ├──→ "Por que é diferente" (itens narrativos)
  └──→ LoadTest (contexto no teste 1)

Check-up (answers → csd_answers)
  ├──→ calculateIndex() → overall, scores
  │     ├──→ Dashboard (score ring, barras, meta)
  │     ├──→ Relatório (índice)
  │     └──→ Reavaliação (comparativo)
  ├──→ getActiveSignals() → signalCounts, criticalSignal
  │     ├──→ Dashboard (body map, mensagem personalizada)
  │     ├──→ renderPlanView() → csd_sessoes
  │     │     └──→ showSessionFromPlan() → sessão
  │     ├──→ Relatório (sinais, conclusão)
  │     └──→ "Por que é diferente" (itens)
  └──→ nivel → getDetail() → progressão dos exercícios

Plano (csd_sessoes)
  ├──→ Dashboard (progresso)
  ├──→ Sessão (exercícios)
  └──→ Reavaliação (avanço de mês)

Progresso (csd_sessionChecks)
  ├──→ Dashboard (barra de progresso %)
  └──→ Sessão (checks visuais)

Tempo (csd_lastCheckup, csd_firstCheckup)
  ├──→ Dashboard (countdown reavaliação)
  ├──→ getCurrentWeek() (semana atual)
  └──→ checkReavaliacao() (30 dias)
```

### Tabela de Dependências

| Dado Origem | Dado Destino | Tipo |
|---|---|---|
| `csd_onboarding.painToday` | `csd_answers` (contexto) | Influência |
| `csd_onboarding.painLocation` | Relatório (queixa) | Exibição |
| `csd_onboarding.goal` | Relatório (objetivo) | Exibição |
| `csd_answers` | `overall` | Cálculo |
| `csd_answers` | `signalCounts` | Cálculo |
| `csd_answers` | `criticalSignal` | Cálculo |
| `csd_answers` | `nivel` | Cálculo (teste 3) |
| `signalCounts` | `csd_sessoes` | Geração |
| `criticalSignal` | `csd_sessoes` | Geração |
| `criticalSignal` | Body Map (cor) | Exibição |
| `criticalSignal` | Dashboard (mensagem) | Exibição |
| `csd_sessoes` | Sessão (exercícios) | Renderização |
| `csd_sessionChecks` | Dashboard (%) | Cálculo |
| `csd_firstCheckup` | Semana atual | Cálculo |
| `csd_lastCheckup` | Countdown (dias) | Cálculo |
| `csd_planMonth` | Dashboard (mês) | Exibição |

---

## 19. PREPARAÇÃO PARA BANCO DE DADOS

### Entidades (Tabelas)

1. **users** — Usuários do sistema
2. **assessments** — Check-ups realizados
3. **assessment_answers** — Respostas de cada check-up
4. **assessment_signals** — Sinais detectados em cada check-up
5. **onboarding_data** — Dados do onboarding
6. **plans** — Planos de recuperação
7. **plan_sessions** — Sessões do plano (A/B/C)
8. **session_exercises** — Exercícios de cada sessão
9. **exercise_completions** — Checks de exercícios
10. **reassessments** — Reavaliações

### Relacionamentos

```
users (1) ──→ (N) assessments
users (1) ──→ (N) plans
users (1) ──→ (1) onboarding_data

assessments (1) ──→ (N) assessment_answers
assessments (1) ──→ (N) assessment_signals

plans (1) ──→ (N) plan_sessions
plan_sessions (1) ──→ (N) session_exercises

session_exercises (1) ──→ (N) exercise_completions

assessments (1) ──→ (N) reassessments
```

### Objetos com ID Próprio

| Objeto | ID | Tipo |
|---|---|---|
| Usuário | `user_id` | UUID |
| Assessment | `assessment_id` | UUID |
| Onboarding Data | `onboarding_id` | UUID |
| Plano | `plan_id` | UUID |
| Sessão | `session_id` | UUID |
| Exercício | `exercise_id` | string (chave do EX) |
| Completion | `completion_id` | UUID |

### Objetos como Atributos

| Objeto | Onde pertence | Tipo |
|---|---|---|
| Resposta do teste | `assessment_answers` | JSON array |
| Sinais detectados | `assessment_signals` | JSON object |
| Nível | `assessment` | string enum |
| Índice corporal | `assessment` | number |
| Checks | `exercise_completions` | JSON object |
| Exercícios da sessão | `session_exercises` | JSON array |

### Tabelas Independentes

| Tabela | Descrição |
|---|---|
| `exercises` | Catálogo de exercícios (do EX) |
| `tests` | Catálogo de testes (do TESTS) |
| `signals` | Catálogo de sinais |
| `categories` | Catálogo de categorias |
| `bonuses` | Catálogo de bônus |

### Atributos Calculados (não persistir)

| Atributo | Cálculo | Onde |
|---|---|---|
| Índice corporal | `calculateIndex()` | Runtime |
| Sinais ativos | `getActiveSignals()` | Runtime |
| Sinal crítico | `getActiveSignals()` | Runtime |
| Progresso (%) | `getCompletionPct()` | Runtime |
| Semana atual | `getCurrentWeek()` | Runtime |
| Próxima sessão | `getNextSession()` | Runtime |
| Meta | `getTargetScore()` | Runtime |

---

## 20. RESUMO FINAL

### Visão Geral da Arquitetura

O **Corredor Sem Dor** é uma SPA monolítica que funciona como sistema de avaliação funcional para corredores. O aplicativo coleta dados pessoais (onboarding), aplica 7 testes funcionais (check-up), calcula um índice corporal (0–100), identifica compensações musculares e gera um plano personalizado de recuperação (3 meses).

### Fluxo de Dados

1. **Onboarding** → coleta dados pessoais → `csd_onboarding`
2. **Check-up** → 7 testes → `answers` → `signalCounts` + `criticalSignal` + `nivel`
3. **Cálculo** → `calculateIndex()` → `overall` + `scores`
4. **Plano** → `signalCounts` + `criticalSignal` + `SIGNAL_MAP` → `csd_sessoes`
5. **Sessão** → `csd_sessoes` + `SIGNAL_MAP` → exercícios renderizados
6. **Progresso** → `csd_sessionChecks` → `getCompletionPct()` → barra %
7. **Reavaliação** → a cada 30 dias → refaz check-up → avança mês do plano

### Pontos de Persistência

- **localStorage** → 13 chaves (flag, JSON, timestamp, string)
- **Memória** → 11 variáveis globais (mutáveis durante sessão)
- **Constantes** → 13 objetos (imutáveis)

### Dependências Críticas

- `answers` → `calculateIndex()` → Dashboard
- `answers` → `getActiveSignals()` → Plano
- `criticalSignal` → Plano + Dashboard + Body Map
- `csd_sessoes` → Sessão + Progresso
- `csd_firstCheckup` → Semana atual
- `csd_lastCheckup` → Countdown reavaliação

### Preparação para Migração

- **10 entidades** identificadas para tabelas
- **5 tabelas independentes** (catálogos)
- **7 atributos calculados** (não persistir)
- **Todos os dados atuais** devem migrar para PostgreSQL/Supabase

---

*Documento gerado automaticamente — Julho 2026*
*Nível de detalhe: suficiente para um arquiteto de software projetar a estrutura do banco de dados sem precisar abrir o código.*
