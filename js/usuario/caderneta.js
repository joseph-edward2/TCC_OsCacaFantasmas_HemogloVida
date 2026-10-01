/* ===================================================
   CADERNETA.JS
   Comportamentos que só existem na página Caderneta de
   Doação.
=================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      alert(`${action}`);
    });
  });
});
