ReguaQuantidade from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.ReguaQuantidade` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface ReguaQuantidadeProps {
  /** Rótulo à esquerda, no plural do animal: "Bois:", "Vacas:"... */
  rotulo?: string;
  /** Quantidade selecionada. */
  selecionado?: number;
  /** Quantos números mostrar ao redor do selecionado. */
  visiveis?: number;
}
```

## Examples

### QuatroBois

```jsx
() => <ReguaQuantidade rotulo="Bois:" selecionado={4} />
```

### UmaVaca

```jsx
() => <ReguaQuantidade rotulo="Vacas:" selecionado={1} />
```

### LoteGrande

```jsx
() => <ReguaQuantidade rotulo="Bois:" selecionado={15} />
```
