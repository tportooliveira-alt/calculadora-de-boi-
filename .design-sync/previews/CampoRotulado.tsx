import { CampoRotulado } from 'calculadora-de-boi-ds';

export const Vendedor = () => (
  <CampoRotulado rotulo="Vendedor / Comprador" placeholder="Nome" />
);

export const ComExplicacao = () => (
  <CampoRotulado
    rotulo="Quantas Cabeças tem o Lote?"
    explicacao="opcional — mostra quantas faltam"
    placeholder="Ex: 50"
  />
);

export const TipoDeGado = () => (
  <CampoRotulado rotulo="🐄 O que vai pesar?" valor="Vaca" tipo="seleta" />
);
