DisplayBalanca from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.DisplayBalanca` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface DisplayBalancaProps {
  /** Peso digitado, ex.: "1800" (mostre "0" quando vazio). */
  peso: string;
  /** Unidade ao lado do peso. */
  unidade?: string;
  /** Número do animal no modo identificado (ex.: "15"); omita no modo normal. */
  numeroAnimal?: string;
  /** Rótulo da caixa do número, ex.: "VACA Nº" ou "BOI Nº". */
  rotuloNumero?: string;
  /** Qual campo está recebendo os dígitos (só no modo identificado). */
  campoAtivo?: "numero" | "peso";
}
```

## Examples

### PesoDigitado

```jsx
() => <DisplayBalanca peso="1800" />
```

### Zerado

```jsx
() => <DisplayBalanca peso="0" />
```

### IdentificadoDigitandoNumero

```jsx
() => (
  <DisplayBalanca peso="0" numeroAnimal="15" rotuloNumero="VACA Nº" campoAtivo="numero" />
)
```

### IdentificadoDigitandoPeso

```jsx
() => (
  <DisplayBalanca peso="398" numeroAnimal="15" rotuloNumero="VACA Nº" campoAtivo="peso" />
)
```
