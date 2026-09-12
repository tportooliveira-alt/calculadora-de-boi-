/**
 * PONTE ENTRE A CALCULADORA DE BOI E A PLANILHA DA FAZENDA
 *
 * Cole este código no Apps Script da SUA planilha (o passo a passo está no
 * arquivo COMO-LIGAR.md). Depois de publicar, o aplicativo passa a jogar cada
 * lote finalizado direto na aba PESAGENS — você não digita nada.
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
  precoArroba: 11 // K
};

const PRIMEIRA_LINHA = 3;   // linha 1 é o título, linha 2 é o cabeçalho


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

    let linha = primeiraLinhaVazia(aba);
    const quando = dados.data ? new Date(dados.data) : new Date();

    pesagens.forEach(function (p) {
      escrever(aba, linha, COL.data, quando);
      escrever(aba, linha, COL.lote, dados.lote || '');
      escrever(aba, linha, COL.vendedor, dados.vendedor || '');
      escrever(aba, linha, COL.brinco, p.boi || '');
      escrever(aba, linha, COL.cabecas, Number(p.qtd) || 1);
      escrever(aba, linha, COL.peso, Number(p.peso) || 0);
      escrever(aba, linha, COL.desconto, Number(p.desconto) || 0);
      escrever(aba, linha, COL.rendimento, (Number(dados.rendimento) || 52) / 100);
      escrever(aba, linha, COL.precoArroba, Number(dados.preco) || 0);
      linha++;
    });

    return responder({ ok: true, escritas: pesagens.length, aba: ABA });

  } catch (err) {
    return responder({ ok: false, erro: String(err) });
  } finally {
    trava.releaseLock();
  }
}


// Serve pro botão "testar conexão" do aplicativo: abrir o endereço no
// navegador tem que responder que está de pé.
function doGet() {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
  return responder({
    ok: true,
    msg: 'Ponte da Calculadora de Boi está ligada',
    aba: ABA,
    encontrou_a_aba: !!aba
  });
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


function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
