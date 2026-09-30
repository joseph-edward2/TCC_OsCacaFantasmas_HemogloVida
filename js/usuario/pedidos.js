document.addEventListener("DOMContentLoaded", () => {

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

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      alert(`${action}`);
      if (button.classList.contains("pedido-card__share")) return;
        window.location.href = "agendamentos.html";
    });
  });

  const loadMoreButton = document.getElementById("load-more");
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      alert("Carregando mais pedidos...");
    });
  }
});
