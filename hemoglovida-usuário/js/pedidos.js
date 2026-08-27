/* ===================================================
   PEDIDOS.JS
   Comportamentos que só existem na página Pedidos de
   Doação.
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // 1) Anima as barras de "Meta de Doadores" quando entram na tela
  //    (mesma ideia usada no Dashboard e na Home).
  const progressBars = document.querySelectorAll(".pedido-card__progress-fill");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const percent = entry.target.dataset.percent || 0;
          entry.target.style.width = `${percent}%`;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  progressBars.forEach((bar) => observer.observe(bar));

  // 2) Botões de ação (sem backend ainda, só uma simulação simples).
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      alert(`${action}`);
    });
  });

  // 3) Botão "Carregar mais pedidos"
  const loadMoreButton = document.getElementById("load-more");
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      alert("Carregando mais pedidos...");
    });
  }
});
