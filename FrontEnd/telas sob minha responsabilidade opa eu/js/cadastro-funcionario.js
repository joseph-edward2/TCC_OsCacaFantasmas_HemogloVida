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
const toggleBtn = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha_funcionario');


// ------------------------------------------------------
// 1. Mostrar / ocultar senha
// (a função ativarToggleSenha vem do base.js)
// ------------------------------------------------------
// A função ativarToggleSenha já verifica se os elementos existem
// antes de registrar o listener, então não precisa de guarda aqui.
ativarToggleSenha(toggleBtn, senhaInput);