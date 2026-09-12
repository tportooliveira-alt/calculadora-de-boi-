ChipsDesconto from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.ChipsDesconto` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface ChipsDescontoProps {
  /** Valores em kg; 0 = "Sem". */
  valores?: number[];
  /** Valor selecionado (em kg). */
  selecionado?: number;
  aoEscolher?: (valor: number) => void;
}
```

## Examples

### SemDesconto

```jsx
() => <ChipsDesconto selecionado={0} />
```

### FemeasPrenhas

```jsx
() => <ChipsDesconto selecionado={20} />
```
