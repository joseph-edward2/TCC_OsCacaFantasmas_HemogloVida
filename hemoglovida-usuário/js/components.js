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
  const isStaff = variant === "staff";

  const brandHref = isApp ? "dashboard.html" : isStaff ? "#" : "index.html";

  const navLinks = isApp
    ? `
        <div class="navbar__links">
          ${buildNavLink("dashboard.html", "Início", "inicio", activeLink)}
          ${buildNavLink("pedidos.html", "Pedidos", "pedidos", activeLink)}
          ${buildNavLink("agendamentos.html", "Agendamentos", "agendamentos", activeLink)}
          ${buildNavLink("caderneta.html", "Caderneta", "caderneta", activeLink)}
        </div>
      `
    : isStaff
    ? `
        <div class="navbar__links navbar__links--compact">
          ${buildNavLink("#", "Visão Geral", "visao-geral", activeLink)}
          ${buildNavLink("#", "Atendimento", "atendimento", activeLink)}
          ${buildNavLink("#", "Estoque", "estoque", activeLink)}
          ${buildNavLink("#", "Agendamentos", "agendamentos-staff", activeLink)}
          ${buildNavLink("#", "Pedidos", "pedidos-staff", activeLink)}
          ${buildNavLink("#", "Alertas", "alertas", activeLink)}
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
      : isStaff
      ? `
        <a href="equipe-conta.html" class="navbar__user" aria-label="Minha Conta">
          <span class="navbar__gear">⚙️</span>
          <span class="navbar__welcome">Bem vindo, Dr. Walter White</span>
          <img class="navbar__avatar" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=60" alt="Foto de perfil de Walter White" />
        </a>
      `
      : "";

  return `
    <nav class="navbar">
      <div class="navbar__container">
        <div class="navbar__left">
          <a href="${brandHref}" class="navbar__brand">
            <span class="navbar__logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 5 10.5 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 10.5 12 2 12 2Z" fill="#a10023"/>
              </svg>
            </span>
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
              <svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
            </a>
            <a href="#" class="footer__social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2c2.7 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43C21.99 8.95 22 9.3 22 12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47C15.05 21.99 14.7 22 12 22s-3.05-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.7 2 12s.01-3.05.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76a4.9 4.9 0 0 1 1.76-1.15c.64-.25 1.37-.42 2.43-.47C8.95 2.01 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"/></svg>
            </a>
            <a href="#" class="footer__social-btn" aria-label="Twitter/X">
              <svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.8L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.2L18.9 2Zm-1.2 18h1.9L7.4 4H5.3l12.4 16Z"/></svg>
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
