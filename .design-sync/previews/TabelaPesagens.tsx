import { TabelaPesagens } from 'calculadora-de-boi-ds';

export const LoteNormal = () => (
  <TabelaPesagens
    colunaQtd="Qtd"
    linhas={[
      { num: 2, qtd: '3', desconto: '-20kg', peso: '1350', arrobas: '43.00@', valor: 'R$12900' },
      { num: 1, qtd: '4', peso: '1800', arrobas: '60.00@', valor: 'R$18000' },
    ]}
  />
);

export const LoteIdentificado = () => (
  <TabelaPesagens
    colunaQtd="Vaca Nº"
    linhas={[
      { num: 2, qtd: '15', desconto: '-10kg', peso: '398', arrobas: '12.93@', valor: 'R$3233' },
      { num: 1, qtd: '12', peso: '420', arrobas: '14.00@', valor: 'R$3500' },
    ]}
  />
);
