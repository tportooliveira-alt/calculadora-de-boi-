/**
 * PONTE ENTRE A CALCULADORA DE BOI E A PLANILHA DA FAZENDA
 *
 * Cole este código no Apps Script da SUA planilha (o passo a passo está no
 * arquivo COMO-LIGAR.md). Depois de publicar, o aplicativo passa a jogar cada
 * lote finalizado direto na aba PESAGENS — você não digita nada.
 *
 * Com as pesagens, a ponte monta sozinha o histórico de cada animal pelo
 * número do brinco: abas ANIMAIS, HISTÓRICO e CONSULTA.
 *
 * Os dados vão do celular direto pra SUA planilha. Não passam por servidor de
 * ninguém.
 */

// ─── A ÚNICA COISA QUE VOCÊ PRECISA MUDAR ────────────────────────────────────
// Troque por uma palavra sua. É o que impede um estranho de escrever na sua
// planilha caso descubra o endereço. A mesma palavra vai no aplicativo.
const SENHA = 'troque-esta-palavra';

// Nome da aba que recebe as pesagens. Só mude se você renomeou a aba.
const ABA = 'PESAGENS';

// Colunas que a ponte preenche. As que faltam (H, J, L) têm fórmula na
// planilha e são calculadas sozinhas — escrever nelas apagaria a conta.
const COL = {
  data: 1,        // A
  lote: 2,        // B
  vendedor: 3,    // C
  brinco: 4,      // D
  cabecas: 5,     // E
  peso: 6,        // F
  desconto: 7,    // G
  rendimento: 9,  // I
  precoArroba: 11,// K
  id: 13          // M — nº que o app dá pra cada pesagem: mandar o mesmo lote
                  //     duas vezes não repete as linhas
};

const PRIMEIRA_LINHA = 3;   // linha 1 é o título, linha 2 é o cabeçalho

// Abas do histórico por animal. A ponte MONTA essas abas a partir da aba
// PESAGENS toda vez que chega lote novo — o que for digitado nelas some na
// próxima atualização. A única casa pra digitar é a do brinco, na CONSULTA.
const ABA_ANIMAIS  = 'ANIMAIS';
const ABA_HIST     = 'HISTÓRICO';
const ABA_CONSULTA = 'CONSULTA';

const KG    = '#,##0.0" kg"';
const GANHO = '+#,##0.0" kg";-#,##0.0" kg";0" kg"';
const DIA_KG= '+0.00" kg/dia";-0.00" kg/dia";0" kg/dia"';
const DATA  = 'dd/mm/yyyy';
const TEXTO = '@';           // brinco é texto: senão "010" vira o número 10

// [cabeçalho, largura, formato]. A última coluna é a chave de busca (010 e
// 10 são o mesmo brinco) e fica escondida.
const CAB_HIST = [
  ['DATA', 90, DATA], ['BRINCO', 80, TEXTO], ['PESO (kg por cabeça)', 110, KG],
  ['GANHO DESDE A ANTERIOR', 110, GANHO], ['DIAS DESDE A ANTERIOR', 90, '0'],
  ['GANHO POR DIA', 105, DIA_KG], ['COMO PESOU', 175, null], ['LOTE', 110, null],
  ['VENDEDOR / ORIGEM', 160, null], ['CHAVE', 60, TEXTO]
];
const CAB_ANIMAIS = [
  ['BRINCO', 80, TEXTO], ['PESAGENS', 80, '0'], ['1ª PESAGEM', 90, DATA],
  ['PESO NA 1ª', 100, KG], ['ÚLTIMA PESAGEM', 100, DATA], ['PESO ATUAL', 100, KG],
  ['GANHO DESDE A ANTERIOR', 110, GANHO], ['GANHO TOTAL', 100, GANHO],
  ['DIAS (da 1ª até a última)', 105, '0'], ['GANHO POR DIA', 105, DIA_KG],
  ['ÚLTIMO PESO FOI', 175, null], ['ÚLTIMO LOTE', 110, null], ['CHAVE', 60, TEXTO]
];

const MARROM = '#8B4513', DOURADO = '#D4AF37', CREME = '#F4E4C1', TINTA = '#2D1F13', AMARELO = '#FFF9C4';
const UM_DIA = 24 * 60 * 60 * 1000;


