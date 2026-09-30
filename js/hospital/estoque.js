
const btnRequisicao = document.getElementById('btnRequisicao');
const btnExportar = document.getElementById('btnExportar');
const btnImprimir = document.getElementById('btnImprimir');

if (btnRequisicao) {
  btnRequisicao.addEventListener('click', async function () {
    const restaurar = iniciarCarregamento(btnRequisicao, 'Enviando…');

    try {

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

if (btnExportar) {
  btnExportar.addEventListener('click', function () {

    alert('Exportação ainda não implementada.');
  });
}

if (btnImprimir) {
  btnImprimir.addEventListener('click', function () {
    window.print();
  });
}

const bolsasMock = {
  'H-1234': {
    status: 'Reservada',
    pacienteDestino: 'Jonh Ligma',
    nomeDoador: 'Jesse Pinkman',
    caderneta: '1234O-',
    dataEnvio: '12/10/2023',
    aboRh: 'AB+',
    dataValidade: '12/10/2023',
    origem: 'Hemocentro Central',
    dataDoacao: '11/09/2001',
    idDoacao: 'A000 00 000000 00'
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
    dataDoacao: '02/03/2024',
    idDoacao: 'C000 33 789012 02'
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
    dataDoacao: '18/09/2023',
    idDoacao: 'W000 11 123456 00'
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
    dataDoacao: '05/07/2023',
    idDoacao: 'B000 22 654321 01'
    
  },
    'H-1238': {
    status: 'Descartada',
    pacienteDestino: 'Hank Schrader',
    nomeDoador: 'Walter White Jr.',
    caderneta: '80085B-',
    dataEnvio: '06/07/2023',
    aboRh: 'B-',
    dataValidade: '22/10/2024',
    origem: 'Hemocentro Central',
    dataDoacao: '05/07/2023',
    idDoacao: 'B119 33 012042 11'
    
  }
};

const modalOverlay = document.getElementById('modalInventarioOverlay');
const selectBolsa = document.getElementById('selectBolsa');

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
  document.getElementById('infoIDDoacao').value = dados.idDoacao;
}

function abrirModalInventario(id) {
  carregarBolsa(id);
  modalOverlay.classList.add('show');
}

document.querySelectorAll('[data-abrir-inventario]').forEach(function (botao) {
  botao.addEventListener('click', function () {

    abrirModalInventario(botao.dataset.bolsa || 'H-1234');
  });
});


selectBolsa.addEventListener('change', function () {
  carregarBolsa(this.value);
});

document.getElementById('modalInventarioClose').addEventListener('click', function () {
  modalOverlay.classList.remove('show');
});

modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) modalOverlay.classList.remove('show');
});

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
