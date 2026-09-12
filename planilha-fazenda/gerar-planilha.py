# -*- coding: utf-8 -*-
"""
Planilha de gestão de compra e venda de gado — THIAGO PORTO 704 AGRO.

As fórmulas são gravadas em INGLÊS de propósito: dentro do arquivo .xlsx o nome
da função é sempre o inglês, e o Excel PT-BR / Google Sheets traduzem sozinhos
na tela (SUMIFS vira SOMASES). Escrever "SOMASES" aqui daria #NOME? na abertura.
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule

# Cores da marca (as mesmas do app)
MARROM   = "8B4513"
MARROM_E = "654321"
DOURADO  = "D4AF37"
CREME    = "F4E4C1"
FUNDO    = "F5F1E8"
TINTA    = "2D1F13"
VERDE    = "166534"
VERMELHO = "B91C1C"
BRANCO   = "FFFFFF"
SUPERF   = "FFFDF7"

import sys
LINHAS = int(sys.argv[1]) if len(sys.argv) > 1 else 300  # linhas já com fórmula prontas

MOEDA = 'R$ #,##0.00'
KG    = '#,##0" kg"'
ARROBA= '#,##0.00" @"'
DATA  = 'DD/MM/YYYY'
PCT   = '0.0%'
INT   = '#,##0'

fina = Side(style="thin", color="D9CBB2")
borda = Border(left=fina, right=fina, top=fina, bottom=fina)


def titulo(ws, texto, ncols):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=ncols)
    c = ws.cell(row=1, column=1, value=texto)
    c.font = Font(bold=True, size=14, color=CREME)
    c.fill = PatternFill("solid", fgColor=MARROM)
    c.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[1].height = 30


def cabecalho(ws, linha, colunas):
    for i, (nome, largura, _fmt) in enumerate(colunas, start=1):
        c = ws.cell(row=linha, column=i, value=nome)
        c.font = Font(bold=True, size=10, color=TINTA)
        c.fill = PatternFill("solid", fgColor=DOURADO)
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = borda
        ws.column_dimensions[get_column_letter(i)].width = largura
    ws.row_dimensions[linha].height = 30
    ws.freeze_panes = ws.cell(row=linha + 1, column=1)


def formatar_area(ws, linha_ini, colunas):
    for r in range(linha_ini, linha_ini + LINHAS):
        for i, (_n, _l, fmt) in enumerate(colunas, start=1):
            c = ws.cell(row=r, column=i)
            c.border = borda
            if fmt:
                c.number_format = fmt
            if r % 2 == 0:
                c.fill = PatternFill("solid", fgColor=SUPERF)


def rotulo(ws, linha, col, texto, valor=None, fmt=None, destaque=False):
    c = ws.cell(row=linha, column=col, value=texto)
    c.font = Font(bold=True, size=10, color=MARROM_E)
    v = ws.cell(row=linha, column=col + 1, value=valor)
    v.font = Font(bold=True, size=14 if destaque else 11, color=TINTA)
    if fmt:
        v.number_format = fmt
    v.alignment = Alignment(horizontal="right")
    return v


wb = Workbook()

# ─────────────────────────────────────────────────────────── PAINEL
p = wb.active
p.title = "PAINEL"
p.sheet_view.showGridLines = False
titulo(p, "🐂 704 AGRO — PAINEL DA FAZENDA", 8)
p.column_dimensions["A"].width = 3
for col, w in zip("BCDEFGH", [30, 20, 4, 30, 20, 4, 20]):
    p.column_dimensions[col].width = w

p["B3"] = "REBANHO"
p["B3"].font = Font(bold=True, size=11, color=MARROM)
p["E3"] = "DINHEIRO"
p["E3"].font = Font(bold=True, size=11, color=MARROM)

rotulo(p, 4, 2, "Cabeças compradas", "=SUM(COMPRAS!E:E)", INT)
rotulo(p, 5, 2, "Cabeças vendidas", "=SUM(VENDAS!D:D)", INT)
rotulo(p, 6, 2, "No pasto agora", "=C4-C5", INT, destaque=True)
rotulo(p, 7, 2, "Peso comprado", "=SUM(COMPRAS!F:F)", KG)
rotulo(p, 8, 2, "Peso vendido", "=SUM(VENDAS!E:E)", KG)
rotulo(p, 9, 2, "Lotes abertos", '=COUNTIF(LOTES!L:L,"ABERTO")', INT)

rotulo(p, 4, 5, "Investido nas compras", "=SUM(COMPRAS!L:L)", MOEDA)
rotulo(p, 5, 5, "Recebido nas vendas", "=SUM(VENDAS!K:K)", MOEDA)
rotulo(p, 6, 5, "Resultado", "=F5-F4", MOEDA, destaque=True)
rotulo(p, 7, 5, "Saldo em caixa", '=SUM(CAIXA!F:F)-SUM(CAIXA!G:G)', MOEDA, destaque=True)
rotulo(p, 8, 5, "@ média de compra", '=IFERROR(SUM(COMPRAS!L:L)/SUM(COMPRAS!H:H),0)', MOEDA)
rotulo(p, 9, 5, "@ média de venda", '=IFERROR(SUM(VENDAS!I:I)/SUM(VENDAS!G:G),0)', MOEDA)

p["F6"].font = Font(bold=True, size=14, color=VERDE)
p.conditional_formatting.add("F6", CellIsRule(operator="lessThan", formula=["0"],
                                              font=Font(bold=True, size=14, color=VERMELHO)))

p["B11"] = "MARGEM POR ARROBA"
p["B11"].font = Font(bold=True, size=11, color=MARROM)
rotulo(p, 12, 2, "Ganho por @ (venda − compra)", "=F9-F8", MOEDA, destaque=True)
p.conditional_formatting.add("C12", CellIsRule(operator="lessThan", formula=["0"],
                                               font=Font(bold=True, size=14, color=VERMELHO)))

p.merge_cells("B14:H14")
p["B14"] = ("Os números acima se calculam sozinhos. Você só preenche as abas COMPRAS, "
            "VENDAS e CAIXA — e a aba PESAGENS recebe o que vem do aplicativo.")
p["B14"].font = Font(size=10, italic=True, color="6B533C")
p["B14"].alignment = Alignment(wrap_text=True, vertical="top")
p.row_dimensions[14].height = 32

p.merge_cells("B16:H16")
p["B16"] = "THIAGO PORTO 704 AGRO — Compra e venda de bovinos · (77) 99922-6268"
p["B16"].font = Font(bold=True, size=10, color=MARROM)
p["B16"].alignment = Alignment(horizontal="center")
p["B16"].fill = PatternFill("solid", fgColor=CREME)

# ─────────────────────────────────────────────────────────── COMPRAS
cols_compra = [
    ("DATA", 12, DATA), ("LOTE", 12, None), ("FORNECEDOR", 24, None), ("TIPO", 12, None),
    ("CABEÇAS", 10, INT), ("PESO NA BALANÇA", 15, KG), ("RENDIMENTO", 12, PCT),
    ("ARROBAS", 12, ARROBA), ("R$/@", 12, MOEDA), ("VALOR DO GADO", 15, MOEDA),
    ("FRETE + COMISSÃO", 15, MOEDA), ("CUSTO TOTAL", 15, MOEDA), ("OBSERVAÇÃO", 30, None),
]
c = wb.create_sheet("COMPRAS")
c.sheet_view.showGridLines = False
titulo(c, "📥 COMPRAS — gado que entrou", len(cols_compra))
cabecalho(c, 2, cols_compra)
formatar_area(c, 3, cols_compra)
for r in range(3, 3 + LINHAS):
    c.cell(row=r, column=7, value=0.52)  # rendimento padrão
    c.cell(row=r, column=8, value=f"=IF(F{r}=\"\",\"\",F{r}*G{r}/15)")
    c.cell(row=r, column=10, value=f"=IF(H{r}=\"\",\"\",H{r}*I{r})")
    c.cell(row=r, column=12, value=f"=IF(J{r}=\"\",\"\",J{r}+N(K{r}))")
dv_tipo = DataValidation(type="list", formula1='"Boi,Vaca,Novilha,Garrote,Bezerro,Bezerra"', allow_blank=True)
c.add_data_validation(dv_tipo)
dv_tipo.add(f"D3:D{2+LINHAS}")

# ─────────────────────────────────────────────────────────── PESAGENS
cols_pes = [
    ("DATA", 12, DATA), ("LOTE", 12, None), ("VENDEDOR / ORIGEM", 24, None),
    ("Nº DO BRINCO", 12, None), ("CABEÇAS", 10, INT), ("PESO NA BALANÇA", 15, KG),
    ("DESCONTO POR CAB.", 14, KG), ("PESO LÍQUIDO", 14, KG), ("RENDIMENTO", 12, PCT),
    ("ARROBAS", 12, ARROBA), ("R$/@", 12, MOEDA), ("VALOR", 15, MOEDA),
]
s = wb.create_sheet("PESAGENS")
s.sheet_view.showGridLines = False
titulo(s, "⚖️ PESAGENS — vem do aplicativo (ou digite à mão)", len(cols_pes))
cabecalho(s, 2, cols_pes)
formatar_area(s, 3, cols_pes)
for r in range(3, 3 + LINHAS):
    s.cell(row=r, column=8, value=f"=IF(F{r}=\"\",\"\",MAX(0,F{r}-N(G{r})*N(E{r})))")
    s.cell(row=r, column=10, value=f"=IF(H{r}=\"\",\"\",H{r}*N(I{r})/15)")
    s.cell(row=r, column=12, value=f"=IF(J{r}=\"\",\"\",J{r}*N(K{r}))")
    s.cell(row=r, column=9, value=0.52)

# ─────────────────────────────────────────────────────────── VENDAS
cols_venda = [
    ("DATA", 12, DATA), ("LOTE", 12, None), ("COMPRADOR", 24, None), ("CABEÇAS", 10, INT),
    ("PESO NA BALANÇA", 15, KG), ("RENDIMENTO", 12, PCT), ("ARROBAS", 12, ARROBA),
    ("R$/@", 12, MOEDA), ("VALOR BRUTO", 15, MOEDA), ("FRETE + COMISSÃO", 15, MOEDA),
    ("VALOR LÍQUIDO", 15, MOEDA), ("OBSERVAÇÃO", 30, None),
]
v = wb.create_sheet("VENDAS")
v.sheet_view.showGridLines = False
titulo(v, "📤 VENDAS — gado que saiu", len(cols_venda))
cabecalho(v, 2, cols_venda)
formatar_area(v, 3, cols_venda)
for r in range(3, 3 + LINHAS):
    v.cell(row=r, column=6, value=0.52)
    v.cell(row=r, column=7, value=f"=IF(E{r}=\"\",\"\",E{r}*F{r}/15)")
    v.cell(row=r, column=9, value=f"=IF(G{r}=\"\",\"\",G{r}*H{r})")
    v.cell(row=r, column=11, value=f"=IF(I{r}=\"\",\"\",I{r}-N(J{r}))")

# ─────────────────────────────────────────────────────────── LOTES
cols_lote = [
    ("LOTE", 14, None), ("ENTROU EM", 12, DATA), ("SAIU EM", 12, DATA),
    ("DIAS NO PASTO", 12, INT), ("CABEÇAS QUE ENTRARAM", 12, INT),
    ("CABEÇAS QUE SAÍRAM", 12, INT), ("PESO DE ENTRADA", 14, KG),
    ("PESO DE SAÍDA", 14, KG), ("GANHO DE PESO", 14, KG), ("CUSTO", 15, MOEDA),
    ("RECEITA", 15, MOEDA), ("SITUAÇÃO", 12, None), ("LUCRO", 15, MOEDA),
]
l = wb.create_sheet("LOTES")
l.sheet_view.showGridLines = False
titulo(l, "🐄 LOTES — cada lote do começo ao fim", len(cols_lote))
cabecalho(l, 2, cols_lote)
formatar_area(l, 3, cols_lote)
for r in range(3, 3 + LINHAS):
    ref = f"$A{r}"
    # MINIFS/MAXIFS devolvem 0 (que vira 00/01/1900) quando não acham o lote.
    # Por isso o COUNTIF antes: sem compra daquele lote, a data fica vazia.
    l.cell(row=r, column=2, value=f'=IF(OR({ref}="",COUNTIF(COMPRAS!$B:$B,{ref})=0),"",MINIFS(COMPRAS!$A:$A,COMPRAS!$B:$B,{ref}))')
    l.cell(row=r, column=3, value=f'=IF(OR({ref}="",COUNTIF(VENDAS!$B:$B,{ref})=0),"",MAXIFS(VENDAS!$A:$A,VENDAS!$B:$B,{ref}))')
    l.cell(row=r, column=4, value=f'=IF(OR({ref}="",B{r}=""),"",IF(C{r}="",TODAY()-B{r},C{r}-B{r}))')
    l.cell(row=r, column=5, value=f'=IF({ref}="","",SUMIF(COMPRAS!$B:$B,{ref},COMPRAS!$E:$E))')
    l.cell(row=r, column=6, value=f'=IF({ref}="","",SUMIF(VENDAS!$B:$B,{ref},VENDAS!$D:$D))')
    l.cell(row=r, column=7, value=f'=IF({ref}="","",SUMIF(COMPRAS!$B:$B,{ref},COMPRAS!$F:$F))')
    l.cell(row=r, column=8, value=f'=IF({ref}="","",SUMIF(VENDAS!$B:$B,{ref},VENDAS!$E:$E))')
    l.cell(row=r, column=9, value=f'=IF({ref}="","",H{r}-G{r})')
    l.cell(row=r, column=10, value=f'=IF({ref}="","",SUMIF(COMPRAS!$B:$B,{ref},COMPRAS!$L:$L))')
    l.cell(row=r, column=11, value=f'=IF({ref}="","",SUMIF(VENDAS!$B:$B,{ref},VENDAS!$K:$K))')
    l.cell(row=r, column=12, value=f'=IF({ref}="","",IF(F{r}>=E{r},"FECHADO","ABERTO"))')
    l.cell(row=r, column=13, value=f'=IF({ref}="","",K{r}-J{r})')
l.conditional_formatting.add(f"M3:M{2+LINHAS}",
    CellIsRule(operator="lessThan", formula=["0"], font=Font(bold=True, color=VERMELHO)))
l.conditional_formatting.add(f"M3:M{2+LINHAS}",
    CellIsRule(operator="greaterThan", formula=["0"], font=Font(bold=True, color=VERDE)))

# ─────────────────────────────────────────────────────────── CAIXA
cols_caixa = [
    ("DATA", 12, DATA), ("LOTE", 12, None), ("CATEGORIA", 20, None),
    ("DESCRIÇÃO", 34, None), ("FORMA", 14, None), ("ENTROU", 15, MOEDA),
    ("SAIU", 15, MOEDA), ("SALDO", 15, MOEDA),
]
k = wb.create_sheet("CAIXA")
k.sheet_view.showGridLines = False
titulo(k, "💰 CAIXA — todo dinheiro que entra e sai", len(cols_caixa))
cabecalho(k, 2, cols_caixa)
formatar_area(k, 3, cols_caixa)
for r in range(3, 3 + LINHAS):
    # N() em volta do saldo anterior: sem ele, a primeira linha em branco no
    # meio deixa a coluna toda com #VALOR! daí pra baixo.
    anterior = "0" if r == 3 else f"N(H{r-1})"
    k.cell(row=r, column=8, value=f'=IF(AND(F{r}="",G{r}=""),"",{anterior}+N(F{r})-N(G{r}))')
dv_cat = DataValidation(
    type="list",
    formula1='"Compra de gado,Venda de gado,Frete,Comissão,Vacina e remédio,Sal e ração,Pasto e diária,Combustível,Imposto e taxa,Outros"',
    allow_blank=True)
k.add_data_validation(dv_cat)
dv_cat.add(f"C3:C{2+LINHAS}")
dv_forma = DataValidation(type="list", formula1='"Dinheiro,Pix,Transferência,Cheque,Prazo"', allow_blank=True)
k.add_data_validation(dv_forma)
dv_forma.add(f"E3:E{2+LINHAS}")

# ─────────────────────────────────────────────────────────── COMO USAR
h = wb.create_sheet("COMO USAR")
h.sheet_view.showGridLines = False
titulo(h, "📖 COMO USAR ESTA PLANILHA", 2)
h.column_dimensions["A"].width = 4
h.column_dimensions["B"].width = 110
texto = [
    ("", ""),
    ("O QUE VOCÊ PREENCHE", "t"),
    ("COMPRAS — cada vez que comprar gado. Preencha data, lote, fornecedor, cabeças, peso e o preço da arroba. As arrobas, o valor e o custo total se calculam sozinhos.", ""),
    ("VENDAS — cada vez que vender. Mesma coisa: o valor líquido já desconta frete e comissão.", ""),
    ("CAIXA — todo dinheiro que entra e sai, inclusive o que não é gado (vacina, sal, diária, combustível). O saldo vai somando linha por linha.", ""),
    ("", ""),
    ("O QUE SE PREENCHE SOZINHO", "t"),
    ("PESAGENS — é aqui que cai o que vem do aplicativo Calculadora de Boi. Você também pode digitar à mão se quiser.", ""),
    ("LOTES — junta tudo por lote: quando entrou, quando saiu, quantos dias no pasto, quanto engordou, quanto custou, quanto rendeu e o lucro. Só digite o nome do lote na coluna A — o resto vem sozinho das outras abas.", ""),
    ("PAINEL — o resumo da fazenda. Não mexa, só olhe.", ""),
    ("", ""),
    ("O SEGREDO É O NOME DO LOTE", "t"),
    ("Use o MESMO nome de lote nas abas COMPRAS, VENDAS, PESAGENS e CAIXA. É por ele que a planilha junta tudo. Um nome simples resolve: 2026-01 BOI, FAZENDA SÃO LUIZ, LOTE 12.", ""),
    ("", ""),
    ("RENDIMENTO", "t"),
    ("Vem preenchido com 52%, que é o comum. Se o seu boi rende diferente, mude na linha — cada linha tem o seu.", ""),
    ("", ""),
    ("SE ABRIR NO GOOGLE PLANILHAS", "t"),
    ("Funciona igual: suba o arquivo no Google Drive e abra com Google Planilhas. As fórmulas aparecem traduzidas (SOMASE, SE) automaticamente.", ""),
    ("", ""),
    ("THIAGO PORTO 704 AGRO — Compra e venda de bovinos · (77) 99922-6268", "m"),
]
for i, (linha, tipo) in enumerate(texto, start=3):
    cel = h.cell(row=i, column=2, value=linha)
    if tipo == "t":
        cel.font = Font(bold=True, size=11, color=MARROM)
    elif tipo == "m":
        cel.font = Font(bold=True, size=10, color=MARROM)
        cel.fill = PatternFill("solid", fgColor=CREME)
    else:
        cel.font = Font(size=10, color=TINTA)
        cel.alignment = Alignment(wrap_text=True, vertical="top")
        h.row_dimensions[i].height = 30

destino = sys.argv[2] if len(sys.argv) > 2 else r"C:\Users\Thiago Porto\Desktop\704-AGRO-Gestao-de-Gado.xlsx"
wb.save(destino)
print("SALVO:", destino)
print("Abas:", ", ".join(wb.sheetnames))