function doPost(e) {
  // Duas pesagens chegando no mesmo instante escreveriam na mesma linha.
  const trava = LockService.getScriptLock();
  try {
    trava.waitLock(25000);
  } catch (err) {
    return responder({ ok: false, erro: 'planilha ocupada, tente de novo' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responder({ ok: false, erro: 'chegou vazio' });
    }
    const dados = JSON.parse(e.postData.contents);

    if (String(dados.senha || '') !== SENHA) {
      return responder({ ok: false, erro: 'senha errada' });
    }

    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheetByName(ABA);
    if (!aba) {
      return responder({ ok: false, erro: 'não encontrei a aba ' + ABA });
    }

    const pesagens = dados.pesagens || [];
    if (!pesagens.length) return responder({ ok: false, erro: 'lote sem pesagem' });

    garantirColunaId(aba);
    const jaGravadas = idsGravados(aba);
    let linha = primeiraLinhaVazia(aba);
    const quando = dados.data ? new Date(dados.data) : new Date();
    let escritas = 0, repetidas = 0;

    pesagens.forEach(function (p) {
      const id = String(p.id || '');
      if (id && jaGravadas[id]) { repetidas++; return; }
      escrever(aba, linha, COL.data, quando);
      escrever(aba, linha, COL.lote, dados.lote || '');
      escrever(aba, linha, COL.vendedor, dados.vendedor || '');
      escreverTexto(aba, linha, COL.brinco, p.boi || '');
      escrever(aba, linha, COL.cabecas, Number(p.qtd) || 1);
      escrever(aba, linha, COL.peso, Number(p.peso) || 0);
      escrever(aba, linha, COL.desconto, Number(p.desconto) || 0);
      escrever(aba, linha, COL.rendimento, (Number(dados.rendimento) || 52) / 100);
      escrever(aba, linha, COL.precoArroba, Number(dados.preco) || 0);
      if (id) { escreverTexto(aba, linha, COL.id, id); jaGravadas[id] = true; }
      linha++;
      escritas++;
    });

    // As pesagens já estão gravadas: se o histórico falhar, avisa sem perder nada
    const resposta = { ok: true, escritas: escritas, repetidas: repetidas, aba: ABA };
    try {
      SpreadsheetApp.flush();
      resposta.animais = atualizarAnimais(planilha);
    } catch (err) {
      resposta.erro_historico = String(err);
    }
    return responder(resposta);

  } catch (err) {
    return responder({ ok: false, erro: String(err) });
  } finally {
    trava.releaseLock();
  }
}


// Serve pro botão "testar conexão" do aplicativo: abrir o endereço no
// navegador tem que responder que está de pé. Aproveita e cria as abas do
// histórico, pra elas já aparecerem na planilha logo depois do teste.
function doGet() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName(ABA);
  const trava = LockService.getScriptLock();
  if (aba && trava.tryLock(5000)) {
    try { garantirAbas(planilha); } finally { trava.releaseLock(); }
  }
  return responder({
    ok: true,
    msg: 'Ponte da Calculadora de Boi está ligada',
    aba: ABA,
    encontrou_a_aba: !!aba,
    historico: true
  });
}


// Menu na planilha, pra refazer o histórico depois de corrigir alguma pesagem à mão
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🐂 Calculadora de Boi')
    .addItem('Atualizar histórico dos animais', 'atualizarPeloMenu')
    .addToUi();
}

function atualizarPeloMenu() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const trava = LockService.getScriptLock();
  trava.waitLock(25000);
  try {
    const n = atualizarAnimais(planilha);
    planilha.toast(n + ' animais no histórico.', 'Calculadora de Boi');
  } finally {
    trava.releaseLock();
  }
}

// Digitou um brinco na CONSULTA → mostra o histórico dele na hora
function onEdit(e) {
  if (!e || !e.range) return;
  if (e.range.getSheet().getName() !== ABA_CONSULTA || e.range.getA1Notation() !== 'B3') return;
  consultar(e.source);
}


