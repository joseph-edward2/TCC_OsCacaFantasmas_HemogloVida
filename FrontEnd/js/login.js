/* ======================================================
   HEMOGLOVIDA — LOGIN
   ======================================================
   Importe DEPOIS do base.js:

   <script src="../base.js"></script>
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


// ------------------------------------------------------
// 2. Mostrar / ocultar senha
// (a função ativarToggleSenha vem do base.js)
// ------------------------------------------------------
ativarToggleSenha(toggleSenhaBtn, senhaInput);


// ------------------------------------------------------
// 3. Validação e envio do formulário
// (usa enviarParaAPI, iniciarCarregamento e
// mostrarMensagem do base.js)
// ------------------------------------------------------
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  msgEl.hidden = true;

  // Remove a formatação (pontos/traço) só pra validar
  const documento = loginInput.value.replace(/\D/g, '');
  const senha = senhaInput.value;

  if (documento.length < 11) {
    mostrarMensagem(msgEl, 'Informe um CPF ou CNPJ válido.', 'error');
    return;
  }

  if (senha.length < 6) {
    mostrarMensagem(msgEl, 'A senha deve ter pelo menos 6 caracteres.', 'error');
    return;
  }

  const restaurar = iniciarCarregamento(form.querySelector('.btn'), 'Entrando…');

  try {
    // TODO: trocar pela URL real da API
    await enviarParaAPI('https://api-exemplo.com/auth/login', {
      documento: documento,
      senha: senha
    });

    mostrarMensagem(msgEl, 'Login realizado com sucesso!', 'success');

    // TODO: redirecionar ou salvar o token de acesso
    // window.location.href = '/painel';
  } catch (erro) {
    mostrarMensagem(msgEl, erro.message, 'error');
  } finally {
    restaurar();
  }
});

} // fim do else (elementos presentes)
