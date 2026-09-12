CardResumo from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.CardResumo` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface CardResumoProps {
  titulo?: string;
  itens: ItemResumo[];
}
```

## Examples

### LoteEmAndamento

```jsx
() => (
  <CardResumo
    itens={[
      { rotulo: 'Total de Bois', valor: '7 bois' },
      { rotulo: 'Peso Total', valor: '3150 kg' },
      { rotulo: 'Média de @', valor: '14.71 @/cab' },
      { rotulo: 'Média de kg/boi', valor: '441.4 kg/cab' },
      { rotulo: 'Valor Total', valor: 'R$ 30.900,00', destaque: 'dinheiro', largo: true },
      { rotulo: 'Base de cálculo', valor: '50% rendimento · desconto total 60 kg', destaque: 'texto', largo: true },
    ]}
  />
)
```

### ComMetaDoLote

```jsx
() => (
  <CardResumo
    itens={[
      { rotulo: 'Total de Vacas', valor: '32 de 50' },
      { rotulo: 'Peso Total', valor: '13.440 kg' },
      { rotulo: 'Valor Total', valor: 'R$ 112.000,00', destaque: 'dinheiro', largo: true },
      { rotulo: 'Base de cálculo', valor: '50% rendimento · 🐂 faltam 18 vacas', destaque: 'texto', largo: true },
    ]}
  />
)
```
