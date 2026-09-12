FolhaFinalizar from calculadora-de-boi-ds. Use via `window.CalculadoraDeBoiDs.FolhaFinalizar` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface FolhaFinalizarProps {
  titulo?: string;
  /** Resumo em uma linha, ex.: "7 bois · 3150 kg · 103.0@ · R$ 30.900,00". */
  resumo?: string;
  children?: React.ReactNode;
}
```

## Examples

### Completa

```jsx
() => (
  <FolhaFinalizar resumo="7 bois · 3150 kg · 103.0@ · R$ 30.900,00">
    <BotaoModal variante="casa">📥 SALVAR EM ARQUIVOS DO CELULAR</BotaoModal>
    <BotaoModal variante="whatsapp">💬 MANDAR PRO WHATSAPP</BotaoModal>
    <BotaoModal variante="planilha">📊 MANDAR PRO GOOGLE PLANILHAS</BotaoModal>
    <BotaoModal variante="contorno">+ NOVO LOTE</BotaoModal>
    <BotaoModal variante="discreto">Voltar</BotaoModal>
  </FolhaFinalizar>
)
```