// ─── Histórico por animal ────────────────────────────────────────────────────
// Refaz as abas HISTÓRICO e ANIMAIS do zero a partir da PESAGENS. Assim elas
// nunca ficam fora de ordem, e pesagem corrigida ou digitada à mão entra também.
// Devolve quantos animais diferentes tem no histórico.
function atualizarAnimais(planilha) {
  const pes = planilha.getSheetByName(ABA);
  if (!pes) return 0;
  const abas = garantirAbas(planilha);

  // Uma linha por animal por pesagem. Na ordem: animal por animal, e dentro
  // de cada um da pesagem mais antiga pra mais nova.
  const hist = pesagensPorAnimal(pes);
  hist.sort(function (a, b) { return compararChave(a.chave, b.chave) || (a.data - b.data); });
  hist.forEach(function (h, i) {
    const ant = i > 0 && hist[i - 1].chave === h.chave ? hist[i - 1] : null;
    h.ganho = ant ? h.peso - ant.peso : '';
    h.dias = ant ? Math.round((h.data - ant.data) / UM_DIA) : '';
    h.porDia = ant && h.dias > 0 ? h.ganho / h.dias : '';
  });
  escreverTabela(abas.hist, CAB_HIST, hist.map(function (h) {
    return [h.data, h.brinco, h.peso, h.ganho, h.dias, h.porDia, h.como, h.lote, h.vendedor, h.chave];
  }));

  // Um animal por linha: a primeira e a última pesagem de cada um
  const animais = [];
  let primeira = 0;
  hist.forEach(function (h, i) {
    if (i > 0 && hist[i - 1].chave !== h.chave) primeira = i;
    if (i < hist.length - 1 && hist[i + 1].chave === h.chave) return;
    const pri = hist[primeira], n = i - primeira + 1;
    const dias = Math.round((h.data - pri.data) / UM_DIA);
    animais.push([
      h.brinco, n, pri.data, pri.peso, h.data, h.peso, h.ganho,
      n > 1 ? h.peso - pri.peso : '',
      n > 1 ? dias : '',
      n > 1 && dias > 0 ? (h.peso - pri.peso) / dias : '',
      h.como, h.lote, h.chave
    ]);
  });
  escreverTabela(abas.animais, CAB_ANIMAIS, animais);

  consultar(planilha);
  return animais.length;
}

// Lê a aba PESAGENS e devolve um registro pra cada animal de cada pesagem.
// Na balançada com vários bois, cada um fica com o peso médio (peso ÷ cabeças).
// Usa o peso da balança, sem o desconto por cabeça.
function pesagensPorAnimal(pes) {
  const ultima = pes.getLastRow();
  const saida = [];
  if (ultima < PRIMEIRA_LINHA) return saida;
  const linhas = pes.getRange(PRIMEIRA_LINHA, 1, ultima - PRIMEIRA_LINHA + 1, COL.peso).getValues();
  linhas.forEach(function (l) {
    const data = l[COL.data - 1];
    const peso = Number(l[COL.peso - 1]) || 0;
    if (!(data instanceof Date) || peso <= 0) return;
    const nums = String(l[COL.brinco - 1]).split(/[·,;\/]/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s !== ''; });
    if (!nums.length) return;
    const cab = Number(l[COL.cabecas - 1]) || nums.length;
    nums.forEach(function (n) {
      saida.push({
        data: data, brinco: n, chave: chaveBrinco(n), peso: peso / cab,
        como: cab > 1 ? 'média da balançada de ' + cab : 'sozinho',
        lote: l[COL.lote - 1], vendedor: l[COL.vendedor - 1]
      });
    });
  });
  return saida;
}

// "010" e "10" são o mesmo brinco
function chaveBrinco(n) {
  const t = String(n).trim().toUpperCase();
  return /^\d+$/.test(t) ? String(parseInt(t, 10)) : t;
}

// Número em ordem de número (2 antes de 10); brinco com letra vai depois
function compararChave(a, b) {
  const na = /^\d+$/.test(a), nb = /^\d+$/.test(b);
  if (na && nb) return Number(a) - Number(b);
  if (na !== nb) return na ? -1 : 1;
  return a < b ? -1 : (a > b ? 1 : 0);
}


