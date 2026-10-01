
document.addEventListener("DOMContentLoaded", () => {

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

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      alert(`${action}`);
      if (button.classList.contains("btn-outline-dark")) return;
        window.location.href = "agendamentos.html";
    });
  });
});
