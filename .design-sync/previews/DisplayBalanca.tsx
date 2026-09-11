import { DisplayBalanca } from 'calculadora-de-boi-ds';

export const PesoDigitado = () => <DisplayBalanca peso="1800" />;

export const Zerado = () => <DisplayBalanca peso="0" />;

export const IdentificadoDigitandoNumero = () => (
  <DisplayBalanca peso="0" numeroAnimal="15" rotuloNumero="VACA Nº" campoAtivo="numero" />
);

export const IdentificadoDigitandoPeso = () => (
  <DisplayBalanca peso="398" numeroAnimal="15" rotuloNumero="VACA Nº" campoAtivo="peso" />
);
