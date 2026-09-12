import { FolhaAjuste, CampoRotulado } from 'calculadora-de-boi-ds';

export const AjustarOLote = () => (
  <FolhaAjuste
    titulo="✏️ Ajustar o lote"
    nota="Pode corrigir agora — as pesagens continuam e as contas são refeitas na hora."
  >
    <CampoRotulado rotulo="Vendedor / Comprador" valor="Fazenda São Luiz" />
    <CampoRotulado rotulo="💰 Valor do Gado" valor="320.00" />
    <CampoRotulado rotulo="Rendimento (%)" valor="52" />
  </FolhaAjuste>
);

export const PorMeta = () => (
  <FolhaAjuste
    titulo="🎯 Meta de cabeças do lote"
    nota="Deixe vazio pra pesar sem meta. A barra enche conforme os animais entram."
  >
    <CampoRotulado rotulo="Quantas cabeças" valor="50" placeholder="Ex: 50" />
  </FolhaAjuste>
);
