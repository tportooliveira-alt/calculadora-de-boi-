import { BarraMeta } from 'calculadora-de-boi-ds';

export const Enchendo = () => (
  <BarraMeta progresso="8 de 10 bois" porcento={80} />
);

export const MetaBatida = () => (
  <BarraMeta progresso="10 de 10 bois · meta batida ✓" porcento={100} batida />
);

export const SemMeta = () => (
  <BarraMeta progresso="3 bois · toque para pôr meta" porcento={0} />
);
