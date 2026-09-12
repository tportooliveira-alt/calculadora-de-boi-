import { AvisoPeso } from 'calculadora-de-boi-ds';

export const PesoAltoDemais = () => (
  <AvisoPeso
    titulo="Peso muito alto"
    texto="1400 kg por cabeça. Boi costuma dar entre 250 e 900 kg. Confere na balança?"
  />
);

export const PesoBaixoDemais = () => (
  <AvisoPeso
    titulo="Peso muito baixo"
    texto="90 kg por cabeça. Novilha costuma dar entre 180 e 650 kg. Confere na balança?"
  />
);
