import { LinhaPrevia } from 'calculadora-de-boi-ds';

export const PesandoPorBalancada = () => (
  <LinhaPrevia conta="≈ 62.40@ · R$ 19.968,00" dica="4 bois na balança" rotuloModo="SEM Nº" />
);

export const PesandoComBrinco = () => (
  <LinhaPrevia
    conta="≈ 15.60@ · R$ 4.992,00"
    dica="digitando o número do brinco"
    rotuloModo="🔢 COM Nº"
  />
);

export const SomDesligado = () => (
  <LinhaPrevia conta="≈ 0.00@" dica="pesa a balançada e aperta ✓" som={false} />
);
