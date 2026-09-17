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

const tabela = document.querySelector('.inventory-table tbody');
const linhas = tabela ? Array.from(tabela.querySelectorAll('tr')) : [];
const infoPaginacao = document.querySelector('.table-footer__info');
const botoesPaginacao = paginacaoEl
  ? paginacaoEl.querySelectorAll('.paginacao__botao')
  : [];

const itensPorPagina = 4;
let paginaAtual = 1;

const totalPaginas = Math.ceil(linhas.length / itensPorPagina);


function mostrarPagina(pagina) {

  if (pagina < 1) {
    pagina = 1;
  }

  if (pagina > totalPaginas) {
    pagina = totalPaginas;
  }

  paginaAtual = pagina;

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  linhas.forEach((linha, index) => {

    if (index >= inicio && index < fim) {
      linha.style.display = '';
    } else {
      linha.style.display = 'none';
    }

  });


  botoesPaginacao.forEach(botao => {

    botao.classList.remove('paginacao__botao--ativo');

    const valor = botao.dataset.pagina;

    if (valor === String(paginaAtual)) {
      botao.classList.add('paginacao__botao--ativo');
    }

  });


  const botaoAnterior = paginacaoEl.querySelector(
    '[data-pagina="anterior"]'
  );

  const botaoProxima = paginacaoEl.querySelector(
    '[data-pagina="proxima"]'
  );


  botaoAnterior.disabled = paginaAtual === 1;
  botaoProxima.disabled = paginaAtual === totalPaginas;


  const primeiroItem = inicio + 1;
  const ultimoItem = Math.min(fim, linhas.length);

  if (infoPaginacao) {

    if (linhas.length === 0) {
      infoPaginacao.textContent = 'Nenhum registro encontrado';
    } else {
      infoPaginacao.textContent =
        `Mostrando ${primeiroItem}-${ultimoItem} de ${linhas.length} bolsas`;
    }

  }

}


// ------------------------------------------------------
// Clique nos botões
// ------------------------------------------------------

botoesPaginacao.forEach(botao => {

  botao.addEventListener('click', () => {

    const pagina = botao.dataset.pagina;

    if (pagina === 'anterior') {
      mostrarPagina(paginaAtual - 1);
      return;
    }

    if (pagina === 'proxima') {
      mostrarPagina(paginaAtual + 1);
      return;
    }

    mostrarPagina(Number(pagina));

  });

});


mostrarPagina(1);