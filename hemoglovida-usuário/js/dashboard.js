/* ===================================================
   DASHBOARD.JS
   Comportamentos que só existem na página Dashboard
   (Tela Geral).
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // 1) Anima as barras de progresso das campanhas quando elas
  //    entram na tela (mesma ideia do "reveal" usado na Home).
  const progressBars = document.querySelectorAll(".campaign-card__progress-fill");

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

  // 2) Botões de ação (ainda sem backend, só uma simulação simples
  //    pra mostrar que o clique está funcionando).
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      alert(`${action}`);
    });
  });
});
