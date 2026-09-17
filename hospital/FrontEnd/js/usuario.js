// ---------- TOAST ----------

let toastTimer;

function showToast(msg){

  let toast = document.getElementById('toast');

  if(!toast){
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(()=>{
    toast.classList.remove('show');
  }, 2600);
}


// ---------- CAMPOS "ALTERAR" (email / telefone) ----------

document.querySelectorAll('.btn-alterar').forEach(btn=>{

  btn.addEventListener('click', ()=>{

    const input = document.getElementById(btn.dataset.target);
    const editing = !input.disabled;

    if(editing){

      input.disabled = true;
      btn.textContent = 'Alterar';
      btn.classList.remove('editing');

      showToast('Informação atualizada com sucesso.');

    } else {

      input.disabled = false;
      input.focus();

      btn.textContent = 'Salvar';
      btn.classList.add('editing');

    }

  });

});


// ---------- MODAL ALTERAR SENHA ----------

const passwordOverlay = document.getElementById('passwordOverlay');

document.getElementById('changePasswordBtn').addEventListener('click', ()=>{

  document.getElementById('currentPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';

  passwordOverlay.classList.add('show');

});


document.getElementById('passwordClose').addEventListener('click', ()=>{

  passwordOverlay.classList.remove('show');

});


passwordOverlay.addEventListener('click', (e)=>{

  if(e.target === passwordOverlay){
    passwordOverlay.classList.remove('show');
  }

});


document.getElementById('savePasswordBtn').addEventListener('click', ()=>{

  const current = document.getElementById('currentPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirm = document.getElementById('confirmPass').value;

  if(!current || !newPass || !confirm){

    showToast('Preencha todos os campos de senha.');
    return;

  }

  if(newPass !== confirm){

    showToast('A confirmação não coincide com a nova senha.');
    return;

  }

  if(newPass.length < 6){

    showToast('A nova senha deve ter pelo menos 6 caracteres.');
    return;

  }

  document.getElementById('passwordField').value = newPass;

  passwordOverlay.classList.remove('show');

  showToast('Senha alterada com sucesso.');

});


// ---------- SALVAR ALTERAÇÕES ----------

document.getElementById('saveBtn').addEventListener('click', ()=>{

  showToast('Alterações salvas com sucesso!');

});


// ---------- ENCERRAR CONTA ----------

const deleteOverlay = document.getElementById('deleteOverlay');

document.getElementById('deleteAccountBtn').addEventListener('click', ()=>{

  deleteOverlay.classList.add('show');

});


document.getElementById('deleteClose').addEventListener('click', ()=>{

  deleteOverlay.classList.remove('show');

});


document.getElementById('cancelDelete').addEventListener('click', ()=>{

  deleteOverlay.classList.remove('show');

});


deleteOverlay.addEventListener('click', (e)=>{

  if(e.target === deleteOverlay){
    deleteOverlay.classList.remove('show');
  }

});


document.getElementById('confirmDelete').addEventListener('click', ()=>{

  deleteOverlay.classList.remove('show');

  showToast('Conta encerrada com sucesso.');

});