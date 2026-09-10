/* ======================================================
   HEMOGLOVIDA — LOGIN
   ======================================================
   Importe DEPOIS do base.js:

   <script src="base.js"></script>
   <script src="js/login.js"></script>
   ====================================================== */

const loginInput = document.getElementById('login');
const senhaInput = document.getElementById('senha');
const toggleSenhaBtn = document.getElementById('toggleSenha');
const form = document.getElementById('loginForm');
const msgEl = document.getElementById('msg');

// Se algum elemento essencial não existir na página, para antes de registrar
// qualquer listener (mesmo padrão defensivo dos outros scripts).
if (!loginInput || !senhaInput || !form || !msgEl) {
  console.warn('Elementos do formulário de login não encontrados.');
} else {

// ------------------------------------------------------
// 1. Máscara automática de CPF/CNPJ
// ------------------------------------------------------
loginInput.addEventListener('input', function () {
  // Remove tudo que não é número
  let v = this.value.replace(/\D/g, '');

  if (v.length > 14) v = v.slice(0, 14);

  if (v.length <= 11) {
    // CPF: 000.000.000-00
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ: 00.000.000/0001-00
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  }

  this.value = v;
});

ativarToggleSenha(toggleSenhaBtn, senhaInput);

} // fim do else (elementos presentes)
