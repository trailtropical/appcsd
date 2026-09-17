# Checklist de submissão — App Store Connect

Rascunho com as respostas pra agilizar a submissão. Confirmar cada item antes de publicar.

## Registro do app (App Store Connect)

| Campo | Valor sugerido |
|---|---|
| **Nome** (até 30 letras) | Corredor Sem Dor |
| **Subtitle** (até 30) | Você correndo leve de novo! (24 letras) |
| **Bundle ID** | `br.com.corredorsemdor` |
| **Versão** | 1.0 (build 1) |
| **Categoria primária** | Health & Fitness |
| **Categoria secundária** | Sports (opcional) |
| **Classificação etária** | 4+ (não há conteúdo explícito; orienta exercícios) |
| **Privacidade (URL)** | https://trailtropical.github.io/appcsd/privacy-policy.html |
| **Operador (LGPD)** | Trail Tropical — CNPJ 68.420.244/0001-67 |

## Privacy questionnaire (respostas)

- Coleta **dados de saúde** (dores e avaliações do check-up): SIM → declarar como vinculados ao usuário.
- Coleta **contato** (nome/e-mail do cadastro): SIM → vinculados ao usuário.
- Coleta **ID de usuário** (Supabase auth + UUID): SIM.
- **Uso de dados**: para funcionalidade do app, análises internas; NÃO é usado para rastreamento/publicidade.
- Pagamentos: NÃO ocorre dentro do app (Hotmart externa, sem dado de cartão no app).
- Acesso/atividade (Keychain/HealthKit/etc.): NENHUM — não usa HealthKit, câmera, GPS nem notificações.
- **Conformidade de exportação (criptografia)**: NÃO usa criptografia própria (só HTTPS padrão) → responder "exempt" (não).

## Conteúdo para a página

- **Screenshots**: `native-app/appstore/screenshots/` (01 = 6.9", 02 = 6.7"). Falta capturar tela logada (plano/treino) quando houver conta de teste.
- **Descrição** (sugestão pt-BR):
  > O Corredor Sem Dor acompanha seu programa de fortalecimento e reabilitação para
  > corrida. Faça a avaliação inicial (flexibilidade, mobilidade, força e dor),
  > receba seu plano de treinos A/B/C personalizado, marque os exercícios concluídos
  > e acompanhe sua evolução. Conteúdo orientado por protocolo específico para
  > corredores — consulte um profissional de saúde em caso de dor.
- **Keywords** (até 100 com vírgulas): corrida, reabilitação, joelho, fortalecimento, mobilidade, treino, fisioterapia, dor no joelho, planilha, PTT, corredor
- **Suporte (URL/email)**: `mailto:trailtropicalpodcast@gmail.com`

## Antes de enviar para review

- [ ] **Conta de teste** para o revisor: usar a própria `nmendes1994@gmail.com` / `123456` (tem check-up e plano completos) — informar email+senha em "Sign-In Information" do App Review.
- [ ] Rodar o app num **aparelho físico** (testar login, vídeo, cores reais).
- [ ] Build assinado via **Archive** no Xcode → Organizer → Upload (depois da conta Apple).
- [ ] Validar com **xcrun altool --validate-app** antes do upload (ou direto no Organizer).

## Nota técnica

- Login: email + senha (Supabase). O revisor entra com a conta de teste e deve ver o plano A/B/C.
- Vídeos dos exercícios rodam via iframe (ConverteAI) — testar se o revisor não bloqueia.
- App é em retrato no iPhone; iPad livre.