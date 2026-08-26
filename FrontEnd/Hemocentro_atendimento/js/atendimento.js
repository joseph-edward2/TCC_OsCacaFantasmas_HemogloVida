/* ======================================================
   HEMOGLOVIDA — ATENDIMENTO
   ======================================================
   Importe DEPOIS do base.js:

   <script src="../base.js"></script>
   <script src="js/atendimento.js"></script>
   ====================================================== */

const agendaEl = document.getElementById('agenda');
const paginacaoEl = document.getElementById('paginacao');
const linkTodos = document.getElementById('linkTodos');
const btnConfirmarChegada = document.getElementById('btnConfirmarChegada');
const btnDoacaoRealizada = document.getElementById('btnDoacaoRealizada');

// TODO: substituir por uma chamada fetch() à API real
const agendamentos = [
  { nome: 'Maria Silva', horario: '08:00', status: 'Finalizado' },
  { nome: 'João Pedro Lima', horario: '09:30', status: 'Em Andamento' },
  { nome: 'Ana Souza', horario: '10:15', status: 'Agendado' },
  { nome: 'Carlos Pereira', horario: '11:00', status: 'Agendado' },
  { nome: 'Fernanda Costa', horario: '13:30', status: 'Atrasado' },
  { nome: 'Pedro Almeida', horario: '14:45', status: 'Agendado' },
  { nome: 'Juliana Ramos', horario: '16:00', status: 'Agendado' },
  { nome: 'Roberto Nunes', horario: '17:30', status: 'Agendado' }
];

const ITENS_POR_PAGINA = 6;

// Liga cada status do agendamento à classe CSS correspondente
const STATUS_CLASSE = {
  'Agendado': 'badge-status--agendado',
  'Em Andamento': 'badge-status--em-andamento',
  'Atrasado': 'badge-status--atrasado',
  'Finalizado': 'badge-status--finalizado'
};

let paginaAtual = 1;


// ------------------------------------------------------
// 1. Iniciais do nome (ex: "João Pedro Lima" -> "JL")
// ------------------------------------------------------
function iniciaisDe(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0].charAt(0);
  const ultima = partes[partes.length - 1].charAt(0);
  return (primeira + ultima).toUpperCase();
}


// ------------------------------------------------------
// 2. Renderiza a lista de agendamentos da página atual
// ------------------------------------------------------
function renderizarAgenda() {
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const itensPagina = agendamentos.slice(inicio, inicio + ITENS_POR_PAGINA);

  agendaEl.innerHTML = itensPagina.map(function (item) {
    return `
      <li class="agenda__item">
        <span class="agenda__iniciais">${iniciaisDe(item.nome)}</span>
        <span class="agenda__nome">${item.nome}</span>
        <span class="agenda__horario">${item.horario}</span>
        <span class="badge-status ${STATUS_CLASSE[item.status] || ''}">${item.status}</span>
      </li>
    `;
  }).join('');

  renderizarPaginacao();
}


// ------------------------------------------------------
// 3. Renderiza os botões de página
// ------------------------------------------------------
function renderizarPaginacao() {
  const totalPaginas = Math.ceil(agendamentos.length / ITENS_POR_PAGINA);

  if (totalPaginas <= 1) {
    paginacaoEl.innerHTML = '';
    return;
  }

  let html = `<button class="paginacao__botao" data-pagina="anterior" ${paginaAtual === 1 ? 'disabled' : ''}>&#8249;</button>`;

  for (let i = 1; i <= totalPaginas; i++) {
    const ativo = i === paginaAtual ? ' paginacao__botao--ativo' : '';
    html += `<button class="paginacao__botao${ativo}" data-pagina="${i}">${i}</button>`;
  }

  html += `<button class="paginacao__botao" data-pagina="proxima" ${paginaAtual === totalPaginas ? 'disabled' : ''}>&#8250;</button>`;

  paginacaoEl.innerHTML = html;
}

paginacaoEl.addEventListener('click', function (event) {
  const botao = event.target.closest('.paginacao__botao');
  if (!botao || botao.disabled) return;

  const totalPaginas = Math.ceil(agendamentos.length / ITENS_POR_PAGINA);
  const acao = botao.dataset.pagina;

  if (acao === 'anterior') paginaAtual--;
  else if (acao === 'proxima') paginaAtual++;
  else paginaAtual = Number(acao);

  paginaAtual = Math.max(1, Math.min(paginaAtual, totalPaginas));

  renderizarAgenda();
});

linkTodos.textContent = `Ver todos os ${agendamentos.length} agendamentos`;


// ------------------------------------------------------
// 4. Ações do atendimento
// (usa enviarParaAPI e iniciarCarregamento do base.js)
// ------------------------------------------------------
async function executarAcao(botao, endpoint, payload) {
  const restaurar = iniciarCarregamento(botao, 'Enviando…');

  try {
    // TODO: substituir pela URL real da API
    await enviarParaAPI('https://api.exemplo.com/' + endpoint, payload);
  } catch (erro) {
    alert('Não foi possível concluir a ação. Tente novamente.');
  } finally {
    restaurar();
  }
}

btnConfirmarChegada.addEventListener('click', function () {
  // TODO: ajustar o payload conforme a API real
  executarAcao(btnConfirmarChegada, 'atendimento/confirmar-chegada', { paciente: 'João Pedro Lima' });
});

btnDoacaoRealizada.addEventListener('click', function () {
  // TODO: ajustar o payload conforme a API real
  executarAcao(btnDoacaoRealizada, 'atendimento/doacao-realizada', { paciente: 'João Pedro Lima' });
});


// ------------------------------------------------------
// 5. Renderização inicial
// ------------------------------------------------------
renderizarAgenda();
