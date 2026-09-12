# Ligar o aplicativo na planilha da fazenda

Depois disso, todo lote que você finalizar no celular cai sozinho na aba
**PESAGENS** da sua planilha. Você não digita nada.

Faz uma vez só. Leva uns 5 minutos, no computador.

Os dados vão do seu celular direto pra sua planilha — não passam por servidor
de ninguém.

---

## 1. Subir a planilha pro Google

1. Abra o [Google Drive](https://drive.google.com).
2. Arraste o arquivo **704-AGRO-Gestao-de-Gado.xlsx** pra dentro.
3. Quando terminar de subir, **clique com o botão direito** nele →
   **Abrir com** → **Google Planilhas**.
4. No menu **Arquivo** → **Salvar como Planilhas Google**.

Agora você tem a planilha de verdade no Google. Pode até apagar o arquivo
antigo — o que vale é essa.

> **Confira:** as abas PAINEL, COMPRAS, PESAGENS, VENDAS, LOTES, CAIXA e
> COMO USAR precisam estar todas lá.

---

## 2. Colar o código

Com a planilha aberta:

1. Menu **Extensões** → **Apps Script**. Abre uma aba nova.
2. Apague o que estiver escrito (costuma vir um `function myFunction() {}`).
3. Abra o arquivo **apps-script/Codigo.gs** desta pasta, copie **tudo** e cole lá.
4. Ache esta linha, lá no começo:

   ```js
   const SENHA = 'troque-esta-palavra';
   ```

   Troque `troque-esta-palavra` por uma palavra sua. Sem espaço e sem acento —
   por exemplo `boi704`. **Anote, você vai precisar dela no celular.**

5. Clique no disquete (**Salvar projeto**).

---

## 3. Publicar

Ainda no Apps Script:

1. Botão azul **Implantar** (canto superior direito) → **Nova implantação**.
2. Na engrenagem ao lado de "Selecionar tipo", escolha **App da Web**.
3. Preencha:
   - **Descrição:** `Calculadora de Boi`
   - **Executar como:** **Eu** (seu e-mail)
   - **Quem pode acessar:** **Qualquer pessoa**
4. **Implantar**.
5. O Google vai pedir permissão. Clique em **Autorizar acesso**, escolha sua
   conta e siga.

   > Vai aparecer um aviso **"O Google não verificou este app"**. É esperado —
   > o app é seu, você acabou de escrever. Clique em **Avançado** →
   > **Acessar Calculadora de Boi (não seguro)**. Só aparece nesta primeira vez.

6. No fim, o Google mostra um **URL do app da Web**, parecido com:

   ```
   https://script.google.com/macros/s/AKfy...muito-longo.../exec
   ```

   **Copie esse endereço.** É ele que vai no celular.

> **Teste rápido:** cole o endereço no navegador e aperte enter. Tem que
> aparecer `{"ok":true,"msg":"Ponte da Calculadora de Boi está ligada",...}`.
> Se aparecer isso, está funcionando.

---

## 4. Avisar o aplicativo

No celular, dentro da Calculadora de Boi:

1. Toque no **lápis ✏️** lá em cima (Ajustar o lote).
2. Lá embaixo, em **Planilha da fazenda**, cole o endereço e escreva a mesma
   senha que você pôs no código.
3. Toque em **TESTAR** — ele diz na hora se conseguiu falar com a planilha.
4. **✓ PRONTO**.

Fica salvo no celular. Não precisa fazer de novo.

---

## Como usar no dia a dia

Pesa o lote normalmente. No fim, em **✓ FINALIZAR**, aparece o botão
**📊 MANDAR PRO GOOGLE PLANILHAS** — toque nele e as pesagens entram na sua
planilha na hora.

Precisa de internet só nessa hora. Se estiver sem sinal no curral, o lote fica
guardado no celular e você manda quando chegar em casa.

---

## Se der problema

| O que aparece | O que é |
|---|---|
| `senha errada` | A palavra do celular está diferente da que está no `Codigo.gs`. |
| `não encontrei a aba PESAGENS` | A aba foi renomeada ou apagada. Volte o nome para PESAGENS. |
| `não consegui falar com a planilha` | Sem internet, ou o endereço foi colado errado (tem que terminar em `/exec`). |
| Foi pra planilha errada | Você criou o script fora da planilha. O Apps Script tem que ser aberto **de dentro dela**, pelo menu Extensões. |

**Mudou o código depois?** Precisa publicar de novo: **Implantar** →
**Gerenciar implantações** → lápis → **Versão: Nova versão** → **Implantar**.
O endereço continua o mesmo.

---

THIAGO PORTO 704 AGRO — Compra e venda de bovinos · (77) 99922-6268
