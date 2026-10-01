// Máscara automática de CPF/CNPJ
const loginInput = document.getElementById('login');

loginInput.addEventListener('input', function () {
  // Remove tudo que não é número
  let v = this.value.replace(/\D/g, '');

  if (v.length > 14) v = v.slice(0, 14);

  // CPF: 000.000.000-00
  if (v.length <= 11) {
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

// Mostrar / ocultar senha
const toggleBtn = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha');

toggleBtn.addEventListener('click', function () {
  const isPassword = senhaInput.type === 'password';
  senhaInput.type = isPassword ? 'text' : 'password';
  this.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
});

// Validação e envio do formulário
const form = document.getElementById('loginForm');
const msgEl = document.getElementById('msg');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Limpa mensagem anterior
  msgEl.hidden = true;
  msgEl.textContent = '';
  msgEl.className = 'msg';

  // Remove formatação para validar
  const doc = loginInput.value.replace(/\D/g, '');
  const senha = senhaInput.value;

  // Validação simples
  if (doc.length < 11) {
    showError('Informe um CPF ou CNPJ válido.');
    return;
  }

  if (senha.length < 6) {
    showError('A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  // Desabilita botão durante envio
  const btn = form.querySelector('.btn');
  btn.disabled = true;
  btn.textContent = 'Entrando…';

    showSuccess('Login realizado com sucesso!');
    window.location.href = 'Hem_Tela_Inicial.html';
});

function showError(text) {
  msgEl.textContent = text;
  msgEl.className = 'msg msg--error';
  msgEl.hidden = false;
}

function showSuccess(text) {
  msgEl.textContent = text;
  msgEl.className = 'msg msg--success';
  msgEl.hidden = false;
}
