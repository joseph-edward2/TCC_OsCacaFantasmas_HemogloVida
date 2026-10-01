/* ===================================================
   CADASTRO.JS
   Comportamentos que só existem na página de Cadastro.
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // 1) Aplica as máscaras de CPF e telefone (funções vêm de js/masks.js)
  bindCpfMask(document.getElementById("cpf"));
  bindPhoneMask(document.getElementById("telefone"));

  // (O botão de mostrar/ocultar senha é tratado em js/password-toggle.js,
  // que é compartilhado com a página de Login)

  // 2) Segmented control de Gênero (Masculino / Feminino / Outro)
  const genderOptions = document.querySelectorAll(".segmented__option");
  genderOptions.forEach((option) => {
    option.addEventListener("click", () => {
      genderOptions.forEach((opt) => opt.classList.remove("is-active"));
      option.classList.add("is-active");
    });
  });

  // 4) Envio do formulário (sem backend ainda, só uma simulação simples)
  const form = document.getElementById("cadastro-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const terms = document.getElementById("terms");
    if (!terms.checked) {
      alert("Você precisa aceitar os termos de uso para continuar.");
      return;
    }

    alert("Cadastro enviado!");
    window.location.href = "login.html";
  });
});
