BotaoPrincipal from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.BotaoPrincipal` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface BotaoPrincipalProps {
  children: React.ReactNode;
  /** "cheio" = COMEÇAR PESAGEM; "contornado" = FINALIZAR LOTE (borda dourada 3px). */
  variante?: "cheio" | "contornado";
  onClick?: () => void;
}
```

## Examples

### ComecarPesagem

```jsx
() => <BotaoPrincipal>✓ COMEÇAR PESAGEM</BotaoPrincipal>
```

### FinalizarLote

```jsx
() => (
  <BotaoPrincipal variante="contornado">✓ FINALIZAR LOTE</BotaoPrincipal>
)
```
