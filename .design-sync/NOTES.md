# Notas do design-sync — Calculadora de Boi

- O repo do app é um PWA de arquivo único (index.html); o design system foi CRIADO em `design-system/` (React + esbuild + tsc) espelhando fielmente o CSS do app v12. Ao mudar o visual do app, atualizar `design-system/src/styles.css` e `src/index.tsx` juntos.
- Build do pacote: `cd design-system && npm run build` (esbuild --bundle com react external + tsc só de tipos).
- Converter: entry `design-system/dist/index.js`, node_modules `design-system/node_modules`.
- Navegador do render check: o cache em /opt/pw-browsers tem chromium build 1194; o playwright 1.63 pede 1243 — resolvido com symlink `chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell → chromium_headless_shell-1194/chrome-linux/headless_shell` (refazer se o container reiniciar).
- Sem fontes próprias (fonte do sistema) — [FONT_MISSING] não se aplica.
- Previews 100% autorais em `.design-sync/previews/` (21 componentes; 14 graded good em 2026-09-11, 7 novos em 2026-09-12).
- Sync de 2026-09-12 (app v14) subiu 113 arquivos: 21 componentes. Novos: FaixaTotais, BarraMeta, LinhaPrevia, MolduraTeclado, AvisoPeso, RodapeAcoes, FolhaAjuste. TabelaPesagens ganhou `pesoLiquido` por linha e a prop `total`.
- `resync.mjs` NÃO funciona neste repo: ele auto-detecta shape `storybook` (existe uma pasta storybook nos scripts staged) e sai com exit 1 antes de construir. Usar sempre os dois scripts diretos, que respeitam o `shape: package` do config:
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules design-system/node_modules --entry ./design-system/dist/index.js --out ./ds-bundle`
  `node .ds-sync/package-validate.mjs ./ds-bundle`
- `AvisoPeso` aparece como `[RENDER_ERRORS]` no validate, mas é FALSO POSITIVO: as duas células renderizam perfeitas (conferido no PNG e na contact sheet); o `firstErr` reportado é o próprio texto do componente. Não perseguir.

## Tokens da v14
- Novos: `--boi-superficie` #fffdf7, `--boi-tinta` #2d1f13, `--boi-secundario` #6b533c, `--boi-borda-suave` rgba(212,175,55,.55), `--boi-trilho`, `--boi-moldura-1/2`, `--boi-ambar-fundo/borda/texto`, `--boi-meta-1/2`.
- Modo Sol é a classe `.boi-sol` no elemento raiz: ela só redefine tokens (mais alguns overrides pontuais). Ao criar peça nova, usar SEMPRE token — se usar cor crua, o Modo Sol não pega.

## Riscos de re-sync
- O design system NÃO é gerado do index.html: é cópia manual dos estilos. Drift entre app e DS é silencioso — conferir styles.css contra o app a cada versão nova do app.
- Symlink do chromium é efêmero (container). Sem ele o validate cai em [RENDER_SKIPPED].
- Dados dos previews (pesos, R$) são amostras estáticas; se a linguagem do app mudar (ex.: novos tipos de animal), atualizar previews.

## Handoffs
- `design/handoff-tela-pesagem-pro/` (11/09/2026) — spec hi-fi das 3 telas do fluxo de pesagem (cadastro do lote → pesagem → folha de finalizar), o protótipo `TelaPesagemPro.dc.html` e os `.prompt.md` dos 12 componentes usados. São referências de design, não código de produção — o app já ganhou essas telas em `v13` (#16) e `v14` (#17); o pacote fica como a fonte visual dessas versões.
- Ignorar o `styles.css` DESSE pacote — ele traz o tema do canvas do Claude Design (`--boi-brown-950`, `--boi-gold-500`, fontes Space Grotesk / IBM Plex Mono), não os tokens do projeto. A verdade continua em `design-system/src/styles.css` (marrom `#8B4513`, dourado `#d4af37`, fonte do sistema).
- O `_ds_bundle.css` do pacote é cópia byte a byte (11.047 bytes) do `design-system/src/styles.css` de 11/09/2026 — snapshot datado, não segunda fonte de verdade.