// ─── Consulta de um animal ───────────────────────────────────────────────────
function consultar(planilha) {
  const con = planilha.getSheetByName(ABA_CONSULTA);
  const hist = planilha.getSheetByName(ABA_HIST);
  if (!con || !hist) return;

  // Apaga o resultado anterior
  con.getRange(5, 2, 9, 1).clearContent();
  const fim = con.getLastRow();
  if (fim >= 16) con.getRange(16, 1, fim - 15, CAB_HIST.length - 1).clearContent();

  const busca = String(con.getRange('B3').getValue()).trim();
  if (!busca) return;
  const chave = chaveBrinco(busca);
  const ncol = CAB_HIST.length;
  const ultima = hist.getLastRow();
  const linhas = ultima < PRIMEIRA_LINHA ? [] :
    hist.getRange(PRIMEIRA_LINHA, 1, ultima - PRIMEIRA_LINHA + 1, ncol).getValues()
      .filter(function (l) { return String(l[ncol - 1]) === chave; });

  if (!linhas.length) {
    con.getRange('B5').setValue('não achei nenhuma pesagem do brinco ' + busca);
    return;
  }
  const pri = linhas[0], ult = linhas[linhas.length - 1], n = linhas.length;
  const dias = Math.round((ult[0] - pri[0]) / UM_DIA);
  const resumo = [
    [n === 1 ? 'pesado 1 vez' : 'pesado ' + n + ' vezes', null],
    [ult[2], KG],
    [ult[0], DATA],
    [ult[3], GANHO],
    [n > 1 ? ult[2] - pri[2] : '', GANHO],
    [n > 1 ? dias : '', '0'],
    [n > 1 && dias > 0 ? (ult[2] - pri[2]) / dias : '', DIA_KG],
    [ult[6], null],
    [ult[7], null]
  ];
  resumo.forEach(function (r, i) {
    const cel = con.getRange(5 + i, 2);
    if (r[1]) cel.setNumberFormat(r[1]);
    cel.setValue(r[0]);
  });

  const lista = linhas.map(function (l) { return l.slice(0, ncol - 1); });
  CAB_HIST.slice(0, ncol - 1).forEach(function (c, i) {
    if (c[2]) con.getRange(16, i + 1, lista.length, 1).setNumberFormat(c[2]);
  });
  con.getRange(16, 1, lista.length, ncol - 1).setValues(lista);
}


// ─── Montagem das abas ───────────────────────────────────────────────────────
function garantirAbas(planilha) {
  const animais = garantirAba(planilha, ABA_ANIMAIS, ABA,
    '🐂 ANIMAIS — um por linha, pelo nº do brinco · a planilha monta sozinha, não digite aqui', CAB_ANIMAIS);
  const hist = garantirAba(planilha, ABA_HIST, ABA_ANIMAIS,
    '📜 HISTÓRICO — toda pesagem de cada animal · a planilha monta sozinha, não digite aqui', CAB_HIST);
  garantirConsulta(planilha);
  return { animais: animais, hist: hist };
}

// Cria a aba logo depois de "depoisDe", com título e cabeçalho no padrão da planilha
function garantirAba(planilha, nome, depoisDe, titulo, colunas) {
  const existe = planilha.getSheetByName(nome);
  if (existe) return existe;
  const ancora = planilha.getSheetByName(depoisDe);
  const aba = planilha.insertSheet(nome, ancora ? ancora.getIndex() : planilha.getNumSheets());
  aba.getRange(1, 1).setValue(titulo).setFontWeight('bold').setFontSize(14).setFontColor(CREME);
  aba.getRange(1, 1, 1, colunas.length).setBackground(MARROM);
  aba.setRowHeight(1, 30);
  aba.getRange(2, 1, 1, colunas.length)
    .setValues([colunas.map(function (c) { return c[0]; })])
    .setFontWeight('bold').setFontSize(10).setFontColor(TINTA).setBackground(DOURADO)
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  aba.setRowHeight(2, 36);
  colunas.forEach(function (c, i) { aba.setColumnWidth(i + 1, c[1]); });
  aba.setFrozenRows(2);
  aba.hideColumns(colunas.length);   // a chave de busca
  return aba;
}

