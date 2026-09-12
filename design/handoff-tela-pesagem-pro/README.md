# Handoff: Tela de Pesagem Pro — Calculadora de Boi

## Visão geral
Fluxo completo de pesagem de gado para iPhone (390 px de largura, 844 px de altura), uso com uma mão sob sol forte:
**Cadastro do lote → Pesagem → Folha de finalizar.** Mantém a identidade marrom + dourado da Calculadora de Boi e usa os 14 componentes do design system `calculadora-de-boi-ds` já existentes no código.

## Sobre os arquivos deste pacote
Os arquivos aqui são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento pretendidos, não código de produção para copiar. A tarefa é **recriar estas telas no app real** (React / React Native / o que o projeto já usa) com os componentes e padrões que já existem no repositório da `calculadora-de-boi-ds`. Se o app ainda não tiver ambiente definido, escolha o framework mais adequado e implemente lá.

- `TelaPesagemPro.dc.html` — protótipo principal (template HTML + classe de lógica JS no mesmo arquivo).
- `TelaPesagem.dc.html` — exploração anterior (duas variações de arranjo). Apenas referência; o Pro substitui.
- `styles.css`, `_ds_bundle.css` — tokens e classes `boi-*` do design system publicado (referência dos valores).
- `components/*.prompt.md` — props e exemplos de cada componente do DS usado.

## Fidelidade
**Alta (hi-fi).** Cores, tipografia, espaçamentos, tamanhos de toque e interações são finais. Recriar fielmente usando os componentes do DS; o que não existe no DS (barra de meta, faixa de totais, rodapé FINALIZAR/NOVO LOTE, faixa de desfazer, alerta âmbar, folha de edição de campo) deve ser criado como novos componentes seguindo os tokens abaixo.

## Componentes do DS usados (todos já existem no código)
`Cabecalho`, `DisplayBalanca`, `ReguaQuantidade`, `ChipsDesconto`, `Teclado` (+ `Tecla`), `TabelaPesagens`, `CardResumo`, `BotoesModo`, `CampoRotulado`, `BotaoPrincipal`, `FolhaFinalizar`, `BotaoModal`. Props em `components/<Nome>.prompt.md`.

---

## Telas

### 1. Cadastro do lote
**Objetivo:** definir o lote antes de pesar e escolher o modo (sem números / com números).

Layout (coluna, padding 16 px, gap 14 px, fundo `--boi-fundo #f5f1e8`):
1. Barra de status (24 px) — gradiente marrom `135deg #8B4513 → #654321`, texto creme `#f4e4c1` 12 px/800.
2. `Cabecalho` sem ações (título do app).
3. Rótulo de seção "NOVO LOTE" — 11 px, 800, uppercase, letter-spacing .16em, cor `#8B4513`, com fio dourado degradê à direita (2 px, `rgba(212,175,55,.7) → 0`).
4. `CampoRotulado` "Vendedor / Comprador" (placeholder "Nome").
5. Grade 2 colunas (gap 12 px): "Preço da arroba" (`R$ 300,00/@`), "Meta de cabeças" (explicação "opcional", placeholder "Ex: 50"), "Rendimento de carcaça" (`50%`), "Desconto padrão" (`0 kg/cab`).
6. `CampoRotulado` tipo seleta "🐄 O que vai pesar?" — valores `Boi | Vaca | Novilha`.
7. "Como vai pesar?" (13 px/800) + `BotoesModo` (normal | identificado) + explicação 12 px/600 `#6b533c`:
   - normal: "Pesa a balançada inteira: só a quantidade e o peso."
   - identificado: "Cada animal entra com o número do brinco e o peso."
8. `BotaoPrincipal` "✓ COMEÇAR PESAGEM" (60 px de altura, raio 14 px, sombra `0 4px 0 rgba(0,0,0,.35)`).

**Edição de campos — folha por cima:** tocar em qualquer campo abre uma folha inferior (ver "Folha de edição"). Campos numéricos usam o `Teclado` do DS; nome usa input de texto; tipo usa 3 botões grandes.

Ajustes de estilo nos componentes do DS nesta tela: `boi-campo-entrada` / `boi-campo-seleta` com raio 12 px, altura mín. 52 px, 17 px/700, sombra `0 2px 0 rgba(45,31,19,.18)`; `boi-modo` raio 12 px, altura mín. 56 px.

### 2. Pesagem
**Objetivo:** digitar o peso e jogar cada balançada (ou cada animal) no lote, com o polegar.

