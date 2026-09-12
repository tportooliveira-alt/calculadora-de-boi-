import { MolduraTeclado, Teclado } from 'calculadora-de-boi-ds';

export const TecladoPorBalancada = () => (
  <MolduraTeclado>
    <Teclado modo="normal" />
  </MolduraTeclado>
);

export const TecladoComBrinco = () => (
  <MolduraTeclado esquerda="Toca na caixinha" direita="Nº↔KG troca o campo">
    <Teclado modo="identificado" />
  </MolduraTeclado>
);
