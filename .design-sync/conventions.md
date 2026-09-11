## Como construir com o design system da Calculadora de Boi

App de pesagem de gado para fazendeiro brasileiro, usado no iPhone (largura 390px) sob sol forte. Identidade "caipira-profissional": marrom + dourado, teclado gigante, linguagem simples ("Do nosso jeito", "Toca na caixinha").

**Sem provider.** Os componentes funcionam soltos. Envolva a raiz de cada tela em `<div className="boi-raiz">` (aplica fonte do sistema, fundo `#f5f1e8` e cor de texto) e limite a largura a 390-500px.

**Idioma de estilo: classes `boi-*` + tokens `var(--boi-*)`.** Para layout próprio (colunas, espaços), use `style` inline com flex/grid e `gap`, sempre com os tokens — nunca invente cores novas. Tokens principais (definidos em `styles.css`):
`--boi-marrom #8B4513` · `--boi-marrom-escuro #654321` (gradiente 135deg juntos) · `--boi-dourado #d4af37` (bordas 2-3px, destaques) · `--boi-creme #f4e4c1` (texto sobre marrom) · `--boi-fundo #f5f1e8` · `--boi-texto #654321` · `--boi-display-1/-2 #2d1f13/#3d2b1f` (fundos escuros) · `--boi-verde-1/-2 #166534/#14532d` (confirmar) · `--boi-vermelho #b91c1c` (apagar/excluir) · `--boi-laranja #9a3412` (CLR) · `--boi-dinheiro #f0d060` (valores em R$).

**Regras do domínio:** alvos de toque ≥44px (uso com luva); dinheiro sempre com 2 casas ("R$ 30.900,00"); números de peso com `font-variant-numeric: tabular-nums`; contraste alto (legível no sol); textos em PT-BR no tom do campo, sem jargão.

**Onde está a verdade:** `styles.css` (tokens + todas as classes `boi-*`) e o `.prompt.md` de cada componente. Leia-os antes de estilizar.

**Exemplo idiomático — topo da tela de pesagem:**
```jsx
<div className="boi-raiz" style={{ width: 390, display: 'flex', flexDirection: 'column' }}>
  <Cabecalho cliente="Fazenda São Luiz" preco="R$ 300.00/@" comAcoes />
  <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
    <DisplayBalanca peso="1800" />
    <ReguaQuantidade rotulo="Bois:" selecionado={4} />
    <ChipsDesconto selecionado={20} />
    <Teclado modo="normal" />
  </div>
</div>
```