Ordem vertical (a tela rola; até o rodapé cabe em 844 px no modo normal):
1. Barra de status (24 px).
2. `Cabecalho` **fino** (sem `comAcoes`): cliente à esquerda, preço à direita (`R$ 300,00/@`).
3. **Faixa de totais** — 3 células, separadas por 1 px `rgba(212,175,55,.55)`, borda inferior 2 px dourada:
   - "CABEÇAS" e "PESO": fundo `#fffdf7`, rótulo 10 px/800 uppercase `.14em` `#8B4513`, valor 18 px/800 `#2d1f13` tabular-nums.
   - "TOTAL" (flex 1.3): fundo gradiente `135deg #2d1f13 → #3d2b1f`, rótulo creme, valor 18 px/800 `#f0d060`.
4. **Barra de meta** (tocável → abre folha da meta): fundo `#fffdf7`, padding `8px 14px 9px`, borda inferior 2 px `rgba(212,175,55,.55)`.
   - Linha: "META DO LOTE" (10 px/800 uppercase) + texto à direita 13 px/800 (`12 de 50 bois`, ou `7 bois · toque para pôr meta`, ou `50 de 50 bois · meta batida ✓`).
   - Trilho 10 px, raio 999, fundo `rgba(139,69,19,.15)`; preenchimento gradiente `90deg #d4af37 → #f0d060`, `transition: width .45s ease`. Ao bater a meta: gradiente `90deg #16a34a → #22c55e`.
5. Bloco (padding `12px 14px 8px`, gap 10 px):
   - `DisplayBalanca` (raio 14 px, sombra `0 10px 26px -14px rgba(0,0,0,.8)`). Modo identificado: `numeroAnimal`, `rotuloNumero` ("BOI Nº"/"VACA Nº"/"NOVILHA Nº"), `campoAtivo`.
   - **Alerta de peso** (condicional, ver Interações).
   - Linha de utilidades: prévia `≈ 43.00@ · R$ 12.900,00` (13 px/800 `#8B4513`) + dica 11 px/700 `#6b533c`; pill de modo `SEM Nº` / `🔢 COM Nº` (44 px alt., borda 2 px dourada, raio 999, 11 px/800); botão redondo 44 px 🔊/🔇; botão redondo 44 px ☀️ (Modo Sol).
   - `ReguaQuantidade` (só no modo normal; rótulo "Bois:"/"Vacas:"/"Novilhas:").
   - `ChipsDesconto` (50 px, 15 px, raio 12 px).
6. **Bloco do teclado** — margem `2px 10px 10px`, padding `10px 10px 12px`, raio 24 px, fundo `165deg #3d2b1f → #20150e`, borda 2 px `rgba(212,175,55,.55)`, sombra interna `0 1px 0 rgba(244,228,193,.14)` + `0 16px 30px -20px rgba(0,0,0,.9)`. Cabeçalho do bloco: "TOCA NA CAIXINHA" (10 px/800 `.18em` dourado) + fio + "verde = entra no lote" (10 px, creme 75%).
   - `Teclado` com teclas **72 px**, 28 px/800, raio 14 px, borda 2 px, sombra `0 3px 0 rgba(45,31,19,.28)` + `inset 0 1px 0 rgba(255,255,255,.6)`. Teclas especiais mantêm tamanho de texto próprio: `Nº ⇄ kg` 14 px/900, `⌫` 18 px, `CLR` 15 px/900. Tecla verde: sombra `0 4px 0 #0f3d20`, `0 10px 22px -10px rgba(22,101,52,.8)`, borda `#2f8a52`.
7. **Rodapé de ações** (padding `0 14px 12px`, gap 10 px):
   - `✓ FINALIZAR` (flex 1.3, 56 px, borda 3 px dourada, fundo gradiente marrom, texto dourado 15 px/900 `.06em`, raio 14 px, sombra `0 4px 0 rgba(0,0,0,.35)`).
   - `+ NOVO LOTE` (flex 1, 56 px, fundo `#fffdf7`, borda 2 px dourada, texto `#2d1f13`). **Desabilitado** (opacity .4, sem toque) até o lote ser finalizado.
8. Seção "NO LOTE" (rótulo 11 px + fio + estado `em andamento` / `FINALIZADO`), com **faixa de desfazer** (condicional) acima, `TabelaPesagens` (raio 12 px) e `CardResumo` "Fechamento do lote".

