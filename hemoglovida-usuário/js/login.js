/* ===================================================
   LOGIN.JS
   Comportamentos que só existem na página de Login.
   O botão de mostrar/ocultar senha vem de
   js/password-toggle.js (compartilhado com o Cadastro).
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // O campo aceita CPF OU telefone, então a máscara de CPF só é aplicada
  // enquanto o texto digitado parecer um CPF (só números, até 11 dígitos).
  // Isso evita "quebrar" caso a pessoa prefira digitar um telefone aqui.
  const cpfOuTelefone = document.getElementById("cpf-telefone");
  if (cpfOuTelefone) {
    cpfOuTelefone.addEventListener("input", () => {
      cpfOuTelefone.value = maskCPF(cpfOuTelefone.value);
    });
  }

  const form = document.getElementById("login-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Login realizado com sucesso!");
    window.location.href = "confirmacao.html";
  });
});
