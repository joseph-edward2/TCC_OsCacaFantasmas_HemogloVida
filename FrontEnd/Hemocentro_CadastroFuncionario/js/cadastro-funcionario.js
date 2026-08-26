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
var toggleBtn = document.getElementById('toggleSenha');
var senhaInput = document.getElementById('senha_funcionario');


// ------------------------------------------------------
// 1. Mostrar / ocultar senha
// (a função ativarToggleSenha vem do base.js)
// ------------------------------------------------------
ativarToggleSenha(toggleBtn, senhaInput);