### 3. Folha de finalizar
Overlay `rgba(20,12,6,.62)` cobrindo a tela; `FolhaFinalizar` ancorada embaixo (raio 24 px no topo, animação sobe 40 px / 220 ms). `resumo` = `7 bois · 3150 kg · 105.0@ · R$ 31.500,00`. Botões (`BotaoModal`, 52 px, raio 12 px): casa "📥 SALVAR EM ARQUIVOS DO CELULAR", whatsapp "💬 MANDAR PRO WHATSAPP", planilha "📊 MANDAR PRO GOOGLE PLANILHAS", contorno "+ NOVO LOTE", discreto "Voltar". Tocar fora fecha.

### Folha de edição de campo (cadastro e barra de meta)
Overlay igual; painel inferior fundo `--boi-fundo`, borda superior 4 px dourada, raio 24 px, padding `16px 14px 22px`, gap 12 px. Cabeçalho: título 17 px/900 + botão ✕ redondo 44 px.
- Numéricos (preço, meta, rendimento, desconto): `DisplayBalanca` com `unidade` (`R$/@`, `bois`, `%`, `kg/cab`) + dica 12 px/700 + `Teclado` modo normal. Verde salva e fecha. Ponto decimal só no preço.
- Nome: input 56 px (18 px/700, borda 2 px dourada, raio 12 px) + botão "✓ PRONTO" 60 px verde `135deg #166534 → #14532d`.
- Tipo: 3 botões 60 px (Boi / Vaca / Novilha), o atual marcado "✓ escolhido"; tocar salva e fecha.

---

## Interações e comportamento

**Retorno de toque (todas as teclas):** `transform: translateY(3px) scale(.97)` + sombra recolhida + `filter: brightness(1.06)`, transição 60 ms. Chips/modos: `translateY(2px) scale(.97)`. Sem highlight nativo (`-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`).

**Sons (Web Audio, osciladores curtos) + vibração (`navigator.vibrate`):**
- Dígito: 880 Hz square, 50 ms, vol .09 · vibra 8 ms
- ⌫: 260 Hz sine, 90 ms · vibra 14 ms
- CLR: 330→200 Hz sawtooth, 90 ms · vibra [12,40,12]
- Nº ⇄ kg / chips / pills: 560–700 Hz square, 50 ms
- **Verde (salvou):** 523→784→1046 Hz triangle, 130 ms cada · vibra [18,40,30]
- Erro (peso 0, sem número, lote finalizado): 180→150 Hz sine 120 ms · vibra [30,60,30] · display treme (±6 px, 350 ms)
- Alerta de peso: 440 Hz ×2 square 180 ms · vibra [60,80,60]
- Meta batida: 660→880→1320→1760 Hz triangle 160 ms (350 ms após o som do verde) · vibra [40,60,40,60,120]
- Desfazer: 600→400 Hz triangle · Finalizar: 523→659→784→1046 · Novo lote/Exportar: 784→1046
- Botão 🔊/🔇 liga/desliga todos os sons. O contexto de áudio é criado no primeiro toque (exigência do iOS).

**Confirmar (verde):**
1. Lote finalizado → erro.
2. Peso 0 → erro. Modo identificado sem número → erro e foca o campo número.
3. Peso por cabeça (peso ÷ qtd; qtd = 1 no identificado) fora de `[limiteMin=150, limiteMax=900]` kg → **alerta âmbar** (fundo `#fff3c4`, borda 3 px `#d97706`, texto `#4a2b05`, ⚠️ 24 px, título 15 px/900 "Peso muito baixo/alto", texto "N kg por cabeça. O normal fica entre 150 e 900 kg. Confere na balança?"), botões 48 px `CORRIGIR` (contorno) e `SALVAR ASSIM MESMO` (verde `#166534`, sombra `0 3px 0 #0f3d20`). Não salva até o usuário escolher. Qualquer dígito/⌫ fecha o alerta.
4. Salva: linha `{num, qtd|número, desconto?, peso líquido, arrobas, valor}` entra no **topo** da tabela; zera peso/número; **faixa de desfazer** por 5 s.

**Cálculo:** `líquido = max(0, peso − desconto × qtd)`; `arrobas = líquido × rendimento ÷ 15`; `valor = arrobas × preço/@`. Dinheiro sempre `R$ 1.234,56` (pt-BR, 2 casas); nos itens da tabela, formato compacto do DS (`R$12900`, `43.00@`).

**Faixa de desfazer:** fundo `#14532d`, raio 14 px, texto branco 14 px/800 ("✓ #3 salva: 1350 kg — 3 bois — desc 20 kg/cab" ou "✓ Vaca nº 15: 420 kg salvo"), botão `↶ DESFAZER` 52 px branco/texto `#14532d`, barra 5 px dourada esvaziando em 5 s (`scaleX 1→0 linear`). Entrada: `translateY(-10px)→0` 220 ms + pulso dourado (`box-shadow 0→22px` 600 ms). Desfazer restaura a lista anterior e devolve peso/número ao display.

