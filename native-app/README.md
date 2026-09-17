# Empacotamento nativo (App Store / iOS)

Empacota o PWA **sem alterar** o app que roda no GitHub Pages.
Os arquivos originais (`index.html`, `admin.html`, …) ficam intactos — este
projeto só cria uma **cópia pronta** para virar app iOS.

## Pré-requisitos (nesta máquina ainda faltam)

1. **Node.js + npm** — instalado via nvm (`v24`), carregado no `.zshrc`.
2. **Xcode** (na App Store) e licença aceita: `sudo xcodebuild -license accept`
3. Conta de desenvolvedor Apple ($99/ano) para assinar/subir o app.

> **CocoaPods NÃO é necessário.** Este projeto usa o template **Swift Package
> Manager (SPM)** do Capacitor. Existe um stub `~/bin/pod` apenas para
> contornar uma checagem errada da CLI do Capacitor (`--packagemanager SPM` é
> convertido para minúsculo e nunca bate com o valor esperado); com SPM nenhum
> `pod` é executado de verdade. Quando a checagem for corrigida, dá pra apagar
> o stub.

## Passo a passo

Já feito (projeto `ios/` gerado e web assets sincronizados):

```bash
cd native-app
npm install                     # instala o Capacitor ✓ (feito)
./build-www.sh                  # monta a cópia www/ a partir do PWA ✓ (feito)
npx cap add ios --packagemanager SPM   # cria o projeto Xcode ✓ (feito)
npx cap sync ios                # sincroniza ✓ (feito)
```

Falta só (quando o Xcode estiver instalado):

```bash
npx cap open ios                # abre o Xcode
```

No Xcode: selecionar o Team (conta Apple) e rodar (▶). Depois, subir via
Organizer → App Store Connect.

## Quando você atualizar o app web

```bash
cd native-app
npm run build:www && npx cap sync ios    # regenera a cópia e sincroniza
```

## O que a cópia faz de diferente do PWA original (automaticamente)

- Remove o script de "hard reload" por versão de cache (service worker/Cache API);
- Remove o link do manifest PWA;
- Esconde o modal "Instalar aplicativo" e o botão "Baixar App".

Nada disso toca o `index.html` original.

## Pendências para a submissão (importante ler)

1. **Bundle ID**: o `appId` no `capacitor.config.json` é um placeholder
   (`br.com.trailtropical.corredorsemdor`). Confirmar/trocar antes de subir.
2. **Login por link de e-mail (Supabase)**: hoje os magic links apontam para o
   GitHub Pages. No app nativo, links assim abrem no Safari. Para o login
   direto dentro do app vai precisar de um **URL scheme** (`LSApplicationQueriesSchemes`/
   `CFBundleURLTypes`) + redirect url no Supabase. Testar esse fluxo antes de subir.
3. **Privacidade**: o app coleta dados de saúde (dores, avaliações) via Supabase.
   A App Store pede: Privacy Policy publicada + declaração de coleta de dados.
4. **Pagamentos**: compra acontece só na Hotmart/site (fora do app). NÃO adicionar
   telas/preços de compra dentro do app, senão a Apple exige In-App Purchase.
5. **Teste**: testar em Device (não só simulador) — login, vídeos do ConverteAI,
   notificações não existem ainda (podem entrar depois via plugin Capacitor).