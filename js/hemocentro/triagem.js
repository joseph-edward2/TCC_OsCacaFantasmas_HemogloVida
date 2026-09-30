(function () {
  "use strict";

  const state = {
    searchTerm: "",
    statusFilter: "all", // "all" | "waiting" | "attached"
  };

  // Guarda os arquivos (laudos) anexados pelo usuário nesta sessão,
  // indexados pelo código da bolsa (ex: "#BV-98231-X")
  const attachedFiles = new Map();

  let hiddenFileInput = null;
  let pendingRow = null;

  /* --------------------------------------------------------------------
     Inicialização
     -------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setupSearch();
    setupFilterDropdown();
    setupListDelegation();
    setupGlobalKeyboardShortcuts();
  }

  /* --------------------------------------------------------------------
     Busca por código ou tipo sanguíneo
     -------------------------------------------------------------------- */
  function setupSearch() {
    const input = document.querySelector(".search-box input");
    if (!input) return;

    input.addEventListener("input", () => {
      state.searchTerm = normalize(input.value.trim());
      applyFilters();
    });
  }


  function setupFilterDropdown() {
    const filterBtn = document.querySelector(".btn-filter");
    if (!filterBtn) return;

    // Envolve o botão em um wrapper posicionado, para ancorar o dropdown
    const wrapper = document.createElement("div");
    wrapper.className = "filter-wrapper";
    filterBtn.parentNode.insertBefore(wrapper, filterBtn);
    wrapper.appendChild(filterBtn);

    const dropdown = document.createElement("div");
    dropdown.className = "filter-dropdown";
    dropdown.hidden = true;
    dropdown.innerHTML = `
      <button type="button" class="filter-option is-active" data-value="all">Todos</button>
      <button type="button" class="filter-option" data-value="waiting">Aguardando exame</button>
      <button type="button" class="filter-option" data-value="attached">Exame anexado</button>
    `;
    wrapper.appendChild(dropdown);

    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });

    dropdown.addEventListener("click", (e) => {
      const option = e.target.closest(".filter-option");
      if (!option) return;

      dropdown
        .querySelectorAll(".filter-option")
        .forEach((o) => o.classList.remove("is-active"));
      option.classList.add("is-active");

      state.statusFilter = option.dataset.value;
      applyFilters();
      dropdown.hidden = true;
    });

    document.addEventListener("click", () => {
      dropdown.hidden = true;
    });
  }


  function applyFilters() {
    const rows = document.querySelectorAll(".triage-row");
    let anyVisible = false;

    rows.forEach((row) => {
      const type = normalize(row.querySelector(".triage-type")?.textContent || "");
      const code = normalize(row.querySelector(".triage-code")?.textContent || "");
      const matchesSearch =
        !state.searchTerm || type.includes(state.searchTerm) || code.includes(state.searchTerm);

      const isAttached = row.querySelector(".badge-pill")?.classList.contains("badge-attached");
      const matchesStatus =
        state.statusFilter === "all" ||
        (state.statusFilter === "attached" && isAttached) ||
        (state.statusFilter === "waiting" && !isAttached);

      const visible = matchesSearch && matchesStatus;
      row.style.display = visible ? "" : "none";
      if (visible) anyVisible = true;
    });

    toggleEmptyState(!anyVisible);
  }

  
  function setupListDelegation() {
    const list = document.querySelector(".triage-list");
    if (!list) return;

    list.addEventListener("click", (e) => {
      const docBtn = e.target.closest(".doc-btn");
      if (docBtn) {
        handleDocButtonClick(docBtn);
        return;
      }

      const releaseBtn = e.target.closest(".release-btn");
      if (releaseBtn && !releaseBtn.disabled) {
        handleReleaseClick(releaseBtn);
      }
    });
  }

  function handleDocButtonClick(btn) {
    const row = btn.closest(".triage-row");
    const icon = btn.querySelector("i");
    const isAttachMode = icon && icon.classList.contains("ph-file-arrow-up");

    if (isAttachMode) {
      openFilePicker(row);
    } else {
      openDocumentPreview(row);
    }
  }


  function getHiddenFileInput() {
    if (!hiddenFileInput) {
      hiddenFileInput = document.createElement("input");
      hiddenFileInput.type = "file";
      hiddenFileInput.accept = ".pdf,.png,.jpg,.jpeg";
      hiddenFileInput.style.display = "none";
      hiddenFileInput.addEventListener("change", onFileSelected);
      document.body.appendChild(hiddenFileInput);
    }
    return hiddenFileInput;
  }

  function openFilePicker(row) {
    pendingRow = row;
    const input = getHiddenFileInput();
    input.value = ""; // permite selecionar o mesmo arquivo novamente
    input.click();
  }

  function onFileSelected(e) {
    const file = e.target.files[0];
    if (!file || !pendingRow) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Formato inválido. Envie um arquivo PDF, PNG ou JPG.", "error");
      pendingRow = null;
      return;
    }

    const code = getCode(pendingRow);
    const url = URL.createObjectURL(file);
    attachedFiles.set(code, { file, url });

    markRowAsAttached(pendingRow);
    showToast(`Laudo anexado à bolsa ${code}.`, "success");
    pendingRow = null;
  }

  function markRowAsAttached(row) {
    const badge = row.querySelector(".badge-pill");
    badge.classList.remove("badge-waiting");
    badge.classList.add("badge-attached");
    badge.innerHTML = '<i class="ph ph-check"></i> Exame anexado';

    const docBtn = row.querySelector(".doc-btn");
    docBtn.innerHTML = '<i class="ph ph-eye"></i> Ver Documento';

    const releaseBtn = row.querySelector(".release-btn");
    releaseBtn.disabled = false;
    releaseBtn.classList.remove("is-disabled");
    releaseBtn.classList.add("is-enabled");
  }


  function openDocumentPreview(row) {
    const code = getCode(row);
    const data = attachedFiles.get(code);
    showDocModal(code, data);
  }

  function showDocModal(code, data) {
    document.querySelector(".doc-modal-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "doc-modal-overlay";
    overlay.innerHTML = `
      <div class="doc-modal">
        <div class="doc-modal-header">
          <h3>Laudo — ${escapeHTML(code)}</h3>
          <button type="button" class="doc-modal-close" aria-label="Fechar">
            <i class="ph ph-x"></i>
          </button>
        </div>
        <div class="doc-modal-body">
          ${buildPreviewHTML(data)}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".doc-modal-close").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  function buildPreviewHTML(data) {
    if (!data) {
      return `
        <div class="doc-modal-placeholder">
          <i class="ph ph-file-text"></i>
          <p>Nenhuma pré-visualização disponível para este laudo de exemplo.</p>
        </div>
      `;
    }

    if (data.file.type === "application/pdf") {
      return `<embed src="${data.url}" type="application/pdf" class="doc-modal-embed" />`;
    }

    return `<img src="${data.url}" alt="Laudo anexado" class="doc-modal-img">`;
  }

  function handleReleaseClick(btn) {
    const row = btn.closest(".triage-row");
    const code = getCode(row);
    const type = row.querySelector(".triage-type")?.textContent || "";

    const confirmed = window.confirm(
      `Confirmar liberação da bolsa ${code} (${type}) para o estoque?`
    );
    if (!confirmed) return;

    row.classList.add("is-releasing");
    row.addEventListener(
      "transitionend",
      () => {
        row.remove();
        showToast(`Bolsa ${code} liberada para o estoque com sucesso!`, "success");
        applyFilters();
      },
      { once: true }
    );
  }

  function toggleEmptyState(show) {
    ensureEmptyState().hidden = !show;
  }


  function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "ph-check-circle" : "ph-warning-circle";
    toast.innerHTML = `<i class="ph ${icon}"></i><span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }


  function setupGlobalKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      document.querySelector(".doc-modal-overlay")?.remove();
      const dropdown = document.querySelector(".filter-dropdown");
      if (dropdown) dropdown.hidden = true;
    });
  }

  function getCode(row) {
    return row.querySelector(".triage-code")?.textContent.trim() || "";
  }

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }


  window.addEventListener("beforeunload", () => {
    attachedFiles.forEach(({ url }) => URL.revokeObjectURL(url));
  });
})();
