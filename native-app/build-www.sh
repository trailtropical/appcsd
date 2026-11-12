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

# 3) Esconde a UI de "instalar app" (modal + botão Baixar App + item das
#    Configurações), que não faz sentido dentro de um app instalado pela App Store.
sed -i '' 's|</head>|<style>#install-overlay,.btn-download,.install-settings-row{display:none!important}</style></head>|' "$WEB/index.html"

# 4) Textos neutros sobre o acesso (App Store 3.1.1: sem menção à compra feita
#    fora do app). Falha o build se algum texto não for encontrado, para não
#    publicar sem a troca caso o index.html mude.
python3 - "$WEB/index.html" <<'PYEOF'
import sys
p = sys.argv[1]; s = open(p, encoding='utf-8').read()
trocas = [
  ('Comprei o programa e <strong>ainda não criei</strong> minha senha.',
   'Ainda <strong>não criei</strong> minha senha.'),
  ('O acesso é liberado após a compra do programa. Use o e-mail informado na compra.',
   'Use o e-mail cadastrado para entrar.'),
  ('Use o mesmo e-mail da sua compra.',
   'Use o e-mail cadastrado.'),
  ('O acesso é liberado após a compra do programa. Se você comprou com outro e-mail, use o e-mail informado na compra.',
   'Se não encontrar seu acesso, confira o e-mail cadastrado ou fale com o suporte.'),
  ('Não encontramos uma compra com este e-mail. Use o e-mail informado na compra ou fale com o suporte.',
   'Não encontramos um acesso com este e-mail. Confira o e-mail cadastrado ou fale com o suporte.'),
]
for velho, novo in trocas:
    if s.count(velho) != 1:
        sys.exit('build-www: texto não encontrado para trocar: ' + velho[:60])
    s = s.replace(velho, novo)
open(p, 'w', encoding='utf-8').write(s)
PYEOF

echo "OK: www/ montado ($(du -sh "$WEB" | cut -f1))"
echo "Próximo passo: npx cap sync ios && npx cap sync android"