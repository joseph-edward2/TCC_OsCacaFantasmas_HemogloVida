
async function enviarParaAPI(url, dados) {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  const corpo = await resposta.json().catch(function () { return null; });

  if (!resposta.ok) {
    throw new Error((corpo && corpo.message) || 'Não foi possível concluir a solicitação.');
  }

  return corpo;
}

function iniciarCarregamento(botao, textoCarregando) {
  const textoOriginal = botao.textContent;
  botao.disabled = true;
  botao.textContent = textoCarregando;

  return function restaurar() {
    botao.disabled = false;
    botao.textContent = textoOriginal;
  };
}

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = 'msg msg--' + tipo;
  elemento.hidden = false;
}

function ativarSelecaoDeChips(container) {
  if (!container) return;
  container.addEventListener('click', function (e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('chip--active');
  });
}

function chipsSelecionados(container) {
  if (!container) return [];
  const ativos = container.querySelectorAll('.chip--active');
  return Array.from(ativos).map(function (chip) { return chip.textContent.trim(); });
}

function ativarToggleSenha(botao, input) {

  if (!botao || !input) return;

  botao.addEventListener('click', function () {

    const estaOculta = input.type === 'password';

    input.type = estaOculta ? 'text' : 'password';

    botao.setAttribute(
      'aria-label',
      estaOculta ? 'Ocultar senha' : 'Mostrar senha'
    );

    const icone = botao.querySelector('.ph-eye, .ph-eye-slash');

    if (icone) {

      icone.classList.toggle('ph-eye', !estaOculta);
      icone.classList.toggle('ph-eye-slash', estaOculta);

    }

  });

}

function ativarPaginacaoSimples(container) {
  if (!container) return;
  container.addEventListener('click', function (e) {
    const botao = e.target.closest('.paginacao__botao');
    if (!botao || botao.disabled) return;

    if (botao.dataset.pagina === 'anterior' || botao.dataset.pagina === 'proxima') return;

    container.querySelectorAll('.paginacao__botao').forEach(function (b) {
      b.classList.remove('paginacao__botao--ativo');
    });
    botao.classList.add('paginacao__botao--ativo');
  });
}
