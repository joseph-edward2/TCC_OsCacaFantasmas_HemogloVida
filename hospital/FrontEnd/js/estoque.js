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



const bolsasMock = {
  'H-1234': {
    status: 'Reservada',
    pacienteDestino: 'Jonh Ligma',
    nomeDoador: 'Jesse Pinkman',
    caderneta: '1234O-',
    dataEnvio: '12/10/2023',
    aboRh: 'AB+', // diferente do "O-" da tabela de propósito — é
                  // exatamente esse tipo de inconformidade que o
                  // aviso do modal existe pra alertar
    dataValidade: '12/10/2023',
    origem: 'Hemocentro Central',
    dataDoacao: '11/09/2001'
  },
  'H-1235': {
    status: 'Disponível',
    pacienteDestino: '',
    nomeDoador: 'Walter White',
    caderneta: '5678O+',
    dataEnvio: '14/10/2023',
    aboRh: 'O+',
    dataValidade: '14/11/2023',
    origem: 'Hemocentro Leste',
    dataDoacao: '02/03/2024'
  },
  'H-1236': {
    status: 'Utilizada',
    pacienteDestino: 'Mike Ehrmantraut',
    nomeDoador: 'Saul Goodman',
    caderneta: '9012B-',
    dataEnvio: '15/10/2023',
    aboRh: 'B-',
    dataValidade: '22/10/2023',
    origem: 'Hemocentro Central',
    dataDoacao: '18/09/2023'
  },
    'H-1237': {
    status: 'Descartada',
    pacienteDestino: 'Skyler White',
    nomeDoador: 'Gus Fring',
    caderneta: '6967B-',
    dataEnvio: '06/07/2023',
    aboRh: 'B-',
    dataValidade: '22/10/2024',
    origem: 'Hemocentro Central',
    dataDoacao: '05/07/2023'
  }
  // TODO: adicionar a #H-1237 aqui seguindo o mesmo padrão,
  // se quiser deixar as 4 linhas da tabela clicáveis
};

const modalOverlay = document.getElementById('modalInventarioOverlay');
const selectBolsa = document.getElementById('selectBolsa');


// ------------------------------------------------------
// 1. Preenche os campos do modal com os dados da bolsa escolhida
// ------------------------------------------------------
function carregarBolsa(id) {
  const dados = bolsasMock[id];
  if (!dados) return;

  selectBolsa.value = id;
  document.getElementById('pacienteDestino').value = dados.pacienteDestino;
  document.getElementById('statusBolsa').value = dados.status;
  document.getElementById('infoNomeDoador').value = dados.nomeDoador;
  document.getElementById('infoCaderneta').value = dados.caderneta;
  document.getElementById('infoDataEnvio').value = dados.dataEnvio;
  document.getElementById('infoAboRh').value = dados.aboRh;
  document.getElementById('infoDataValidade').value = dados.dataValidade;
  document.getElementById('infoOrigem').value = dados.origem;
  document.getElementById('infoDataDoacao').value = dados.dataDoacao;
}


// ------------------------------------------------------
// 2. Abrir / fechar o modal
// ------------------------------------------------------
function abrirModalInventario(id) {
  carregarBolsa(id);
  modalOverlay.classList.add('show');
}

document.querySelectorAll('[data-abrir-inventario]').forEach(function (botao) {
  botao.addEventListener('click', function () {

    abrirModalInventario(botao.dataset.bolsa || 'H-1234');
  });
});

// Trocar o dropdown "ID Bolsa/Lote" dentro do modal também
// atualiza os outros campos, sem precisar fechar e abrir de novo
selectBolsa.addEventListener('change', function () {
  carregarBolsa(this.value);
});

document.getElementById('modalInventarioClose').addEventListener('click', function () {
  modalOverlay.classList.remove('show');
});

modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) modalOverlay.classList.remove('show');
});


// ------------------------------------------------------
// 3. Confirmar
// ------------------------------------------------------
document.getElementById('btnConfirmarInventario').addEventListener('click', async function () {
  const restaurar = iniciarCarregamento(this, 'Salvando…');

  try {

    await enviarParaAPI('https://api.exemplo.com/estoque/' + selectBolsa.value, {
      status: document.getElementById('statusBolsa').value,
      pacienteDestino: document.getElementById('pacienteDestino').value
    });

    alert('Alterações confirmadas com sucesso!');
    modalOverlay.classList.remove('show');
  } catch (erro) {
    alert(erro.message);
  } finally {
    restaurar();
  }
});