function garantirConsulta(planilha) {
  if (planilha.getSheetByName(ABA_CONSULTA)) return;
  const painel = planilha.getSheetByName('PAINEL');
  const con = planilha.insertSheet(ABA_CONSULTA, painel ? painel.getIndex() : 0);
  const ncol = CAB_HIST.length - 1;
  con.getRange(1, 1).setValue('🔍 CONSULTAR UM ANIMAL — digite o nº do brinco na casa amarela e aperte Enter')
    .setFontWeight('bold').setFontSize(14).setFontColor(CREME);
  con.getRange(1, 1, 1, ncol).setBackground(MARROM);
  con.setRowHeight(1, 30);

  con.getRange('A3').setValue('Nº do brinco:').setFontWeight('bold').setFontColor(MARROM);
  con.getRange('B3').setNumberFormat(TEXTO).setBackground(AMARELO).setFontSize(16).setFontWeight('bold')
    .setHorizontalAlignment('center').setBorder(true, true, true, true, false, false, DOURADO, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  con.getRange('C3').setValue('010 e 10 são o mesmo brinco').setFontColor('#6B533C').setFontStyle('italic');
  con.setRowHeight(3, 34);

  const rotulos = ['Situação', 'Peso atual', 'Última pesagem', 'Ganho desde a anterior',
    'Ganho total', 'Dias (da 1ª até a última)', 'Ganho por dia', 'Último peso foi', 'Último lote'];
  con.getRange(5, 1, rotulos.length, 1).setValues(rotulos.map(function (r) { return [r]; }))
    .setFontWeight('bold').setFontColor(MARROM);
  con.getRange(5, 2, rotulos.length, 1).setFontWeight('bold').setFontColor(TINTA).setHorizontalAlignment('left');

  con.getRange(15, 1, 1, ncol)
    .setValues([CAB_HIST.slice(0, ncol).map(function (c) { return c[0]; })])
    .setFontWeight('bold').setFontSize(10).setFontColor(TINTA).setBackground(DOURADO)
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  con.setRowHeight(15, 36);
  CAB_HIST.slice(0, ncol).forEach(function (c, i) { con.setColumnWidth(i + 1, Math.max(c[1], i === 0 ? 170 : 0)); });
}

// Apaga o que tinha embaixo do cabeçalho e escreve as linhas novas
function escreverTabela(aba, colunas, linhas) {
  const ncol = colunas.length;
  const ultima = aba.getLastRow();
  if (ultima >= PRIMEIRA_LINHA) aba.getRange(PRIMEIRA_LINHA, 1, ultima - PRIMEIRA_LINHA + 1, ncol).clearContent();
  if (!linhas.length) return;
  const precisa = PRIMEIRA_LINHA - 1 + linhas.length;
  if (aba.getMaxRows() < precisa) aba.insertRowsAfter(aba.getMaxRows(), precisa - aba.getMaxRows());
  // Formato antes do valor: com a coluna do brinco já em texto, "010" fica "010"
  colunas.forEach(function (c, i) {
    if (c[2]) aba.getRange(PRIMEIRA_LINHA, i + 1, linhas.length, 1).setNumberFormat(c[2]);
  });
  aba.getRange(PRIMEIRA_LINHA, 1, linhas.length, ncol).setValues(linhas);
}


// ─── Aba PESAGENS ────────────────────────────────────────────────────────────
// A coluna M guarda o nº que o app dá pra cada pesagem. Fica escondida.
function garantirColunaId(aba) {
  if (aba.getMaxColumns() < COL.id) aba.insertColumnsAfter(aba.getMaxColumns(), COL.id - aba.getMaxColumns());
  const cab = aba.getRange(PRIMEIRA_LINHA - 1, COL.id);
  if (cab.getValue() !== '') return;
  cab.setValue('ID DO APP').setFontWeight('bold').setFontSize(10).setFontColor(TINTA).setBackground(DOURADO);
  aba.hideColumns(COL.id);
}

function idsGravados(aba) {
  const vistos = {};
  const ultima = aba.getLastRow();
  if (ultima < PRIMEIRA_LINHA) return vistos;
  aba.getRange(PRIMEIRA_LINHA, COL.id, ultima - PRIMEIRA_LINHA + 1, 1).getValues().forEach(function (l) {
    if (l[0] !== '' && l[0] !== null) vistos[String(l[0])] = true;
  });
  return vistos;
}

// A coluna do PESO é a que sempre vem preenchida numa pesagem de verdade —
// por isso ela serve de régua pra achar onde continuar.
function primeiraLinhaVazia(aba) {
  const ultima = aba.getLastRow();
  if (ultima < PRIMEIRA_LINHA) return PRIMEIRA_LINHA;
  const valores = aba.getRange(PRIMEIRA_LINHA, COL.peso, ultima - PRIMEIRA_LINHA + 1, 1).getValues();
  for (let i = 0; i < valores.length; i++) {
    if (valores[i][0] === '' || valores[i][0] === null) return PRIMEIRA_LINHA + i;
  }
  return ultima + 1;
}


function escrever(aba, linha, coluna, valor) {
  aba.getRange(linha, coluna).setValue(valor);
}

// Brinco e id vão como texto: senão o Google transforma "010" em 10
function escreverTexto(aba, linha, coluna, valor) {
  aba.getRange(linha, coluna).setNumberFormat(TEXTO).setValue(String(valor));
}


function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
