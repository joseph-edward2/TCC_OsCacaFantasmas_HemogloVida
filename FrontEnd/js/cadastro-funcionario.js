/* ======================================================
   HEMOGLOVIDA — CADASTRO DE FUNCIONÁRIO
   ======================================================
   Importe DEPOIS do base.js:

   <script src="../base.js"></script>
   <script src="cadastro-funcionario.js"></script>

   Este arquivo contém apenas a lógica específica da tela
   de cadastro de funcionário do hemocentro.
   ====================================================== */


// Seleciona os elementos do formulário que precisam de JS
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