Teclado from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.Teclado` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface TecladoProps {
  modo?: "normal" | "identificado";
  /** Recebe o dígito tocado ("0"-"9", "00", "."). */
  aoDigitar?: (digito: string) => void;
  aoApagar?: () => void;
  aoLimpar?: () => void;
  aoConfirmar?: () => void;
  /** Só no modo identificado: alterna entre número e peso. */
  aoAlternar?: () => void;
}
```

## Examples

### ModoNormal

```jsx
() => <Teclado modo="normal" />
```

### ModoIdentificado

```jsx
() => <Teclado modo="identificado" />
```
