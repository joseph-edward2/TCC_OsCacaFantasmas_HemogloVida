/* ===================================================
   COMPONENTS.JS
   Aqui ficam o Navbar e o Footer, que se repetem em
   TODAS as páginas do projeto (Home, Login, Cadastro,
   Dashboard, etc).

   Como as páginas vão ser abertas direto no navegador
   (sem servidor local), não dá pra usar fetch() pra
   carregar um "navbar.html" separado (isso trava por
   causa do CORS quando o arquivo é aberto com file://).
   Por isso a solução mais simples aqui é: cada
   componente é uma função que devolve uma string de
   HTML, e essa string é injetada com innerHTML dentro
   de uma div "placeholder" que fica no HTML da página.

   Como usar em qualquer página:
     1. Colocar no HTML:
        <div id="navbar-placeholder"></div>
        <div id="footer-placeholder"></div>
     2. Incluir este arquivo com <script src="js/components.js"></script>
     3. Chamar renderNavbar() e renderFooter() (isso já
        acontece automaticamente aqui embaixo, no final
        do arquivo).
=================================================== */

/**
 * Devolve o HTML do navbar.
 * @param {"public"|"auth"|"app"|"staff"} variant
 *   - "public": logo + botão "Doar Agora" (Home e outras páginas de marketing)
 *   - "auth": só a logo, sem botão (Login, Cadastro, Confirmação de código)
 *   - "app": logo + links de navegação + saudação/avatar do doador
 *     (Dashboard, Pedidos, Agendamentos, Caderneta, Minha Conta)
 *   - "staff": logo + links de navegação + saudação/avatar da equipe do
 *     hemocentro (Minha Conta da equipe)
 * @param {string} activeLink - chave do link ativo nas variantes "app"/"staff"
 */
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

/** Monta um link do navbar das variantes "app"/"staff", marcando o ativo. */
function buildNavLink(href, label, key, activeLink) {
  const activeClass = key === activeLink ? "active" : "";
  return `<a href="${href}" class="${activeClass}">${label}</a>`;
}

/** Devolve o HTML do footer (igual em todas as páginas). */
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
        <!-- Ícone de globo -->
        <a href="#" class="social-btn"><i class="ph ph-globe"></i></a>
        <!-- Ícone de compartilhamento -->
        <a href="#" class="social-btn"><i class="ph ph-share-network"></i></a>
        <!-- Ícone de megafone -->
        <a href="#" class="social-btn"><i class="ph ph-megaphone"></i></a>
      </div>
    </div>
  </div>
</footer>
  `;
}

/** Injeta o navbar e o footer nos placeholders da página. */
function renderNavbar(variant = "public", activeLink = "") {
  const el = document.getElementById("navbar-placeholder");
  if (el) el.innerHTML = getNavbarHTML(variant, activeLink);
}

function renderFooter() {
  const el = document.getElementById("footer-placeholder");
  if (el) el.innerHTML = getFooterHTML();
}

// Injeta os componentes assim que o HTML da página estiver pronto.
// A variante do navbar (e o link ativo, na variante "app") são lidos
// dos atributos "data-variant" e "data-active" da própria div
// #navbar-placeholder, assim cada página escolhe os seus sem precisar
// editar este arquivo. Se não informar nada, usa "public" como padrão.
document.addEventListener("DOMContentLoaded", () => {
  const navbarEl = document.getElementById("navbar-placeholder");
  const variant = (navbarEl && navbarEl.dataset.variant) || "public";
  const activeLink = (navbarEl && navbarEl.dataset.active) || "";
  renderNavbar(variant, activeLink);
  renderFooter();
});
