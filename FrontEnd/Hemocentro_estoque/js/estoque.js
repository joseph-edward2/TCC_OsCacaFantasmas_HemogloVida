/* ======================================================
   HEMOGLOVIDA — ESTOQUE (HOSPITAL)
   ======================================================
   Importe DEPOIS do base.js:

   <script src="../base.js"></script>
   <script src="js/estoque.js"></script>
   ====================================================== */

const btnRequisicao = document.getElementById('btnRequisicao');
const btnExportar = document.getElementById('btnExportar');
const btnImprimir = document.getElementById('btnImprimir');
const paginacaoEl = document.getElementById('paginacao');


// ------------------------------------------------------
// 1. Botão "Fazer Requisição Agora"
// (usa enviarParaAPI e iniciarCarregamento do base.js)
// ------------------------------------------------------
if (btnRequisicao) {
  btnRequisicao.addEventListener('click', async function () {
    const restaurar = iniciarCarregamento(btnRequisicao, 'Enviando…');

    try {
      // TODO: trocar pela URL real da API e enviar os tipos
      // sanguíneos que estão em falta
      await enviarParaAPI('https://api.exemplo.com/estoque/requisicao', {
        origem: 'Hospital Santa Casa SP'
      });

      alert('Requisição enviada com sucesso!');
    } catch (erro) {
      alert(erro.message);
    } finally {
      restaurar();
    }
  });
}


// ------------------------------------------------------
// 2. Exportar / Imprimir
// ------------------------------------------------------
if (btnExportar) {
  btnExportar.addEventListener('click', function () {
    // TODO: gerar um CSV/Excel de verdade a partir dos dados reais
    alert('Exportação ainda não implementada.');
  });
}

if (btnImprimir) {
  btnImprimir.addEventListener('click', function () {
    window.print();
  });
}


// ------------------------------------------------------
// 3. Paginação da tabela
// ------------------------------------------------------
// Aqui a tabela ainda é estática (os dados não mudam de
// verdade ao trocar de página) — a função abaixo (do
// base.js) só troca qual botão fica marcado como ativo.
// Quando a tabela vier de uma API de verdade, dá pra
// evoluir isso pro mesmo modelo usado em atendimento.js
// (com um array de dados e uma função renderizarTabela()).
ativarPaginacaoSimples(paginacaoEl);

// TODO: quando ligar a uma API real, buscar os dados da
// página clicada (anterior/próxima/número) aqui.
