import { BotaoModal } from 'calculadora-de-boi-ds';

export const SalvarEmArquivos = () => (
  <BotaoModal variante="casa">📥 SALVAR EM ARQUIVOS DO CELULAR</BotaoModal>
);

export const MandarProWhatsApp = () => (
  <BotaoModal variante="whatsapp">💬 MANDAR PRO WHATSAPP</BotaoModal>
);

export const GooglePlanilhas = () => (
  <BotaoModal variante="planilha">📊 MANDAR PRO GOOGLE PLANILHAS</BotaoModal>
);

export const NovoLote = () => <BotaoModal variante="contorno">+ NOVO LOTE</BotaoModal>;

export const Voltar = () => <BotaoModal variante="discreto">Voltar</BotaoModal>;
