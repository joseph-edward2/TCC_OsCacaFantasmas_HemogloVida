// ===== Elementos da página =====
const agendaEl = document.getElementById('agenda');
const paginacaoEl = document.getElementById('paginacao');
const linkTodos = document.getElementById('linkTodos');
const btnConfirmarChegada = document.getElementById('btnConfirmarChegada');
const btnDoacaoRealizada = document.getElementById('btnDoacaoRealizada');

// Card "Atendimento em Curso"
const badgeHorarioEl = document.getElementById('badgeHorario');
const pacienteFotoEl = document.getElementById('pacienteFoto');
const pacienteNomeEl = document.getElementById('pacienteNome');
const pacienteTipoEl = document.getElementById('pacienteTipo');
const pacienteCpfEl = document.getElementById('pacienteCpf');
const pacienteTagEl = document.getElementById('pacienteTag');
const observacaoEl = document.getElementById('observacaoTexto');

// Elementos do passo a passo (stepper)
const passos = document.querySelectorAll('.stepper .step');
const linhas = document.querySelectorAll('.stepper .step__line');

// ===== Dados dos agendamentos =====
// TODO: substituir por uma chamada fetch() à API real
// etapa: 1 = aguardando chegada | 2 = chegou | 3 = doação concluída
const agendamentos = [
  { nome: 'Maria Silva', horario: '08:00', status: 'Finalizado', etapa: 3,
    tipo: 'A+', cpf: '318.*.-22', foto: null, tag: '', obs: 'Doação concluída sem intercorrências.' },
  { nome: 'Jesse Pinkman', horario: '09:30', status: 'Em Andamento', statusOriginal: 'Agendado', etapa: 1,
    tipo: 'O-', cpf: '452.*.-01', foto: '../../assets/JessePinkman.png', tag: 'Doador Frequente',
    obs: 'Última doação há 4 meses. Sem restrições relatadas na triagem digital.' },
  { nome: 'Ana Souza', horario: '10:15', status: 'Agendado', etapa: 1,
    tipo: 'B+', cpf: '227.*.-35', foto: null, tag: 'Primeira Doação',
    obs: 'Primeira doação. Orientar sobre hidratação e alimentação antes da coleta.' },
  { nome: 'Carlos Pereira', horario: '11:00', status: 'Agendado', etapa: 1,
    tipo: 'A-', cpf: '509.*.-48', foto: '../../assets/CarlosPereira.png', tag: 'Doador Frequente',
    obs: 'Última doação há 6 meses. Sem restrições relatadas na triagem digital.' },
  { nome: 'Fernanda Costa', horario: '13:30', status: 'Atrasado', etapa: 1,
    tipo: 'AB+', cpf: '146.*.-70', foto: null, tag: '',
    obs: 'Paciente em atraso. Confirmar se ainda deseja realizar a doação.' },
  { nome: 'Pedro Almeida', horario: '14:45', status: 'Agendado', etapa: 1,
    tipo: 'O+', cpf: '683.*.-19', foto: null, tag: 'Doador Frequente',
    obs: 'Última doação há 5 meses. Sem restrições relatadas na triagem digital.' },
  { nome: 'Juliana Ramos', horario: '16:00', status: 'Agendado', etapa: 1,
    tipo: 'B-', cpf: '392.*.-84', foto: null, tag: 'Primeira Doação',
    obs: 'Primeira doação. Sem restrições relatadas na triagem digital.' },
  { nome: 'Roberto Nunes', horario: '17:30', status: 'Agendado', etapa: 1,
    tipo: 'A+', cpf: '775.*.-63', foto: null, tag: '',
    obs: 'Sem restrições relatadas na triagem digital.' }
];

const ITENS_POR_PAGINA = 6;
const CORES_INICIAIS = ['#e2e0de', '#e2e0de', '#e2e0de', '#e2e0de', '#e2e0de', '#e2e0de'];

let paginaAtual = 1;

// Doador que está em atendimento agora
let pacienteAtual = agendamentos.find(a => a.status === 'Em Andamento');

// ===== Gera as iniciais do nome =====
function iniciaisDe(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0].charAt(0);
  const ultima = partes[partes.length - 1].charAt(0);
  return (primeira + ultima).toUpperCase();
}

