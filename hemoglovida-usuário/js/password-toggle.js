/* ===================================================
   PASSWORD-TOGGLE.JS
   Liga o comportamento de "mostrar/ocultar senha" em
   qualquer botão com a classe .form-toggle-visibility.
   Usado no Login, Cadastro e em qualquer página futura
   que tenha campo de senha.
=================================================== */

function initPasswordToggles() {
  document.querySelectorAll(".form-toggle-visibility").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
    });
  });
}

document.addEventListener("DOMContentLoaded", initPasswordToggles);
