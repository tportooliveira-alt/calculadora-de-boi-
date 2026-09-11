import { FolhaFinalizar, BotaoModal } from 'calculadora-de-boi-ds';

export const Completa = () => (
  <FolhaFinalizar resumo="7 bois · 3150 kg · 103.0@ · R$ 30.900,00">
    <BotaoModal variante="casa">📥 SALVAR EM ARQUIVOS DO CELULAR</BotaoModal>
    <BotaoModal variante="whatsapp">💬 MANDAR PRO WHATSAPP</BotaoModal>
    <BotaoModal variante="planilha">📊 MANDAR PRO GOOGLE PLANILHAS</BotaoModal>
    <BotaoModal variante="contorno">+ NOVO LOTE</BotaoModal>
    <BotaoModal variante="discreto">Voltar</BotaoModal>
  </FolhaFinalizar>
);
