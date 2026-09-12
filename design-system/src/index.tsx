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
  /** Desconto aplicado por cabeça, ex.: "-20/cab" (opcional). */
  desconto?: string;
  peso: string;
  /** Peso já com o desconto abatido, ex.: "1.290" — é dele que sai a arroba. */
  pesoLiquido?: string;
  arrobas: string;
  valor: string;
}

/**
 * Tabela de pesagens com cabeçalho marrom, zebra clara e botão ✕ de
 * excluir em cada linha. A coluna do meio vira "VACA Nº" no modo
 * identificado.
 */
export interface TotalTabela {
  /** Total de cabeças do lote. */
  cabecas: string;
  /** Peso somado, como veio da balança. */
  peso: string;
  arrobas: string;
  valor: string;
}

export interface TabelaPesagensProps {
  /** Título da 2ª coluna: "Qtd" no modo normal, "Vaca Nº" etc. no identificado. */
  colunaQtd?: string;
  linhas: LinhaPesagem[];
  /** Linha escura de TOTAL, logo abaixo do cabeçalho — serve pra conferir somando a coluna na mão. */
  total?: TotalTabela;
  aoExcluir?: (num: number) => void;
}
export function TabelaPesagens({ colunaQtd = 'Qtd', linhas, total, aoExcluir }: TabelaPesagensProps) {
  return (
    <div className="boi-tabela">
      <div className="boi-tabela-linha boi-tabela-cabecalho">
        <span>#</span><span>{colunaQtd}</span><span>Peso kg</span><span>Arrobas</span><span>Valor R$</span><span></span>
      </div>
      {total ? (
        <div className="boi-tabela-linha boi-tabela-total">
          <span className="boi-tabela-total-rotulo">TOTAL</span>
          <span>{total.cabecas}</span>
          <span>{total.peso}</span>
          <span>{total.arrobas}</span>
          <span>{total.valor}</span>
          <span></span>
        </div>
      ) : null}
      {linhas.map((l) => (
        <div key={l.num} className="boi-tabela-linha boi-tabela-corpo">
          <span className="boi-tabela-num">{l.num}</span>
          <span>
            {l.qtd}
            {l.desconto ? <span className="boi-tabela-desconto">{l.desconto}</span> : null}
          </span>
          <span>
            {l.peso}
            {l.pesoLiquido ? <span className="boi-tabela-desconto">líq {l.pesoLiquido}</span> : null}
          </span>
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

/* ═══ Peças da v14 ═════════════════════════════════════════════════════════ */

/**
 * Faixa fixa no topo da pesagem: quantas cabeças já entraram, quanto pesou e
 * quanto isso dá em dinheiro. É o número que o comprador olha o dia inteiro.
 */
export interface FaixaTotaisProps {
  /** Ex.: "8 bois" — já com o plural certo do bicho escolhido. */
  cabecas: string;
  /** Peso somado como veio da balança, ex.: "3.630 kg". */
  peso: string;
  /** Valor do lote até agora, ex.: "R$ 39.492,27". Use "—" quando não há preço. */
  valor: string;
}
export function FaixaTotais({ cabecas, peso, valor }: FaixaTotaisProps) {
  return (
    <div className="boi-totais">
      <div className="boi-total-cel">
        <span className="boi-total-rotulo">Cabeças</span>
        <span className="boi-total-valor">{cabecas}</span>
      </div>
      <div className="boi-total-cel" style={{ flex: '1.1 1 0' }}>
        <span className="boi-total-rotulo">Peso</span>
        <span className="boi-total-valor">{peso}</span>
      </div>
      <div className="boi-total-cel boi-total-cel--dinheiro">
        <span className="boi-total-rotulo">Total</span>
        <span className="boi-total-valor">{valor}</span>
      </div>
    </div>
  );
}

/**
 * Barra de meta do lote. Enche de dourado conforme os animais entram e fica
 * verde quando bate a meta. A faixa inteira é tocável pra mudar a meta.
 */
export interface BarraMetaProps {
  /** Ex.: "8 de 10 bois" ou "toque para pôr meta". */
  progresso: string;
  /** 0 a 100. */
  porcento?: number;
  /** Pinta de verde — a meta foi batida. */
  batida?: boolean;
  aoTocar?: () => void;
}
export function BarraMeta({ progresso, porcento = 0, batida = false, aoTocar }: BarraMetaProps) {
  return (
    <div className="boi-meta" onClick={aoTocar}>
      <div className="boi-meta-topo">
        <span className="boi-meta-rotulo">Meta do lote</span>
        <span className="boi-meta-progresso">{progresso}</span>
      </div>
      <div className="boi-meta-trilho">
        <div
          className={'boi-meta-fill' + (batida ? ' boi-meta-fill--batida' : '')}
          style={{ width: Math.max(0, Math.min(100, porcento)) + '%' }}
        />
      </div>
    </div>
  );
}

/**
 * Linha logo abaixo do visor: mostra quanto vale o peso que está digitado
 * ANTES de salvar, e traz os botões de trocar o jeito de pesar, silenciar e
 * ligar o Modo Sol.
 */
export interface LinhaPreviaProps {
  /** Ex.: "≈ 48.19@ · R$ 15.419,73". */
  conta: string;
  /** Ex.: "4 bois na balança" ou "digitando o número do brinco". */
  dica?: string;
  /** Texto da pílula: "SEM Nº" ou "🔢 COM Nº". */
  rotuloModo?: string;
  som?: boolean;
  aoTrocarModo?: () => void;
  aoTrocarSom?: () => void;
  aoTrocarSol?: () => void;
}
export function LinhaPrevia({ conta, dica, rotuloModo = 'SEM Nº', som = true, aoTrocarModo, aoTrocarSom, aoTrocarSol }: LinhaPreviaProps) {
  return (
    <div className="boi-previa">
      <div className="boi-previa-texto">
        <span className="boi-previa-conta">{conta}</span>
        {dica ? <span className="boi-previa-dica">{dica}</span> : null}
      </div>
      <button className="boi-pilula" onClick={aoTrocarModo}>{rotuloModo}</button>
      <button className="boi-redondo" aria-label="Som" onClick={aoTrocarSom}>{som ? '🔊' : '🔇'}</button>
      <button className="boi-redondo" aria-label="Modo sol" onClick={aoTrocarSol}>☀️</button>
    </div>
  );
}

/**
 * Moldura escura que envolve o teclado, separando a área de digitar do resto
 * da tela. Coloque o `Teclado` dentro dela.
 */
export interface MolduraTecladoProps {
  /** Canto esquerdo, ex.: "Toca na caixinha". */
  esquerda?: string;
  /** Canto direito, ex.: "verde = entra no lote". */
  direita?: string;
  children?: any;
}
export function MolduraTeclado({ esquerda = 'Toca na caixinha', direita = 'verde = entra no lote', children }: MolduraTecladoProps) {
  return (
    <div className="boi-moldura">
      <div className="boi-moldura-titulo">
        <span className="boi-moldura-titulo-esq">{esquerda}</span>
        <span className="boi-moldura-traco" />
        <span className="boi-moldura-titulo-dir">{direita}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * Aviso âmbar que aparece por cima quando o peso por cabeça está fora do
 * normal pro bicho escolhido. Não empurra o teclado: é sobreposto.
 */
export interface AvisoPesoProps {
  /** "Peso muito baixo" ou "Peso muito alto". */
  titulo: string;
  /** Ex.: "1400 kg por cabeça. Boi costuma dar entre 250 e 900 kg. Confere na balança?" */
  texto: string;
  aoCorrigir?: () => void;
  aoSalvarAssimMesmo?: () => void;
}
export function AvisoPeso({ titulo, texto, aoCorrigir, aoSalvarAssimMesmo }: AvisoPesoProps) {
  return (
    <div className="boi-aviso-peso">
      <div className="boi-aviso-peso-cabeca">
        <span className="boi-aviso-peso-icone">⚠️</span>
        <div>
          <span className="boi-aviso-peso-titulo">{titulo}</span>
          <span className="boi-aviso-peso-texto">{texto}</span>
        </div>
      </div>
      <div className="boi-aviso-peso-botoes">
        <button className="boi-aviso-peso-corrigir" onClick={aoCorrigir}>CORRIGIR</button>
        <button className="boi-aviso-peso-salvar" onClick={aoSalvarAssimMesmo}>SALVAR ASSIM MESMO</button>
      </div>
    </div>
  );
}

/**
 * Os dois botões grandes logo abaixo do teclado, na altura do polegar.
 * O "+ NOVO LOTE" fica apagado até o lote ser finalizado.
 */
export interface RodapeAcoesProps {
  /** Libera o "+ NOVO LOTE". */
  finalizado?: boolean;
  aoFinalizar?: () => void;
  aoNovoLote?: () => void;
}
export function RodapeAcoes({ finalizado = false, aoFinalizar, aoNovoLote }: RodapeAcoesProps) {
  return (
    <div className="boi-rodape">
      <button className="boi-rodape-finalizar" onClick={aoFinalizar}>✓ FINALIZAR</button>
      <button
        className={'boi-rodape-novo' + (finalizado ? '' : ' boi-rodape-novo--travado')}
        onClick={aoNovoLote}
      >
        + NOVO LOTE
      </button>
    </div>
  );
}

/**
 * Folha que sobe de baixo pra corrigir alguma coisa do lote sem perder as
 * pesagens (meta, preço da arroba, rendimento…).
 */
export interface FolhaAjusteProps {
  /** Ex.: "✏️ Ajustar o lote" ou "🎯 Meta de cabeças do lote". */
  titulo: string;
  /** Linha pequena explicando o que acontece ao confirmar. */
  nota?: string;
  /** Texto do botão verde. */
  rotuloPronto?: string;
  children?: any;
  aoConfirmar?: () => void;
}
export function FolhaAjuste({ titulo, nota, rotuloPronto = '✓ PRONTO', children, aoConfirmar }: FolhaAjusteProps) {
  return (
    <div className="boi-folha-ajuste">
      <span className="boi-folha-ajuste-titulo">{titulo}</span>
      {nota ? <span className="boi-folha-ajuste-nota">{nota}</span> : null}
      {children}
      <button className="boi-folha-ajuste-pronto" onClick={aoConfirmar}>{rotuloPronto}</button>
    </div>
  );
}
