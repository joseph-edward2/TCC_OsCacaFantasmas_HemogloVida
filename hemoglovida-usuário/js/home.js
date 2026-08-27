/* ===================================================
   HOME.JS
   Comportamentos que só existem na página Home:
   1) Anima os cards de "Estoque atualizado semanalmente"
      quando eles entram na tela (scroll reveal).
   2) Preenche o ícone de gota de cada card de acordo
      com a porcentagem definida no HTML (data-percent).
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const stockCards = document.querySelectorAll(".stock-card");

  // 1) Preenche a "gota" de cada card com a altura certa
  stockCards.forEach((card) => {
    const percent = card.dataset.percent || 0;
    const fill = card.querySelector(".stock-card__icon-fill");
    if (fill) fill.style.height = `${percent}%`;
    if (`${percent}%` > "65" ){
      fill.style.borderRadius = "20px 20px 40px 40px"
    };
  });

  // 2) Observa quando os cards entram na tela pra animar a entrada
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // pequeno atraso entre um card e outro (efeito "cascata")
          const delay = index * 100;
          setTimeout(() => {
            entry.target.classList.add("in-view");
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  stockCards.forEach((card) => observer.observe(card));

  // Mesmo efeito de "reveal" reaproveitado em outros elementos da página
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Cria o mapa dentro da div #map, centralizado numa posição inicial
const map = L.map("map").setView([-23.57, -46.65], 13);

// Adiciona a camada de "ladrilhos" (as imagens do mapa em si) do OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Lista dos hemocentros que já aparecem nos cards ao lado.
// lat/lng são as coordenadas de latitude e longitude de cada endereço.
const hemocentros = [
  { nome: "Hemocentro Central - São Paulo", lat: -23.5578, lng: -46.6689 },
  { nome: "Banco de Sangue Paulista", lat: -23.6013, lng: -46.6410 },
  { nome: "Posto de Coleta - Clínicas", lat: -23.5567, lng: -46.6708 },
];

// Pra cada hemocentro da lista, cria um marcador no mapa
hemocentros.forEach((h) => {
  L.marker([h.lat, h.lng])
    .addTo(map)
    .bindPopup(h.nome);
 }); // texto que aparece ao clicar no pino
});
