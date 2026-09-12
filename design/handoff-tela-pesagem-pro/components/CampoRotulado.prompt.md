CampoRotulado from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.CampoRotulado` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface CampoRotuladoProps {
  rotulo: string;
  /** Linha menor cinza embaixo do rótulo, ex.: "opcional — mostra quantas faltam". */
  explicacao?: string;
  /** Valor mostrado; use `placeholder` para dica apagada. */
  valor?: string;
  placeholder?: string;
  /** "seleta" desenha a setinha dourada de escolher (ex.: tipo de gado). */
  tipo?: "texto" | "seleta";
}
```

## Examples

### Vendedor

```jsx
() => (
  <CampoRotulado rotulo="Vendedor / Comprador" placeholder="Nome" />
)
```

### ComExplicacao

```jsx
() => (
  <CampoRotulado
    rotulo="Quantas Cabeças tem o Lote?"
    explicacao="opcional — mostra quantas faltam"
    placeholder="Ex: 50"
  />
)
```

### TipoDeGado

```jsx
() => (
  <CampoRotulado rotulo="🐄 O que vai pesar?" valor="Vaca" tipo="seleta" />
)
```
