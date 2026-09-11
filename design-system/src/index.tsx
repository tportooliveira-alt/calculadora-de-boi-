import type { ReactNode } from 'react';

/**
 * Cabeçalho marrom do app, com título dourado, linha do cliente/preço e
 * botões de ação opcionais (✓ FINALIZAR e + NOVO LOTE).
 */
export interface CabecalhoProps {
  /** Título do app. */
  titulo?: string;
  /** Nome do vendedor/comprador mostrado à esquerda ("—" quando vazio). */
  cliente?: string;
  /** Preço combinado mostrado à direita, ex.: "R$ 300.00/@". */
  preco?: string;
  /** Mostra os botões ✓ FINALIZAR e + NOVO LOTE (tela de pesagem). */
  comAcoes?: boolean;
  /** Chamado ao tocar em ✓ FINALIZAR. */
  aoFinalizar?: () => void;
  /** Chamado ao tocar em + NOVO LOTE. */
  aoNovoLote?: () => void;
}
export function Cabecalho({ titulo = '🐂 CALCULADORA DE BOI', cliente = '—', preco = '—', comAcoes = false, aoFinalizar, aoNovoLote }: CabecalhoProps) {
  return (
    <div className="boi-cabecalho">
      <div className="boi-cabecalho-titulo">{titulo}</div>
      <div className="boi-cabecalho-sub"><span>{cliente}</span><span>{preco}</span></div>
      {comAcoes ? (
        <div className="boi-cabecalho-acoes">
          <button className="boi-botao-cabecalho" onClick={aoFinalizar}>✓ FINALIZAR</button>
          <button className="boi-botao-cabecalho" onClick={aoNovoLote}>+ NOVO LOTE</button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Botão principal marrom com texto dourado — usado em "✓ COMEÇAR PESAGEM"
 * e "✓ FINALIZAR LOTE" (este com borda dourada, variante "contornado").
 */
export interface BotaoPrincipalProps {
  children: ReactNode;
  /** "cheio" = COMEÇAR PESAGEM; "contornado" = FINALIZAR LOTE (borda dourada 3px). */
  variante?: 'cheio' | 'contornado';
  onClick?: () => void;
}
export function BotaoPrincipal({ children, variante = 'cheio', onClick }: BotaoPrincipalProps) {
  return (
    <button className={'boi-botao-principal' + (variante === 'contornado' ? ' boi-botao-principal--contornado' : '')} onClick={onClick}>
      {children}
    </button>
  );
}

/**
 * Display estilo balança digital: fundo marrom-escuro, borda dourada,
 * número gigante dourado. No modo identificado mostra também a caixa do
 * número do animal (ex.: "VACA Nº 15"), com anel dourado no campo ativo.
 */
export interface DisplayBalancaProps {
  /** Peso digitado, ex.: "1800" (mostre "0" quando vazio). */
  peso: string;
  /** Unidade ao lado do peso. */
  unidade?: string;
  /** Número do animal no modo identificado (ex.: "15"); omita no modo normal. */
  numeroAnimal?: string;
  /** Rótulo da caixa do número, ex.: "VACA Nº" ou "BOI Nº". */
  rotuloNumero?: string;
  /** Qual campo está recebendo os dígitos (só no modo identificado). */
  campoAtivo?: 'numero' | 'peso';
}
export function DisplayBalanca({ peso, unidade = 'kg', numeroAnimal, rotuloNumero = 'BOI Nº', campoAtivo = 'numero' }: DisplayBalancaProps) {
  const identificado = numeroAnimal !== undefined;
  if (!identificado) {
    return (
      <div className="boi-display">
        <span className="boi-display-valor">{peso}</span>
        <span className="boi-display-unidade">{unidade}</span>
      </div>
    );
  }
  return (
    <div className="boi-display boi-display--identificado">
      <div className={'boi-display-campo' + (campoAtivo === 'numero' ? ' boi-display-campo--ativo' : '')}>
        <span className="boi-display-unidade" style={{ marginLeft: 0 }}>{rotuloNumero}</span>
        <span className="boi-display-numero">{numeroAnimal || '—'}</span>
      </div>
      <div className={'boi-display-campo' + (campoAtivo === 'peso' ? ' boi-display-campo--ativo' : '')}>
        <span className="boi-display-valor">{peso}</span>
        <span className="boi-display-unidade">{unidade}</span>
      </div>
    </div>
  );
}

/**
 * Uma tecla do teclado gigante de curral (60px de altura). Tipos: número
 * branco, apagar vermelho (⌫), limpar laranja (CLR), confirmar verde (✓)
 * e alternar marrom (Nº↔KG, só no modo identificado).
 */
export interface TeclaProps {
  children: ReactNode;
  tipo?: 'numero' | 'apagar' | 'limpar' | 'confirmar' | 'alternar';
  /** Ocupa 2 colunas (o "0" no modo normal). */
  larga?: boolean;
  onClick?: () => void;
}
export function Tecla({ children, tipo = 'numero', larga = false, onClick }: TeclaProps) {
  const mod = tipo === 'numero' ? '' : ' boi-tecla--' + tipo;
  return (
    <button className={'boi-tecla' + mod + (larga ? ' boi-tecla--larga' : '')} onClick={onClick}>
      {children}
    </button>
  );
}

/**
 * Teclado completo do app, já montado nas duas variantes: "normal"
 * (15 teclas, 0 largo) e "identificado" (16 teclas com Nº↔KG).
 */
export interface TecladoProps {
  modo?: 'normal' | 'identificado';
  /** Recebe o dígito tocado ("0"-"9", "00", "."). */
  aoDigitar?: (digito: string) => void;
  aoApagar?: () => void;
  aoLimpar?: () => void;
  aoConfirmar?: () => void;
  /** Só no modo identificado: alterna entre número e peso. */
  aoAlternar?: () => void;
}
export function Teclado({ modo = 'normal', aoDigitar, aoApagar, aoLimpar, aoConfirmar, aoAlternar }: TecladoProps) {
  const d = (t: string) => () => aoDigitar && aoDigitar(t);
  return (
    <div className="boi-teclado">
      <Tecla onClick={d('7')}>7</Tecla><Tecla onClick={d('8')}>8</Tecla><Tecla onClick={d('9')}>9</Tecla>
      <Tecla tipo="apagar" onClick={aoApagar}>⌫</Tecla>
      <Tecla onClick={d('4')}>4</Tecla><Tecla onClick={d('5')}>5</Tecla><Tecla onClick={d('6')}>6</Tecla>
      <Tecla tipo="limpar" onClick={aoLimpar}>CLR</Tecla>
      <Tecla onClick={d('1')}>1</Tecla><Tecla onClick={d('2')}>2</Tecla><Tecla onClick={d('3')}>3</Tecla>
      <Tecla onClick={d('.')}>.</Tecla>
      {modo === 'identificado' ? <Tecla tipo="alternar" onClick={aoAlternar}>Nº↔KG</Tecla> : null}
      <Tecla larga={modo === 'normal'} onClick={d('0')}>0</Tecla>
      <Tecla onClick={d('00')}>00</Tecla>
      <Tecla tipo="confirmar" onClick={aoConfirmar}>✓</Tecla>
    </div>
  );
}

/**
 * Linha de chips de desconto por cabeça (Sem / -5kg / -10kg / -20kg).
 * O selecionado fica marrom com texto dourado. Altura 44px (uso com luva).
 */
export interface ChipsDescontoProps {
  /** Valores em kg; 0 = "Sem". */
  valores?: number[];
  /** Valor selecionado (em kg). */
  selecionado?: number;
  aoEscolher?: (valor: number) => void;
}
export function ChipsDesconto({ valores = [0, 5, 10, 20], selecionado = 0, aoEscolher }: ChipsDescontoProps) {
  return (
    <div className="boi-chips">
      {valores.map((v) => (
        <button
          key={v}
          className={'boi-chip' + (v === selecionado ? ' boi-chip--selecionado' : '')}
          onClick={() => aoEscolher && aoEscolher(v)}
        >
          {v === 0 ? 'Sem' : '-' + v + 'kg'}
        </button>
      ))}
    </div>
  );
}

/**
 * Régua de quantidade de animais por balançada (1 a 20), com o número
 * escolhido dentro do anel dourado.
 */
export interface ReguaQuantidadeProps {
  /** Rótulo à esquerda, no plural do animal: "Bois:", "Vacas:"... */
  rotulo?: string;
  /** Quantidade selecionada. */
  selecionado?: number;
  /** Quantos números mostrar ao redor do selecionado. */
  visiveis?: number;
}
export function ReguaQuantidade({ rotulo = 'Bois:', selecionado = 1, visiveis = 6 }: ReguaQuantidadeProps) {
  const inicio = Math.max(1, selecionado - Math.floor(visiveis / 2));
  const nums: number[] = [];
  for (let i = inicio; i < inicio + visiveis && i <= 20; i++) nums.push(i);
  return (
    <div className="boi-regua">
      <span className="boi-regua-rotulo">{rotulo}</span>
      <div className="boi-regua-trilho">
        {nums.map((n, i) => (
          <span
            key={n}
            className={
              'boi-regua-item' +
              (n === selecionado ? ' boi-regua-item--selecionado' : i === 0 || i === nums.length - 1 ? ' boi-regua-item--longe' : '')
            }
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Campo do cadastro: rótulo forte, explicação opcional em letra menor e
 * a entrada com borda dourada (texto ou seleta com setinha).
 */
export interface CampoRotuladoProps {
  rotulo: string;
  /** Linha menor cinza embaixo do rótulo, ex.: "opcional — mostra quantas faltam". */
  explicacao?: string;
  /** Valor mostrado; use `placeholder` para dica apagada. */
  valor?: string;
  placeholder?: string;
  /** "seleta" desenha a setinha dourada de escolher (ex.: tipo de gado). */
  tipo?: 'texto' | 'seleta';
}
export function CampoRotulado({ rotulo, explicacao, valor, placeholder, tipo = 'texto' }: CampoRotuladoProps) {
  return (
    <div className="boi-campo">
      <span className="boi-campo-rotulo">
        {rotulo}
        {explicacao ? <span className="boi-campo-explicacao">{explicacao}</span> : null}
      </span>
      {tipo === 'seleta' ? (
        <div className="boi-campo-seleta">
          <span>{valor}</span>
          <svg width="14" height="14" viewBox="0 0 16 16"><path d="M3 6l5 5 5-5" fill="none" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
      ) : (
        <input className="boi-campo-entrada" defaultValue={valor} placeholder={placeholder} readOnly />
      )}
    </div>
  );
}

/**
 * Os dois botões de tipo de lote do cadastro: "🐂 Do nosso jeito
 * (por balançada)" e "Identificar (nº do boi + peso)".
 */
export interface BotoesModoProps {
  /** Qual está selecionado. */
  selecionado?: 'normal' | 'identificado';
  aoEscolher?: (modo: 'normal' | 'identificado') => void;
}
export function BotoesModo({ selecionado = 'normal', aoEscolher }: BotoesModoProps) {
  return (
    <div className="boi-modos">
      <button className={'boi-modo' + (selecionado === 'normal' ? ' boi-modo--selecionado' : '')} onClick={() => aoEscolher && aoEscolher('normal')}>
        🐂 Do nosso jeito<span className="boi-modo-sub">por balançada</span>
      </button>
      <button className={'boi-modo' + (selecionado === 'identificado' ? ' boi-modo--selecionado' : '')} onClick={() => aoEscolher && aoEscolher('identificado')}>
        Identificar<span className="boi-modo-sub">nº do boi + peso</span>
      </button>
    </div>
  );
}

/** Uma linha da tabela de pesagens. */
export interface LinhaPesagem {
  /** Número da balançada (1, 2, 3...). */
  num: number;
  /** Quantidade de animais OU o número do animal no modo identificado. */
  qtd: string;
  /** Desconto aplicado, ex.: "-20kg" (opcional). */
  desconto?: string;
  peso: string;
  arrobas: string;
  valor: string;
}

/**
 * Tabela de pesagens com cabeçalho marrom, zebra clara e botão ✕ de
 * excluir em cada linha. A coluna do meio vira "VACA Nº" no modo
 * identificado.
 */
export interface TabelaPesagensProps {
  /** Título da 2ª coluna: "Qtd" no modo normal, "Vaca Nº" etc. no identificado. */
  colunaQtd?: string;
  linhas: LinhaPesagem[];
  aoExcluir?: (num: number) => void;
}
export function TabelaPesagens({ colunaQtd = 'Qtd', linhas, aoExcluir }: TabelaPesagensProps) {
  return (
    <div className="boi-tabela">
      <div className="boi-tabela-linha boi-tabela-cabecalho">
        <span>#</span><span>{colunaQtd}</span><span>Peso kg</span><span>Arrobas</span><span>Valor R$</span><span></span>
      </div>
      {linhas.map((l) => (
        <div key={l.num} className="boi-tabela-linha boi-tabela-corpo">
          <span className="boi-tabela-num">{l.num}</span>
          <span>
            {l.qtd}
            {l.desconto ? <span className="boi-tabela-desconto">{l.desconto}</span> : null}
          </span>
          <span>{l.peso}</span>
          <span>{l.arrobas}</span>
          <span>{l.valor}</span>
          <button className="boi-tabela-excluir" onClick={() => aoExcluir && aoExcluir(l.num)}>✕</button>
        </div>
      ))}
    </div>
  );
}

/** Um quadradinho do card de resumo. */
export interface ItemResumo {
  rotulo: string;
  valor: string;
  /** "dinheiro" = amarelo grande (Valor Total); "texto" = linha creme (base de cálculo). */
  destaque?: 'normal' | 'dinheiro' | 'texto';
  /** Ocupa a largura toda. */
  largo?: boolean;
}

/**
 * Card escuro "📊 RESUMO DO LOTE" com a grade de totais — o Valor Total
 * sai em amarelo grande, a base de cálculo em linha creme.
 */
export interface CardResumoProps {
  titulo?: string;
  itens: ItemResumo[];
}
export function CardResumo({ titulo = '📊 RESUMO DO LOTE', itens }: CardResumoProps) {
  return (
    <div className="boi-resumo">
      <div className="boi-resumo-titulo">{titulo}</div>
      <div className="boi-resumo-grade">
        {itens.map((it, i) => (
          <div key={i} className={'boi-resumo-item' + (it.largo ? ' boi-resumo-item--largo' : '') + (it.destaque === 'texto' ? ' boi-resumo-item--base' : '')}>
            <div className="boi-resumo-rotulo">{it.rotulo}</div>
            <div className={'boi-resumo-valor' + (it.destaque === 'dinheiro' ? ' boi-resumo-valor--dinheiro' : it.destaque === 'texto' ? ' boi-resumo-valor--texto' : '')}>
              {it.valor}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Aviso verde-escuro de pesagem salva (toast flutuante), ex.:
 * "✓ Vaca nº 12: 420 kg salvo".
 */
export interface AvisoSalvoProps {
  children: ReactNode;
}
export function AvisoSalvo({ children }: AvisoSalvoProps) {
  return <div className="boi-aviso">{children}</div>;
}

/**
 * Botão grande do modal de finalizar. Variantes: "casa" (marrom/dourado,
 * Salvar em Arquivos), "whatsapp" (verde do zap), "planilha" (verde
 * Google), "contorno" (branco com borda, + NOVO LOTE) e "discreto"
 * (Voltar, sublinhado).
 */
export interface BotaoModalProps {
  children: ReactNode;
  variante?: 'casa' | 'whatsapp' | 'planilha' | 'contorno' | 'discreto';
  onClick?: () => void;
}
export function BotaoModal({ children, variante = 'casa', onClick }: BotaoModalProps) {
  return (
    <button className={'boi-botao-modal boi-botao-modal--' + variante} onClick={onClick}>
      {children}
    </button>
  );
}

/**
 * Folha que sobe de baixo ao finalizar o lote: título "🐄 LOTE
 * FINALIZADO", resumo em uma linha e os botões de exportar.
 */
export interface FolhaFinalizarProps {
  titulo?: string;
  /** Resumo em uma linha, ex.: "7 bois · 3150 kg · 103.0@ · R$ 30.900,00". */
  resumo?: string;
  children?: ReactNode;
}
export function FolhaFinalizar({ titulo = '🐄 LOTE FINALIZADO', resumo, children }: FolhaFinalizarProps) {
  return (
    <div className="boi-folha">
      <div>
        <div className="boi-folha-titulo">{titulo}</div>
        {resumo ? <div className="boi-folha-resumo">{resumo}</div> : null}
      </div>
      {children}
    </div>
  );
}
