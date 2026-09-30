
const form = document.getElementById('cadastroFuncionarioForm');
const toggleBtn = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha_funcionario');


if (form) form.addEventListener('submit', async function (e) {
  e.preventDefault();
   setTimeout(function () {
   mostrarMensagem(document.getElementById('msg'), 'Funcionário cadastrado com sucesso!', 'success');
   window.location.href = 'Hospital_login.html';
  }, 600);
});

ativarToggleSenha(toggleBtn, senhaInput);