document.addEventListener("DOMContentLoaded", () => {

  const stockCards = document.querySelectorAll(".stock-card");

  stockCards.forEach((card) => {
    const percent = card.dataset.percent || 0;
    const fill = card.querySelector(".stock-card__icon-fill");
    if (fill) fill.style.height = `${percent}%`;
    if (`${percent}%` > "65" ){
      fill.style.borderRadius = "20px 20px 40px 40px"
    };
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
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

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const map = L.map("map").setView([-23.57, -46.65], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const hemocentros = [
  { nome: "Hemocentro Central - São Paulo", lat:  -23.55801, lng: -46.66867 },
  { nome: "Banco de Sangue Paulista", lat: -23.6495, lng: -46.7039 },
  { nome: "Hemocentro São Lucas - Guarulhos ", lat: -23.4684, lng: -46.5244 },
];

hemocentros.forEach((h) => {
  const icon = L.divIcon({
    className: "leaflet-div-icon",
    html: `
      <div class="pin">
        <span class="pin-inner"><i class="ph-fill ph-drop"></i></span>
        <span class="pin-label">${h.nome}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  L.marker([h.lat, h.lng], { icon })
    .addTo(map)
    .bindPopup(h.nome);
});
});
