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
        <div class="navbar__links">
          ${buildNavLink("dashboard.html", "Início", "inicio", activeLink)}
          ${buildNavLink("pedidos.html", "Pedidos", "pedidos", activeLink)}
          ${buildNavLink("agendamentos.html", "Agendamentos", "agendamentos", activeLink)}
          ${buildNavLink("caderneta.html", "Caderneta", "caderneta", activeLink)}
        </div>
      `
    : "";

  const rightContent =
    variant === "public"
      ? `<a href="cadastro.html" class="btn btn-light">Doar Agora</a>`
      : isApp
      ? `
        <a href="conta.html" class="navbar__user" aria-label="Minha Conta">
          <span class="navbar__welcome">Bem vindo, Jesse</span>
          <img class="navbar__avatar" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop" alt="Foto de perfil de Jesse" />
        </a>
      `
      : "";

  return `
    <nav class="navbar">
      <div class="navbar__container">
        <div class="navbar__left">
          <a href="${brandHref}" class="navbar__brand">
             <div class="logo">
            <img src="https://i.ibb.co/SwCGm0fj/Hemoglovida-Logo.png" alt="Logo Hemoglovida" class="logo-icon"">
            </div>
            <span class="navbar__title">Hemoglovida</span>
          </a>
          ${navLinks}
        </div>

        ${rightContent}
      </div>
    </nav>
  `;
}

/** Monta um link do navbar das variantes "app"/"staff", marcando o ativo. */
function buildNavLink(href, label, key, activeLink) {
  const activeClass = key === activeLink ? " navbar__link--active" : "";
  return `<a href="${href}" class="navbar__link${activeClass}">${label}</a>`;
}

/** Devolve o HTML do footer (igual em todas as páginas). */
function getFooterHTML() {
  return `
    <footer class="footer">
      <div class="container footer__grid">
        <div>
          <p class="footer__brand-title">Hemoglovida</p>
          <p class="footer__copy">© 2026 Hemoglovida.</p>
        </div>

        <div>
          <p class="footer__heading">Institucional</p>
          <nav class="footer__nav">
            <a href="#">Sobre Nós</a>
            <a href="#">Como Funciona</a>
            <a href="#">Hemocentros</a>
          </nav>
        </div>

        <div>
          <p class="footer__heading">Suporte</p>
          <nav class="footer__nav">
            <a href="#">Privacidade</a>
            <a href="#">Contato</a>
            <a href="#">Dúvidas Frequentes</a>
          </nav>
        </div>

        <div>
          <p class="footer__heading">Social</p>
          <div class="footer__social">
            <a href="#" class="footer__social-btn" aria-label="Facebook">
              <i class="ph-fill ph-facebook-logo"></i>
            </a>
            <a href="#" class="footer__social-btn" aria-label="Instagram">
              <i class="ph-fill ph-instagram-logo"></i>
            </a>
            <a href="#" class="footer__social-btn" aria-label="Twitter/X">
              <i class="ph-fill ph-x-logo"></i>
            </a>
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
