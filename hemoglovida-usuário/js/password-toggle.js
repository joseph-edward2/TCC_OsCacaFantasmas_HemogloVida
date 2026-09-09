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
      const icon = button.querySelector("i");
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";

      // Troca o ícone junto: olho aberto quando a senha está visível,
      // olho riscado quando está oculta.
      if (icon) {
        icon.classList.toggle("ph-eye", !isHidden);
        icon.classList.toggle("ph-eye-slash", isHidden);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initPasswordToggles);
