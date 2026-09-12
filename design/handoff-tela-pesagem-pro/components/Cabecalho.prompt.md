Cabecalho from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.Cabecalho` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface CabecalhoProps {
  /** Título do app. */
  titulo?: string;
  /** Nome do vendedor/comprador mostrado à esquerda ("—" quando vazio). */
  cliente?: string;
  /** Preço combinado mostrado à direita, ex.: "R$ 300.00/@". */
  preco?: string;
  /** Mostra os botões ✓ FINALIZAR e + NOVO LOTE (tela de pesagem). */
  comAcoes?: boolean;
  /** Chamado ao tocar em ✓ FINALIZAR. */
  aoFinalizar?: () => void;
  /** Chamado ao tocar em + NOVO LOTE. */
  aoNovoLote?: () => void;
}
```

## Examples

### TelaDeCadastro

```jsx
() => <Cabecalho />
```

### TelaDePesagem

```jsx
() => (
  <Cabecalho cliente="Fazenda São Luiz" preco="R$ 300.00/@" comAcoes />
)
```
