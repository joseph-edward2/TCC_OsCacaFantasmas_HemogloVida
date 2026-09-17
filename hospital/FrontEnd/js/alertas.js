/* ======================================================
   HEMOGLOVIDA — ALERTAS E CAMPANHAS
   ======================================================
   Importe DEPOIS do base.js:

   <script src="../base.js"></script>
   <script src="js/alertas.js"></script>
   ====================================================== */

// ------------------------------------------------------
// 1. Seleção de chips de tipo sanguíneo
// (a função ativarSelecaoDeChips vem do base.js)
// ------------------------------------------------------
document.querySelectorAll('.chips').forEach(ativarSelecaoDeChips);


// ------------------------------------------------------
// 2. Busca na tabela de alertas
// ------------------------------------------------------
const inputBusca = document.getElementById('buscaAlerta');

if (inputBusca) {
  inputBusca.addEventListener('input', function () {
    const termo = this.value.toLowerCase();

    document.querySelectorAll('#alertsBody tr').forEach(function (linha) {
      const texto = linha.textContent.toLowerCase();
      linha.style.display = texto.indexOf(termo) !== -1 ? '' : 'none';
    });
  });
}


// ------------------------------------------------------
// 3. Formulário de Alerta
// ------------------------------------------------------
const formAlerta = document.getElementById('formAlerta');

if (formAlerta) {
  formAlerta.addEventListener('submit', async function (e) {
    e.preventDefault();

    const restaurar = iniciarCarregamento(this.querySelector('button[type="submit"]'), 'Publicando…');

    try {
      // TODO: trocar pela URL real da API
      await enviarParaAPI('https://api.exemplo.com/alertas', {
        titulo: this.querySelector('input[type="text"]').value,
        tiposSelecionados: chipsSelecionados(document.getElementById('chipsAlerta')),
        urgencia: this.querySelector('select').value,
        mensagem: this.querySelector('textarea').value,
        publico: this.querySelectorAll('select')[1].value,
        inicio: this.querySelectorAll('input[type="date"]')[0].value,
        expiracao: this.querySelectorAll('input[type="date"]')[1].value
      });

      alert('Alerta publicado com sucesso!');
      this.reset();
    } catch (erro) {
      alert(erro.message);
    } finally {
      restaurar();
    }
  });
}


// ------------------------------------------------------
// 4. Salvar rascunho de alerta
// ------------------------------------------------------
const btnRascunho = document.getElementById('btnSalvarRascunhoAlerta');

if (btnRascunho) {
  btnRascunho.addEventListener('click', async function () {
    const restaurar = iniciarCarregamento(this, 'Salvando…');

    try {
      // TODO: trocar pela URL real da API e montar os dados do formulário
      await enviarParaAPI('https://api.exemplo.com/alertas/rascunho', {});
      alert('Rascunho salvo com sucesso!');
    } catch (erro) {
      alert(erro.message);
    } finally {
      restaurar();
    }
  });
}


// ------------------------------------------------------
// 5. Formulário de Campanha
// ------------------------------------------------------
// (no arquivo original, essa parte tentava usar
// "formCampanha" sem antes buscar o elemento no HTML —
// corrigi isso aqui embaixo com o getElementById)
const formCampanha = document.getElementById('formCampanha');

if (formCampanha) {
  formCampanha.addEventListener('submit', async function (e) {
    e.preventDefault();

    const restaurar = iniciarCarregamento(this.querySelector('button[type="submit"]'), 'Publicando…');

    try {
      // TODO: trocar pela URL real da API
      await enviarParaAPI('https://api.exemplo.com/campanhas', {
        titulo: this.querySelector('input[type="text"]').value,
        tiposSelecionados: chipsSelecionados(document.getElementById('chipsCampanha')),
        urgencia: this.querySelector('select').value,
        publico: this.querySelectorAll('select')[1].value,
        mensagem: this.querySelector('textarea').value,
        inicio: this.querySelectorAll('input[type="date"]')[0].value,
        expiracao: this.querySelectorAll('input[type="date"]')[1].value
      });

      alert('Campanha publicada com sucesso!');
      this.reset();
    } catch (erro) {
      alert(erro.message);
    } finally {
      restaurar();
    }
  });
}
