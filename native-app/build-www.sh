#!/usr/bin/env bash
# Gera a pasta web/ (www) para o app nativo copiando os arquivos do PWA.
# NUNCA altera os arquivos originais (index.html etc.) — só trabalha na cópia.
set -euo pipefail
cd "$(dirname "$0")"

WEB=www
rm -rf "$WEB"
mkdir -p "$WEB/assets"

# Cópia dos arquivos web

cp ../index.html "$WEB/index.html"
cp ../icon-180.png "$WEB/"
[ -d ../assets ] && cp -R ../assets/* "$WEB/assets/" 2>/dev/null || true

# ── Prune: ajustes APENAS na cópia, para o ambiente nativo ──

# 1) Remove o script de "hard reload" por versão de cache
#    (depende de service worker / Cache API, que não existem no app nativo).
sed -i '' '/csd_cache_version/d' "$WEB/index.html"

# 2) Remove o link do manifest PWA (desnecessário no nativo).
sed -i '' '/rel="manifest"/d' "$WEB/index.html"

# 3) Esconde a UI de "instalar app" (modal + botão Baixar App),
#    que não faz sentido dentro de um app instalado pela App Store.
sed -i '' 's|</head>|<style>#install-overlay,.btn-download{display:none!important}</style></head>|' "$WEB/index.html"

echo "OK: www/ montado ($(du -sh "$WEB" | cut -f1))"
echo "Próximo passo: npx cap add ios  &&  npx cap sync ios"