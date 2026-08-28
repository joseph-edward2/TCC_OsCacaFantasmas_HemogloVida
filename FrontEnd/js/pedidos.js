/* ======================================================
   HEMOGLOVIDA — PEDIDOS (HOSPITAL)
   ======================================================
   Importe DEPOIS do base.js:

   <script src="../base.js"></script>
   <script src="js/pedidos.js"></script>
   ====================================================== */

const btnNovaRequisicao = document.getElementById('btnNovaRequisicao');
const formNovaRequisicao = document.getElementById('formNovaRequisicao');

const tipoSanguineoEl = document.getElementById('tipoSanguineo');
const tipoSanguineoValor = document.getElementById('tipoSanguineoValor');

const qtyInput = document.getElementById('qtyInput');
const qtyMenos = document.getElementById('qtyMenos');
const qtyMais = document.getElementById('qtyMais');

const inputArquivo = document.getElementById('inputArquivo');
const btnTrocarArquivo = document.getElementById('btnTrocarArquivo');
const nomeArquivo = document.getElementById('nomeArquivo');
const metaArquivo = document.getElementById('metaArquivo');

const formRequisicao = document.getElementById('formRequisicao');


// ------------------------------------------------------
// 1. Botão "Nova Requisição" leva até o formulário
// ------------------------------------------------------
if (btnNovaRequisicao) {
  btnNovaRequisicao.addEventListener('click', function () {
    formNovaRequisicao.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}


// ------------------------------------------------------
// 2. Seleção do tipo sanguíneo (só um ativo por vez)
// ------------------------------------------------------
if (tipoSanguineoEl) {
  tipoSanguineoEl.addEventListener('click', function (e) {
    const botao = e.target.closest('.blood-select__btn');
    if (!botao) return;

    // Tira o destaque de todos os botões...
    tipoSanguineoEl.querySelectorAll('.blood-select__btn').forEach(function (b) {
      b.classList.remove('blood-select__btn--active');
    });

    // ...e destaca só o que foi clicado
    botao.classList.add('blood-select__btn--active');
    tipoSanguineoValor.value = botao.textContent.trim();
  });
}


// ------------------------------------------------------
// 3. Stepper de quantidade (botões - e +)
// ------------------------------------------------------
if (qtyMenos && qtyMais && qtyInput) {
  qtyMenos.addEventListener('click', function () {
    const valorAtual = Number(qtyInput.value) || 1;
    qtyInput.value = Math.max(1, valorAtual - 1);
  });

  qtyMais.addEventListener('click', function () {
    const valorAtual = Number(qtyInput.value) || 0;
    qtyInput.value = valorAtual + 1;
  });
}


// ------------------------------------------------------
// 4. Upload do documento (mostra o nome do arquivo escolhido)
// ------------------------------------------------------
if (btnTrocarArquivo) {
  btnTrocarArquivo.addEventListener('click', function () {
    inputArquivo.click();
  });
}

if (inputArquivo) {
  inputArquivo.addEventListener('change', function () {
    const arquivo = this.files[0];
    if (!arquivo) return;

    const tamanhoMB = (arquivo.size / (1024 * 1024)).toFixed(1);
    nomeArquivo.textContent = arquivo.name;
    metaArquivo.textContent = `Arquivo pronto para envio (${tamanhoMB} MB)`;
    btnTrocarArquivo.textContent = 'Trocar arquivo';
  });
}


// ------------------------------------------------------
// 5. Envio do formulário
// (usa enviarParaAPI e iniciarCarregamento do base.js)
// ------------------------------------------------------
if (formRequisicao) {
  formRequisicao.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!tipoSanguineoValor.value) {
      alert('Selecione o tipo sanguíneo requerido.');
      return;
    }

    const restaurar = iniciarCarregamento(this.querySelector('button[type="submit"]'), 'Enviando…');

    try {
      // TODO: trocar pela URL real da API. Se precisar enviar o
      // arquivo PDF junto, isso normalmente é feito com um
      // FormData em vez de JSON puro.
      await enviarParaAPI('https://api.exemplo.com/pedidos', {
        tipoSanguineo: tipoSanguineoValor.value,
        quantidade: qtyInput.value,
        urgencia: this.querySelector('select[name="urgencia"]').value,
        pacienteSetor: this.querySelector('input[name="paciente_setor"]').value,
        hemocentro: this.querySelector('input[name="hemocentro"]:checked').value
      });

      alert('Requisição enviada com sucesso!');
      this.reset();
    } catch (erro) {
      alert(erro.message);
    } finally {
      restaurar();
    }
  });
}
