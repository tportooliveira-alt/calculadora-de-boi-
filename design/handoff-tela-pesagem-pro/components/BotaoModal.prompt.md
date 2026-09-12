BotaoModal from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.BotaoModal` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface BotaoModalProps {
  children: React.ReactNode;
  variante?: "casa" | "whatsapp" | "planilha" | "contorno" | "discreto";
  onClick?: () => void;
}
```

## Examples

### SalvarEmArquivos

```jsx
() => (
  <BotaoModal variante="casa">📥 SALVAR EM ARQUIVOS DO CELULAR</BotaoModal>
)
```

### MandarProWhatsApp

```jsx
() => (
  <BotaoModal variante="whatsapp">💬 MANDAR PRO WHATSAPP</BotaoModal>
)
```

### GooglePlanilhas

```jsx
() => (
  <BotaoModal variante="planilha">📊 MANDAR PRO GOOGLE PLANILHAS</BotaoModal>
)
```

### NovoLote

```jsx
() => <BotaoModal variante="contorno">+ NOVO LOTE</BotaoModal>
```

### Voltar

```jsx
() => <BotaoModal variante="discreto">Voltar</BotaoModal>
```
