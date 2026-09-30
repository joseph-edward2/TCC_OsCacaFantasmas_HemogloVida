/* =============================================
   Hemoglovida - Alertas e Campanhas
   Comportamentos interativos (JS puro)
   ============================================= */

// --- Seleção de chips de tipo sanguíneo ---
document.querySelectorAll('.chips').forEach(function(container) {
  container.addEventListener('click', function(e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('chip--active');
  });
});

// --- Busca na tabela de alertas ---
var inputBusca = document.getElementById('buscaAlerta');
if (inputBusca) {
  inputBusca.addEventListener('input', function() {
    var termo = this.value.toLowerCase();
    var linhas = document.querySelectorAll('#alertsBody tr');
    linhas.forEach(function(linha) {
      var texto = linha.textContent.toLowerCase();
      linha.style.display = texto.indexOf(termo) !== -1 ? '' : 'none';
    });
  });
}

// --- Formulário de Alerta ---
var formAlerta = document.getElementById('formAlerta');
if (formAlerta) {
  formAlerta.addEventListener('submit', function(e) {
    e.preventDefault();


    fetch('https://api.placeholder.com/alertas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: this.querySelector('input[type="text"]').value,
        tiposSelecionados: getChipsAtivos('chipsAlerta'),
        urgencia: this.querySelector('select').value,
        mensagem: this.querySelector('textarea').value,
        publico: this.querySelectorAll('select')[1].value,
        inicio: this.querySelectorAll('input[type="date"]')[0].value,
        expiracao: this.querySelectorAll('input[type="date"]')[1].value
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log('Alerta publicado:', data);
      alert('Alerta publicado com sucesso!');
    })
    .catch(function(err) {
      console.error('Erro ao publicar alerta:', err);
      alert('Erro ao publicar alerta. Verifique o console.');
    });
  });
}

var btnRascunho = document.getElementById('btnSalvarRascunhoAlerta');
if (btnRascunho) {
  btnRascunho.addEventListener('click', function() {
    
    fetch('https://api.example.com/alertas/rascunho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* dados do formulário */ })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log('Rascunho salvo:', data);
      alert('Rascunho salvo com sucesso!');
    })
    .catch(function(err) {
      console.error('Erro ao salvar rascunho:', err);
      alert('Erro ao salvar rascunho. Verifique o console.');
    });
  });
}


if (formCampanha) {
  formCampanha.addEventListener('submit', function(e) {
    e.preventDefault();

 
    fetch('https://api.example.com/campanhas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: this.querySelector('input[type="text"]').value,
        tiposSelecionados: getChipsAtivos('chipsCampanha'),
        urgencia: this.querySelector('select').value,
        publico: this.querySelectorAll('select')[1].value,
        mensagem: this.querySelector('textarea').value,
        inicio: this.querySelectorAll('input[type="date"]')[0].value,
        expiracao: this.querySelectorAll('input[type="date"]')[1].value
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log('Campanha publicada:', data);
      alert('Campanha publicada com sucesso!');
    })
    .catch(function(err) {
      console.error('Erro ao publicar campanha:', err);
      alert('Erro ao publicar campanha. Verifique o console.');
    });
  });
}

function getChipsAtivos(containerId) {
  var chips = document.querySelectorAll('#' + containerId + ' .chip--active');
  return Array.from(chips).map(function(c) { return c.textContent.trim(); });
}
