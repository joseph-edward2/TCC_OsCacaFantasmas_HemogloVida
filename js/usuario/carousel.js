/* ===================================================
   CAROUSEL.JS
   Carrossel simples e genérico, sem nenhuma biblioteca.
   Dá pra reaproveitar em qualquer seção do site que
   precise de um carrossel, bastando seguir a mesma
   estrutura de HTML (ver seção "Você sabia?" na Home).
=================================================== */

function initCarousel(root) {
  const track = root.querySelector(".info-carousel__track");
  const cards = Array.from(track.children);
  const dotsWrapper = root.querySelector(".info-carousel__dots");
  const prevBtn = root.querySelector('[data-carousel-btn="prev"]');
  const nextBtn = root.querySelector('[data-carousel-btn="next"]');

  let current = 0;
  let autoplayId = null;
  const AUTOPLAY_DELAY = 6000;

  // Cria uma bolinha (dot) pra cada card
  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "info-carousel__dot";
    dot.setAttribute("aria-label", `Ir para o card ${index + 1}`);
    dot.addEventListener("click", () => goTo(index));
    dotsWrapper.appendChild(dot);
  });

  const dots = Array.from(dotsWrapper.children);

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("info-carousel__dot--active", index === current);
    });
  }

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    update();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }

  prevBtn.addEventListener("click", () => {
    prev();
    startAutoplay(); // reinicia a contagem quando o usuário interage
  });

  nextBtn.addEventListener("click", () => {
    next();
    startAutoplay();
  });

  // Pausa o autoplay quando o mouse está em cima do carrossel
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);

  update();
  startAutoplay();
}

// Inicializa todos os carrosséis que existirem na página
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".info-carousel").forEach(initCarousel);
});
