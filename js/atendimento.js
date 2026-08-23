// ===== Elementos da página =====
const agendaEl = document.getElementById('agenda');
const paginacaoEl = document.getElementById('paginacao');
const linkTodos = document.getElementById('linkTodos');
const btnConfirmarChegada = document.getElementById('btnConfirmarChegada');
const btnDoacaoRealizada = document.getElementById('btnDoacaoRealizada');

// ===== Dados dos agendamentos =====
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
const CORES_INICIAIS = ['#e2e0de', '#e2e0de', '#e2e0de', '#e2e0de', '#e2e0de', '#e2e0de'];

let paginaAtual = 1;

// ===== Gera as iniciais do nome =====
function iniciaisDe(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0].charAt(0);
  const ultima = partes[partes.length - 1].charAt(0);
  return (primeira + ultima).toUpperCase();
}

// ===== Classe de status de cada agendamento =====
const STATUS_CLASSE = {
  'Agendado': 'badge-status--agendado',
  'Em Andamento': 'badge-status--em-andamento',
  'Atrasado': 'badge-status--atrasado',
  'Finalizado': 'badge-status--finalizado'
};

// ===== Renderiza a lista da página atual =====
function renderizarAgenda() {
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const itensPagina = agendamentos.slice(inicio, inicio + ITENS_POR_PAGINA);

  agendaEl.innerHTML = itensPagina.map((item, index) => {
    const cor = CORES_INICIAIS[(inicio + index) % CORES_INICIAIS.length];
    return `
      <li class="agenda__item">
        <span class="agenda__iniciais" style="background-color: ${cor}">${iniciaisDe(item.nome)}</span>
        <span class="agenda__nome">${item.nome}</span>
        <span class="agenda__horario">${item.horario}</span>
        <span class="badge-status ${STATUS_CLASSE[item.status] || ''}">${item.status}</span>
      </li>
    `;
  }).join('');

  renderizarPaginacao();
}

// ===== Renderiza os botões de página =====
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

// ===== Clique nos botões de página =====
paginacaoEl.addEventListener('click', (event) => {
  const botao = event.target.closest('.paginacao__botao');
  if (!botao || botao.disabled) return;

  const totalPaginas = Math.ceil(agendamentos.length / ITENS_POR_PAGINA);
  const acao = botao.dataset.pagina;

  if (acao === 'anterior') paginaAtual--;
  else if (acao === 'proxima') paginaAtual++;
  else paginaAtual = Number(acao);

  if (paginaAtual < 1) paginaAtual = 1;
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

  renderizarAgenda();
});

// ===== Link "Ver todos" =====
linkTodos.textContent = `Ver todos os ${agendamentos.length} agendamentos`;

// ===== Ações do atendimento =====
// Envia a ação para a API (POST)
async function enviarAcao(endpoint, payload) {
  try {
    // TODO: substituir pela URL real da API
    const resposta = await fetch('https://api.exemplo.com/' + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resposta.ok) throw new Error('Falha na solicitação.');

    console.log('Ação enviada:', payload);
  } catch (erro) {
    alert('Não foi possível concluir a ação. Tente novamente.');
  }
}

btnConfirmarChegada.addEventListener('click', () => {
  // TODO: ajustar o payload conforme a API real
  enviarAcao('atendimento/confirmar-chegada', { paciente: 'João Pedro Lima' });
});

btnDoacaoRealizada.addEventListener('click', () => {
  // TODO: ajustar o payload conforme a API real
  enviarAcao('atendimento/doacao-realizada', { paciente: 'João Pedro Lima' });
});

// ===== Renderização inicial =====
renderizarAgenda();