// ===== Foto padrão (iniciais) para quem não tem foto =====
function fotoPadrao(nome) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="84">
    <rect width="100%" height="100%" fill="#e2e0de"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
      font-family="sans-serif" font-size="22" font-weight="700" fill="#a50021">${iniciaisDe(nome)}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
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
    const indiceGlobal = inicio + index;
    const cor = CORES_INICIAIS[indiceGlobal % CORES_INICIAIS.length];
    const ehAtual = item === pacienteAtual;
    const clicavel = !ehAtual && item.status !== 'Finalizado';

    const classes = ['agenda__item'];
    if (ehAtual) classes.push('agenda__item--atual');
    if (clicavel) classes.push('agenda__item--clicavel');

    const atributos = clicavel
      ? `data-indice="${indiceGlobal}" role="button" tabindex="0" title="Atender ${item.nome}"`
      : '';

    return `
      <li class="${classes.join(' ')}" ${atributos}>
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

// ===== Preenche o card "Atendimento em Curso" e as observações =====
function renderizarPaciente() {
  const p = pacienteAtual;

  badgeHorarioEl.textContent = p.horario;
  pacienteFotoEl.src = p.foto || fotoPadrao(p.nome);
  pacienteFotoEl.alt = 'Foto de ' + p.nome;
  pacienteNomeEl.textContent = p.nome;
  pacienteTipoEl.textContent = 'Tipo Sanguíneo: ' + p.tipo;
  pacienteCpfEl.textContent = 'CPF: ' + p.cpf;
  pacienteTagEl.textContent = p.tag;
  pacienteTagEl.style.display = p.tag ? '' : 'none';
  observacaoEl.textContent = p.obs;
}

// ===== Passo a passo do atendimento =====
const USAR_API = false; // troque para true quando a API real estiver pronta

let enviando = false; // evita cliques duplos enquanto a requisição está em andamento

function renderizarPassos() {
  const etapa = pacienteAtual.etapa;

  passos.forEach((passo, i) => {
    const circulo = passo.querySelector('.step__circle');
    const rotulo = passo.querySelector('.step__label');
    const concluido = i < etapa;
    const atual = i === etapa;

    circulo.classList.toggle('step__circle--done', concluido);
    circulo.classList.toggle('step__circle--current', atual);
    circulo.innerHTML = concluido ? '&#10003;' : '';

    rotulo.classList.toggle('step__label--current', atual);
  });

  linhas.forEach((linha, i) => {
    linha.classList.toggle('step__line--done', i < etapa);
  });

  // Cada botão só fica habilitado na sua etapa
  btnConfirmarChegada.disabled = enviando || etapa !== 1;
  btnDoacaoRealizada.disabled = enviando || etapa !== 2;
}

// Envia a ação para a API (POST). Retorna true em caso de sucesso
async function enviarAcao(endpoint, payload) {
  if (!USAR_API) return true; // modo de teste: simula sucesso

  try {
    // TODO: substituir pela URL real da API
    const resposta = await fetch('https://api.exemplo.com/' + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resposta.ok) throw new Error('Falha na solicitação.');

    console.log('Ação enviada:', payload);
    return true;
  } catch (erro) {
    alert('Não foi possível concluir a ação. Tente novamente.');
    return false;
  }
}

// Executa a ação, bloqueando os botões durante o envio
async function executarEtapa(endpoint, proximaEtapa, aoConcluir) {
  enviando = true;
  renderizarPassos();

  // TODO: ajustar o payload conforme a API real
  const ok = await enviarAcao(endpoint, { paciente: pacienteAtual.nome });

  enviando = false;
  if (ok) {
    pacienteAtual.etapa = proximaEtapa;
    if (aoConcluir) aoConcluir();
  }
  renderizarPassos();
}

// Passo 1 → "Chegou" concluído, "Concluído" vira o passo ativo
btnConfirmarChegada.addEventListener('click', () => {
  if (pacienteAtual.etapa !== 1 || enviando) return;
  executarEtapa('atendimento/confirmar-chegada', 2);
});

// Passo 2 → todos os passos concluídos e agenda marcada como "Finalizado"
btnDoacaoRealizada.addEventListener('click', () => {
  if (pacienteAtual.etapa !== 2 || enviando) return;
  executarEtapa('atendimento/doacao-realizada', 3, () => {
    pacienteAtual.status = 'Finalizado';
    renderizarAgenda();
  });
});

// ===== Troca de doador =====
// O doador clicado na agenda assume o atendimento; o que estava em
// atendimento volta para a agenda (mantendo a etapa em que parou).
function trocarDoador(indice) {
  if (enviando) return;

  const novo = agendamentos[indice];
  if (!novo || novo === pacienteAtual || novo.status === 'Finalizado') return;

  const anterior = pacienteAtual;
  anterior.status = anterior.etapa === 3 ? 'Finalizado' : (anterior.statusOriginal || 'Agendado');

  novo.statusOriginal = novo.status; // guarda para restaurar se ele for trocado depois
  novo.status = 'Em Andamento';
  pacienteAtual = novo;

  renderizarPaciente();
  renderizarPassos();
  renderizarAgenda();
}

function tratarCliqueAgenda(event) {
  const item = event.target.closest('.agenda__item--clicavel');
  if (!item) return;
  trocarDoador(Number(item.dataset.indice));
}

agendaEl.addEventListener('click', tratarCliqueAgenda);
agendaEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    tratarCliqueAgenda(event);
  }
});

// ===== Renderização inicial =====
renderizarPaciente();
renderizarAgenda();
renderizarPassos();
