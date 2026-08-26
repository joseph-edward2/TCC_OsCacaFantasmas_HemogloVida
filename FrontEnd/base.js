/* ======================================================
   HEMOGLOVIDA — JS BASE
   ======================================================
   Funções que se REPETEM em várias páginas: enviar dados
   pra uma API, mostrar mensagens de erro/sucesso, deixar
   um botão em "carregando", selecionar chips e mostrar/
   ocultar senha.

   Importe SEMPRE ANTES do JS da página específica:

   <script src="../base.js"></script>
   <script src="js/login.js"></script>

   A ordem importa! O base.js precisa existir primeiro pras
   funções abaixo já estarem disponíveis quando o script da
   página for executado.
   ====================================================== */


/**
 * Envia dados em JSON pra uma API via POST e devolve a
 * resposta já convertida em objeto JS.
 *
 * Se a API responder com erro (status fora da faixa 200),
 * a função lança um erro — por isso ela deve ser chamada
 * dentro de um try/catch (veja exemplos nas páginas).
 *
 * Uso:
 *   const dados = await enviarParaAPI('https://.../rota', { titulo: 'x' });
 */
async function enviarParaAPI(url, dados) {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  // Tenta ler o corpo da resposta como JSON; se não der, segue com null
  const corpo = await resposta.json().catch(function () { return null; });

  if (!resposta.ok) {
    throw new Error((corpo && corpo.message) || 'Não foi possível concluir a solicitação.');
  }

  return corpo;
}


/**
 * Coloca um botão em estado de "carregando": desabilita e
 * troca o texto (ex: "Entrar" → "Entrando…").
 *
 * Devolve uma função "restaurar" — chame ela depois que a
 * ação terminar (dentro do finally, por exemplo), pra
 * voltar o botão ao normal.
 *
 * Uso:
 *   const restaurar = iniciarCarregamento(botao, 'Enviando…');
 *   // ...faz a requisição...
 *   restaurar();
 */
function iniciarCarregamento(botao, textoCarregando) {
  const textoOriginal = botao.textContent;
  botao.disabled = true;
  botao.textContent = textoCarregando;

  return function restaurar() {
    botao.disabled = false;
    botao.textContent = textoOriginal;
  };
}


/**
 * Mostra uma mensagem de erro ou sucesso dentro de um
 * elemento com a classe .msg (os estilos .msg--error e
 * .msg--success já existem no CSS da página de login).
 *
 * Uso:
 *   mostrarMensagem(msgEl, 'Login realizado com sucesso!', 'success');
 *   mostrarMensagem(msgEl, 'Senha incorreta.', 'error');
 */
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = 'msg msg--' + tipo; // tipo: 'error' ou 'success'
  elemento.hidden = false;
}


/**
 * Liga o clique de "selecionar/desselecionar" em chips
 * dentro de um container (ex: escolher tipos sanguíneos).
 * Cada chip clicado ganha ou perde a classe "chip--active".
 *
 * Uso:
 *   ativarSelecaoDeChips(document.getElementById('chipsAlerta'));
 */
function ativarSelecaoDeChips(container) {
  if (!container) return;
  container.addEventListener('click', function (e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('chip--active');
  });
}


/**
 * Devolve o texto de todos os chips selecionados (com a
 * classe "chip--active") dentro de um container.
 *
 * Uso:
 *   chipsSelecionados(document.getElementById('chipsAlerta'))
 *   // -> ['O-', 'AB+']
 */
function chipsSelecionados(container) {
  if (!container) return [];
  const ativos = container.querySelectorAll('.chip--active');
  return Array.from(ativos).map(function (chip) { return chip.textContent.trim(); });
}


/**
 * Liga um botão de "olho" a um campo de senha, alternando
 * entre mostrar e ocultar o texto digitado.
 *
 * Uso:
 *   ativarToggleSenha(document.getElementById('toggleSenha'), senhaInput);
 */
function ativarToggleSenha(botao, input) {
  if (!botao || !input) return;
  botao.addEventListener('click', function () {
    const estaOculta = input.type === 'password';
    input.type = estaOculta ? 'text' : 'password';
    botao.setAttribute('aria-label', estaOculta ? 'Ocultar senha' : 'Mostrar senha');
  });
}


/**
 * Liga o clique nos botões de paginação (.paginacao__botao)
 * de um container: ao clicar num botão, ele vira o "ativo"
 * e os outros perdem o destaque.
 *
 * Serve pra paginação SEM dados dinâmicos (ex: Estoque, onde
 * a tabela ainda não troca de conteúdo de verdade). Se a
 * página precisar buscar dados novos a cada página (como o
 * Atendimento faz), use essa função como referência mas
 * escreva sua própria lógica — ela é específica demais pra
 * entrar aqui no base.js.
 *
 * Uso:
 *   ativarPaginacaoSimples(document.getElementById('paginacao'));
 */
function ativarPaginacaoSimples(container) {
  if (!container) return;
  container.addEventListener('click', function (e) {
    const botao = e.target.closest('.paginacao__botao');
    if (!botao || botao.disabled) return;

    // Botões de "anterior"/"próxima" não têm número de página
    // fixo, então não fazem sentido virar "ativos" sozinhos
    if (botao.dataset.pagina === 'anterior' || botao.dataset.pagina === 'proxima') return;

    container.querySelectorAll('.paginacao__botao').forEach(function (b) {
      b.classList.remove('paginacao__botao--ativo');
    });
    botao.classList.add('paginacao__botao--ativo');
  });
}