**Meta do lote:** tocar na barra abre a folha da meta. Ao atingir `cabeças ≥ meta` pela primeira vez: barra verde, texto "meta batida ✓", som e vibração longa. Se desfizer e cair abaixo, volta ao dourado. Base de cálculo do resumo mostra "🐂 faltam N bois" enquanto não bate.

**Trocar modo durante a pesagem:** pill `SEM Nº / 🔢 COM Nº` alterna; zera o display. Identificado: régua some, tabela vira coluna "Boi Nº", teclado ganha `Nº ⇄ kg`, dica mostra "digitando o número do brinco / digitando o peso".

**FINALIZAR:** lote vazio → erro. Senão marca `finalizado`, abre a folha, habilita NOVO LOTE, teclado passa a dar erro. **NOVO LOTE:** volta ao cadastro com lista vazia, mantém preço/rendimento/desconto/tipo, limpa nome e meta.

**Modo Sol (☀️):** tela preta `#000`, superfícies `#121212`, dourado `#f5c518`, dinheiro `#ffd84a`, texto `#f7ecd6`/`#fff`, teclas escuras com texto branco (ativa: fundo dourado, texto preto), ⌫ `#d11f1f`, CLR `#c2410c`, verde `#22a04f→#15803d`, cabeçalho preto. Persistir a preferência.

**Tamanhos de toque:** nada abaixo de 44 px; teclas 72 px; ações principais 56–60 px.

## Estado
```
tela: 'cadastro' | 'pesagem'
cad: { nome, preco, meta, tipo: 'Boi'|'Vaca'|'Novilha', rendimento, desconto }
modo: 'normal' | 'identificado'
peso: string; numero: string; campo: 'numero'|'peso'; qtd: number; desconto: 0|10|20|30…
linhas: Linha[]  (mais recente primeiro)
alerta: { titulo, texto } | null
desfazer: { texto, anterior: Linha[], peso, numero } | null   (expira em 5 s)
folha: { campo, valor } | null;  folhaFinal: boolean
finalizado: boolean; metaBatida: boolean; som: boolean; sol: boolean
```
Sem chamadas de rede; tudo local/offline (o app roda no curral sem sinal). Persistir lote em andamento no dispositivo.

## Tokens
Cores (do DS): `--boi-marrom #8B4513`, `--boi-marrom-escuro #654321`, `--boi-dourado #d4af37`, `--boi-creme #f4e4c1`, `--boi-fundo #f5f1e8`, `--boi-texto #654321`, `--boi-display-1 #2d1f13`, `--boi-display-2 #3d2b1f`, `--boi-verde-1 #166534`, `--boi-verde-2 #14532d`, `--boi-vermelho #b91c1c`, `--boi-laranja #9a3412`, `--boi-dinheiro #f0d060`.
Novos desta tela: superfície `#fffdf7`, tinta `#2d1f13`, secundário `#6b533c`, borda dourada suave `rgba(212,175,55,.55)`, moldura do teclado `#3d2b1f → #20150e`, alerta `#fff3c4 / #d97706 / #4a2b05`, meta batida `#16a34a → #22c55e`.
Tipografia: fonte do sistema (SF Pro / -apple-system). Rótulos de seção 10–11 px/800 uppercase, letter-spacing .14–.18em. Números com `font-variant-numeric: tabular-nums`. Display: 46 px/900 (peso), 34 px/900 (número).
Raios: 12 (campos, chips, botões modais), 14 (teclas, display, ações), 24 (bloco do teclado, folhas), 999 (pills, trilho).
Espaçamento: 8 / 10 / 12 / 14 / 16 px. Padding lateral da tela 14 px (pesagem) e 16 px (cadastro).
Animações: `boi-entra` 220 ms ease; `boi-sobe` 220 ms ease (folhas); `boi-flash` 600 ms; `boi-esvazia` 5 s linear; `boi-treme` 350 ms; teclas 60 ms.

## Tweaks do protótipo (não são features do app)
`comecarNaPesagem` (abre já com dados), `modoSol`, `limiteMin`, `limiteMax`.

## Assets
Nenhuma imagem. Emojis de sistema: 🐄 ⚠️ 🔊 🔇 ☀️ 🔢 🐂 📥 💬 📊.
