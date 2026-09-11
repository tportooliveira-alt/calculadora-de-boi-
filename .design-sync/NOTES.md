# Notas do design-sync — Calculadora de Boi

- O repo do app é um PWA de arquivo único (index.html); o design system foi CRIADO em `design-system/` (React + esbuild + tsc) espelhando fielmente o CSS do app v12. Ao mudar o visual do app, atualizar `design-system/src/styles.css` e `src/index.tsx` juntos.
- Build do pacote: `cd design-system && npm run build` (esbuild --bundle com react external + tsc só de tipos).
- Converter: entry `design-system/dist/index.js`, node_modules `design-system/node_modules`.
- Navegador do render check: o cache em /opt/pw-browsers tem chromium build 1194; o playwright 1.63 pede 1243 — resolvido com symlink `chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell → chromium_headless_shell-1194/chrome-linux/headless_shell` (refazer se o container reiniciar).
- Sem fontes próprias (fonte do sistema) — [FONT_MISSING] não se aplica.
- Previews 100% autorais em `.design-sync/previews/` (14 componentes, todas as células graded good em 2026-09-11).

## Riscos de re-sync
- O design system NÃO é gerado do index.html: é cópia manual dos estilos. Drift entre app e DS é silencioso — conferir styles.css contra o app a cada versão nova do app.
- Symlink do chromium é efêmero (container). Sem ele o validate cai em [RENDER_SKIPPED].
- Dados dos previews (pesos, R$) são amostras estáticas; se a linguagem do app mudar (ex.: novos tipos de animal), atualizar previews.
