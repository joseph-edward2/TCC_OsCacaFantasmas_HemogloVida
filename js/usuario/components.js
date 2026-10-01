
function getNavbarHTML(variant = "public", activeLink = "") {
  const isApp = variant === "app";

  const brandHref = isApp ? "dashboard.html": "index.html";

  const navLinks = isApp
    ? `
        <nav>
          ${buildNavLink("dashboard.html", "Início", "inicio", activeLink)}
          ${buildNavLink("pedidos.html", "Pedidos", "pedidos", activeLink)}
          ${buildNavLink("agendamentos.html", "Agendamentos", "agendamentos", activeLink)}
          ${buildNavLink("caderneta.html", "Caderneta", "caderneta", activeLink)}
        </nav>
      `
    : "";

  const rightContent =
    variant === "public"
      ? `<a href="cadastro.html" class="btn btn-light">Doar Agora</a>`
      : isApp
      ? `
        <a href="conta.html" class="user" aria-label="Minha Conta">
          <span >Bem vindo, Jesse</span>
          <img class="avatar" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop" alt="Foto de perfil" />
        </a>
      `
      : "";

  return `
    <header>
      <div class="header-left">
        <a href="${brandHref}" class="logo">
          <img src="https://i.ibb.co/SwCGm0fj/Hemoglovida-Logo.png" alt="Logo Hemoglovida" class="logo-icon">
          Hemoglovida
        </a>
        ${navLinks}
      </div>
        ${rightContent}
      
    </header>
  `;
}

function buildNavLink(href, label, key, activeLink) {
  const activeClass = key === activeLink ? "active" : "";
  return `<a href="${href}" class="${activeClass}">${label}</a>`;
}

function getFooterHTML() {
  return `
<footer>
  <div class="foot-grid">
    <div>
      <div class="foot-brand">Hemoglovida</div>
      <p>© 2026 Hemoglovida.</p>
    </div>
    <div>
      <h4>INSTITUCIONAL</h4>
      <a href="#">Sobre Nós</a>
      <a href="#">Como Funciona</a>
      <a href="#">Hemocentros</a>
    </div>
    <div>
      <h4>SUPORTE</h4>
      <a href="#">Privacidade</a>
      <a href="#">Contato</a>
      <a href="#">Dúvidas Frequentes</a>
    </div>

    <div class="social-section">
      <h4>SOCIAL</h4> 
      <div class="social-links">
        <a href="#" class="social-btn"><i class="ph ph-globe"></i></a>
        <a href="#" class="social-btn"><i class="ph ph-share-network"></i></a>
        <a href="#" class="social-btn"><i class="ph ph-megaphone"></i></a>
      </div>
    </div>
  </div>
</footer>
  `;
}

function renderNavbar(variant = "public", activeLink = "") {
  const el = document.getElementById("navbar-placeholder");
  if (el) el.innerHTML = getNavbarHTML(variant, activeLink);
}

function renderFooter() {
  const el = document.getElementById("footer-placeholder");
  if (el) el.innerHTML = getFooterHTML();
}

document.addEventListener("DOMContentLoaded", () => {
  const navbarEl = document.getElementById("navbar-placeholder");
  const variant = (navbarEl && navbarEl.dataset.variant) || "public";
  const activeLink = (navbarEl && navbarEl.dataset.active) || "";
  renderNavbar(variant, activeLink);
  renderFooter();
});
