BotoesModo from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.BotoesModo` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface BotoesModoProps {
  /** Qual está selecionado. */
  selecionado?: "normal" | "identificado";
  aoEscolher?: (modo: "normal" | "identificado") => void;
}
```

## Examples

### NormalSelecionado

```jsx
() => <BotoesModo selecionado="normal" />
```

### IdentificadoSelecionado

```jsx
() => <BotoesModo selecionado="identificado" />
```
