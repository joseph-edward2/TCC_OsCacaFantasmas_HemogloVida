(function () {
  "use strict";

  const TIPOS_SANGUINEOS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  const paginacao = {
    total: 0,
    porPagina: 5,
    paginaAtual: 1,
  };

  let elInfoPagina, elBtnAnterior, elBtnProximo, elTbody;

  document.addEventListener("DOMContentLoaded", () => {
    setupPaginacao();
    setupRegistrarEntrada();
  });

  function setupPaginacao() {
    const footer = document.querySelector(".table-footer");
    if (!footer) return;

    elTbody = document.querySelector(".table tbody");
    elInfoPagina = footer.querySelector("span");
    [elBtnAnterior, elBtnProximo] = footer.querySelectorAll(".pagination .btn");

    elBtnAnterior.addEventListener("click", () => mudarPagina(-1));
    elBtnProximo.addEventListener("click", () => mudarPagina(1));

    atualizarPaginacao();
  }

  function totalPaginas() {
    return Math.max(1, Math.ceil(paginacao.total / paginacao.porPagina));
  }

  function mudarPagina(delta) {
    const nova = paginacao.paginaAtual + delta;
    if (nova < 1 || nova > totalPaginas()) return;
    paginacao.paginaAtual = nova;
    atualizarPaginacao();
  }

  function atualizarPaginacao() {
    if (!elTbody) return;

    const linhas = [...elTbody.querySelectorAll("tr")];
    paginacao.total = linhas.length;

    const totalPag = totalPaginas();
    if (paginacao.paginaAtual > totalPag) paginacao.paginaAtual = totalPag;

    const inicioIndex = (paginacao.paginaAtual - 1) * paginacao.porPagina;
    const fimIndex = Math.min(inicioIndex + paginacao.porPagina, paginacao.total);

    linhas.forEach((tr, i) => {
      tr.hidden = !(i >= inicioIndex && i < fimIndex);
    });

    elInfoPagina.textContent = paginacao.total > 0
      ? `Mostrando ${inicioIndex + 1}-${fimIndex} de ${paginacao.total} bolsas em estoque`
      : `Nenhuma bolsa em estoque`;

    elBtnAnterior.disabled = paginacao.paginaAtual === 1;
    elBtnProximo.disabled = paginacao.paginaAtual === totalPag;
  }

  function setupRegistrarEntrada() {
    const btn = document.querySelector(".page-actions .btn-primary");
    if (!btn) return;

    const modal = criarModalEntrada();
    document.body.appendChild(modal);

    const form = modal.querySelector("#entradaForm");
    const inputColeta = form.querySelector("[name='coleta']");
    const inputValidade = form.querySelector("[name='validade']");

    function abrirModal() {
      form.reset();
      const hoje = new Date();
      const validade = new Date(hoje);
      validade.setDate(validade.getDate() + 35);
      inputColeta.value = paraInputDate(hoje);
      inputValidade.value = paraInputDate(validade);
      modal.hidden = false;
    }

    function fecharModal() {
      modal.hidden = true;
    }

    btn.addEventListener("click", abrirModal);
    modal.querySelector(".modal-close").addEventListener("click", fecharModal);
    modal.querySelector("#entradaCancelar").addEventListener("click", fecharModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) fecharModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) fecharModal();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const dados = new FormData(form);
      const tipo = dados.get("tipo");
      const quantidade = parseInt(dados.get("quantidade"), 10) || 1;
      const coleta = dados.get("coleta");
      const validade = dados.get("validade");

      for (let i = 0; i < quantidade; i++) {
        adicionarBolsaNoInventario({tipo, coleta, validade});
      }

      atualizarStockCard(tipo, quantidade);

      paginacao.paginaAtual = 1;
      atualizarPaginacao();

      fecharModal();
      alert(`${quantidade} bolsa(s) de ${tipo} registrada(s) com sucesso!`);
    });
  }

  function criarModalEntrada() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.hidden = true;

    const opcoesTipo = TIPOS_SANGUINEOS.map((t) => `<option value="${t}">${t}</option>`).join("");

    overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Registrar Entrada</h3>
        <button type="button" class="modal-close" aria-label="Fechar"><i class="ph ph-x"></i></button>
      </div>

      <form class="modal-body" id="entradaForm">
        <label>Nome do Doador
          <input type="text" id="entradaNomeDoador" name="nomeDoador" required>
        </label>

        <label>Caderneta do Doador
          <input type="text" id="entradaCaderneta" name="caderneta" required>
        </label>

        <label>Data de coleta
        <input type="date" id="Coleta" name="coleta" required>
        </label>

        <label>Data de validade
          <input type="date" id="Validade" name="validade" required>
        </label>

        <label>Tipo sanguíneo (ABO/Rh)
          <select id="Tipo" name="tipo" required>
            <option value="">Selecione</option>
            ${opcoesTipo}
          </select>
        </label>

        <label>Número de identificação da doação (ISBT 128)
          <input type="text" id="IdDoacao" name="idDoacao" placeholder="A000 00 000000 00" required>
        </label>

        <label>Quantidade de bolsas
          <input type="number" id="Quantidade" name="quantidade" min="1" value="1" required>
        </label>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="entradaCancelar">Cancelar</button>
          <button type="submit" class="btn btn-primary">Registrar</button>
        </div>
      </form>
    </div>
    `;

    return overlay;
  }

  function adicionarBolsaNoInventario({ tipo, coleta, validade, origem }) {
    const tbody = document.querySelector(".table tbody");
    if (!tbody) return;

    const id = gerarIdBolsa(tipo);
    const classeAlerta = diasParaVencer(validade) <= 7 ? ' class="date-alert"' : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="hospital-name">${id}</td>
      <td><span class="type-pill"><i class="ph ph-drop"></i> ${tipo}</span></td>
      <td>${paraDataBR(coleta)}</td>
      <td${classeAlerta}>${paraDataBR(validade)}</td>
      <td><span class="status-dot"></span>Disponível</td>
    `;
    tbody.insertBefore(tr, tbody.firstChild);
  }

  function gerarIdBolsa(tipo) {
    const numero = Math.floor(10000 + Math.random() * 90000);
    return `#${tipo}-${numero}`;
  }

  function atualizarStockCard(tipo, quantidade) {
    const card = [...document.querySelectorAll(".stock-card")].find(
      (c) => c.querySelector(".blood-type").textContent.trim() === tipo
    );
    if (!card) return;

    const valorEl = card.querySelector(".count-value");
    const meta = parseInt(card.querySelector(".meta-left").textContent.replace(/\D/g, ""), 10);

    const novoValor = parseInt(valorEl.textContent, 10) + quantidade;
    valorEl.textContent = novoValor;

    const percentual = Math.min(Math.round((novoValor / meta) * 100), 100);
    card.querySelector(".progress-fill").style.width = percentual + "%";
    card.querySelector(".meta-right").innerHTML = `${percentual}% do<br>ideal`;
  }

  function paraInputDate(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  function paraDataBR(isoDate) {
    const [ano, mes, dia] = isoDate.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function diasParaVencer(isoDate) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(isoDate + "T00:00:00");
    return Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
  }
})();
