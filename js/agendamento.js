(function () {
  'use strict';

  /* ----------------------------------------------------------------- */
  /* Atalhos                                                            */
  /* ----------------------------------------------------------------- */
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ----------------------------------------------------------------- */
  /* Constantes                                                         */
  /* ----------------------------------------------------------------- */
  const STORAGE_KEY = 'hemoglovida_agenda_v1';

  const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const WEEKDAY_NAMES = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado',
  ];

  // A tabela de padrão semanal exibe as linhas nesta ordem (Segunda ... Domingo),
  // mas internamente indexamos os dias por getDay() do JS (0 = Domingo ... 6 = Sábado).
  const TABLE_ROW_TO_WEEKDAY = [1, 2, 3, 4, 5, 6, 0];

  /* ----------------------------------------------------------------- */
  /* Estado                                                             */
  /* ----------------------------------------------------------------- */

  function defaultWeeklyPattern() {
    return [
      { open: false, start: '12:00 AM', end: '12:00 AM', capacity: 0 },   // Domingo
      { open: true, start: '08:00 AM', end: '06:00 PM', capacity: 120 }, // Segunda
      { open: true, start: '08:00 AM', end: '06:00 PM', capacity: 120 }, // Terça
      { open: true, start: '08:00 AM', end: '06:00 PM', capacity: 120 }, // Quarta
      { open: true, start: '08:00 AM', end: '06:00 PM', capacity: 120 }, // Quinta
      { open: true, start: '08:00 AM', end: '06:00 PM', capacity: 120 }, // Sexta
      { open: true, start: '08:00 AM', end: '12:00 PM', capacity: 60 },  // Sábado
    ];
  }

  function defaultState() {
    return {
      weeklyPattern: defaultWeeklyPattern(),
      overrides: {
        // Exceção inicial, equivalente ao exemplo estático do protótipo.
        '2026-03-06': {
          open: true,
          horarios: [
            { id: 'h1', start: '08:00', end: '09:00', vagas: 5, active: true },
            { id: 'h2', start: '09:00', end: '10:00', vagas: 10, active: true },
            { id: 'h3', start: '10:00', end: '11:00', vagas: 8, active: true },
          ],
        },
      },
      blocked: [], // datas 'YYYY-MM-DD' bloqueadas manualmente
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.weeklyPattern && parsed.overrides) return parsed;
      }
    } catch (err) {
      console.warn('Não foi possível carregar a agenda salva:', err);
    }
    return defaultState();
  }

  let state = loadState();
  let view = { year: 2026, month: 2 }; // Março 2026 (mês 0-indexado)
  let selectedDate = '2026-03-06';
  let horarioSeq = 0;

  function saveState(notify) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (notify) toast('Alterações salvas com sucesso!');
    } catch (err) {
      toast('Não foi possível salvar as alterações.', true);
    }
  }

  /* ----------------------------------------------------------------- */
  /* Utilitários de data e horário                                      */
  /* ----------------------------------------------------------------- */

  function pad2(n) { return String(n).padStart(2, '0'); }

  function dateKey(year, monthIndex, day) {
    return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
  }

  function weekdayOf(year, monthIndex, day) {
    return new Date(year, monthIndex, day).getDay();
  }

  // Converte "08:00 AM" / "06:00 PM" em { h, min } no formato 24h.
  function parseTime12h(str) {
    const m = /^\s*(\d{1,2}):(\d{2})\s*([AP]M)\s*$/i.exec(str || '');
    if (!m) return null;
    let h = parseInt(m[1], 10) % 12;
    const min = parseInt(m[2], 10);
    if (/pm/i.test(m[3])) h += 12;
    return { h, min };
  }

  function minutesToHHMM(mins) {
    return `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`;
  }

  // Gera as faixas horárias de 1h (com vagas distribuídas igualmente)
  // a partir de um item do padrão semanal.
  function generateHorariosFromPattern(pattern) {
    if (!pattern || !pattern.open) return [];
    const startT = parseTime12h(pattern.start);
    const endT = parseTime12h(pattern.end);
    if (!startT || !endT) return [];

    const startMinutes = startT.h * 60 + startT.min;
    const endMinutes = endT.h * 60 + endT.min;
    if (endMinutes <= startMinutes) return [];

    const slotCount = Math.max(1, Math.round((endMinutes - startMinutes) / 60));
    const base = Math.floor(pattern.capacity / slotCount);
    let remainder = pattern.capacity - base * slotCount;

    const slots = [];
    let cursor = startMinutes;
    let i = 0;
    while (cursor < endMinutes) {
      const next = Math.min(cursor + 60, endMinutes);
      let vagas = base;
      if (remainder > 0) { vagas += 1; remainder -= 1; }
      slots.push({
        id: `auto-${i}`,
        start: minutesToHHMM(cursor),
        end: minutesToHHMM(next),
        vagas,
        active: true,
      });
      cursor = next;
      i += 1;
    }
    return slots;
  }

  /* ----------------------------------------------------------------- */
  /* Regras de negócio — configuração efetiva de um dia                 */
  /* ----------------------------------------------------------------- */

  // Prioridade: bloqueio manual > exceção específica do dia > padrão semanal.
  function getDayConfig(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const weekday = weekdayOf(y, m - 1, d);
    const blocked = state.blocked.includes(dateStr);
    const override = state.overrides[dateStr];

    if (blocked) {
      return { open: false, horarios: [], blocked: true, weekday };
    }
    if (override) {
      return { open: override.open, horarios: override.horarios, blocked: false, weekday };
    }
    const pattern = state.weeklyPattern[weekday];
    return {
      open: pattern.open,
      horarios: generateHorariosFromPattern(pattern),
      blocked: false,
      weekday,
    };
  }

  // Garante uma configuração editável (override) para o dia,
  // materializando-a a partir do padrão semanal quando ainda não existir.
  function ensureOverride(dateStr) {
    if (!state.overrides[dateStr]) {
      const cfg = getDayConfig(dateStr);
      state.overrides[dateStr] = {
        open: cfg.open,
        horarios: cfg.horarios.map((h) => ({ ...h })),
      };
    }
    return state.overrides[dateStr];
  }

  /* ----------------------------------------------------------------- */
  /* Calendário                                                         */
  /* ----------------------------------------------------------------- */

  function renderCalendar() {
    const grid = qs('.calendar-grid');
    const label = qs('.calendar-header h2');
    if (!grid) return;

    const { year, month } = view;
    if (label) label.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstOfMonth = new Date(year, month, 1);
    const firstWeekday = firstOfMonth.getDay();
    const start = new Date(year, month, 1 - firstWeekday);

    grid.innerHTML = '';

    // Sempre 42 células (6 semanas) para manter a altura do calendário estável.
    for (let i = 0; i < 42; i += 1) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const outside = date.getMonth() !== month;
      const cellDateStr = dateKey(date.getFullYear(), date.getMonth(), date.getDate());

      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = pad2(date.getDate());
      cell.dataset.date = cellDateStr;

      if (outside) {
        cell.classList.add('is-outside');
      } else {
        const cfg = getDayConfig(cellDateStr);
        if (cellDateStr === selectedDate) cell.classList.add('is-selected');
        if (cfg.blocked || !cfg.open) cell.classList.add('is-indisponivel');
        if (cfg.open && !cfg.blocked) {
          const dot = document.createElement('span');
          dot.className = 'dot';
          cell.appendChild(dot);
        }
      }

      cell.addEventListener('click', () => {
        if (outside) goToMonth(date < firstOfMonth ? -1 : 1);
        selectDate(cellDateStr);
      });

      grid.appendChild(cell);
    }
  }

  function goToMonth(delta) {
    let { year, month } = view;
    month += delta;
    if (month < 0) { month = 11; year -= 1; }
    if (month > 11) { month = 0; year += 1; }
    view = { year, month };
    renderCalendar();
  }

  function bindCalendarNav() {
    const buttons = qsa('.calendar-nav button');
    if (buttons[0]) buttons[0].addEventListener('click', () => goToMonth(-1));
    if (buttons[1]) buttons[1].addEventListener('click', () => goToMonth(1));
  }

  /* ----------------------------------------------------------------- */
  /* Painel "Configurar dia selecionado"                                */
  /* ----------------------------------------------------------------- */

  function selectDate(dateStr) {
    selectedDate = dateStr;
    renderCalendar();
    renderDayConfig();
  }

  function renderDayConfig() {
    const cfg = getDayConfig(selectedDate);
    const [y, m, d] = selectedDate.split('-').map(Number);

    const title = qs('.day-config-head h2');
    const subtitle = qs('.day-config-head p');
    if (title) title.textContent = `Configurar ${pad2(d)} de ${MONTH_NAMES[m - 1]}`;
    if (subtitle) subtitle.textContent = WEEKDAY_NAMES[cfg.weekday];

    const openInput = qs('.toggle-box .switch input');
    if (openInput) {
      openInput.checked = cfg.open && !cfg.blocked;
      openInput.disabled = cfg.blocked; // dia bloqueado só se libera pelo botão "Liberar dia"
    }

    renderHorarioList(cfg);
    updateTotal(cfg);
  }

  function setHorarioSectionEnabled(enabled) {
    qsa('.horario-vagas').forEach((i) => { i.disabled = !enabled; });
    qsa('.horario-row .switch input').forEach((i) => { i.disabled = !enabled; });
    qsa('.horario-remove').forEach((b) => { b.disabled = !enabled; });
    const addBtn = qs('.btn-dashed');
    if (addBtn) addBtn.disabled = !enabled;
  }

  function renderHorarioList(cfg) {
    const list = qs('.horario-list');
    if (!list) return;
    list.innerHTML = '';

    if (cfg.blocked) {
      list.innerHTML = '<p class="horario-empty">Este dia está bloqueado para agendamentos.</p>';
      setHorarioSectionEnabled(false);
      return;
    }
    if (!cfg.open) {
      list.innerHTML = '<p class="horario-empty">Hemocentro fechado neste dia. Ative a opção acima para configurar horários.</p>';
      setHorarioSectionEnabled(false);
      return;
    }
    if (!cfg.horarios.length) {
      list.innerHTML = '<p class="horario-empty">Nenhum horário cadastrado. Adicione um horário abaixo.</p>';
    }

    cfg.horarios.forEach((h) => {
      const row = document.createElement('div');
      row.className = 'horario-row';
      row.dataset.id = h.id;
      row.innerHTML = `
        <div class="horario-time">${h.start} - ${h.end}<small>Intervalo de 1 hora</small></div>
        <input class="horario-vagas" type="text" inputmode="numeric" value="${h.vagas}">
        <label class="switch">
          <input type="checkbox" ${h.active ? 'checked' : ''}>
          <span class="track"></span>
        </label>
        <button type="button" class="horario-remove" title="Remover horário" aria-label="Remover horário">
          <i class="ph ph-x"></i>
        </button>
      `;
      list.appendChild(row);
    });

    setHorarioSectionEnabled(true);
  }

  function updateTotal(cfg) {
    const totalEl = qs('.day-config-subhead .total');
    if (!totalEl) return;
    const effectiveCfg = cfg || getDayConfig(selectedDate);
    const total = (effectiveCfg.open && !effectiveCfg.blocked)
      ? effectiveCfg.horarios
        .filter((h) => h.active)
        .reduce((sum, h) => sum + (Number(h.vagas) || 0), 0)
      : 0;
    totalEl.innerHTML = `Total: ${total}<br>vagas`;
  }

  function bindOpenToggle() {
    const input = qs('.toggle-box .switch input');
    if (!input) return;
    input.addEventListener('change', () => {
      const override = ensureOverride(selectedDate);
      override.open = input.checked;
      if (override.open && override.horarios.length === 0) {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const weekday = weekdayOf(y, m - 1, d);
        override.horarios = generateHorariosFromPattern(state.weeklyPattern[weekday]);
      }
      renderCalendar();
      renderDayConfig();
    });
  }

  function bindHorarioListEvents() {
    const list = qs('.horario-list');
    if (!list) return;

    // Permite apenas dígitos no campo de vagas enquanto o usuário digita.
    list.addEventListener('input', (e) => {
      if (!e.target.classList.contains('horario-vagas')) return;
      e.target.value = e.target.value.replace(/[^\d]/g, '');
    });

    // Confirma o valor de vagas ou o estado do toggle ao perder o foco / alternar.
    list.addEventListener('change', (e) => {
      const row = e.target.closest('.horario-row');
      if (!row) return;
      const override = ensureOverride(selectedDate);
      const horario = override.horarios.find((h) => h.id === row.dataset.id);
      if (!horario) return;

      if (e.target.classList.contains('horario-vagas')) {
        const val = parseInt(e.target.value, 10);
        horario.vagas = Number.isNaN(val) ? 0 : val;
        e.target.value = horario.vagas;
      } else if (e.target.type === 'checkbox') {
        horario.active = e.target.checked;
      }
      updateTotal();
    });

    // Remove uma faixa de horário (botão "x" adicionado a cada linha).
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.horario-remove');
      if (!btn) return;
      const row = btn.closest('.horario-row');
      const override = ensureOverride(selectedDate);
      override.horarios = override.horarios.filter((h) => h.id !== row.dataset.id);
      renderHorarioList(getDayConfig(selectedDate));
      updateTotal();
    });
  }

  function bindAddHorarioButton() {
    const btn = qs('.btn-dashed');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const override = ensureOverride(selectedDate);
      if (!override.open) {
        toast('Ative o hemocentro neste dia antes de adicionar horários.', true);
        return;
      }
      let lastEnd = '08:00';
      if (override.horarios.length) {
        lastEnd = override.horarios[override.horarios.length - 1].end;
      }
      const [h, m] = lastEnd.split(':').map(Number);
      const nextH = Math.min(h + 1, 23);
      override.horarios.push({
        id: `h${(horarioSeq += 1)}-${Date.now()}`,
        start: lastEnd,
        end: `${pad2(nextH)}:${pad2(m)}`,
        vagas: 0,
        active: true,
      });
      renderHorarioList(getDayConfig(selectedDate));
      updateTotal();
    });
  }

  /* ----------------------------------------------------------------- */
  /* Barra de ferramentas do calendário                                 */
  /* ----------------------------------------------------------------- */

  function bindToolbar() {
    const [blockBtn, unblockBtn, applyBtn] = qsa('.toolbar button');

    if (blockBtn) blockBtn.addEventListener('click', () => {
      if (!state.blocked.includes(selectedDate)) state.blocked.push(selectedDate);
      renderCalendar();
      renderDayConfig();
      toast('Dia bloqueado para agendamentos.');
    });

    if (unblockBtn) unblockBtn.addEventListener('click', () => {
      state.blocked = state.blocked.filter((dt) => dt !== selectedDate);
      renderCalendar();
      renderDayConfig();
      toast('Dia liberado para agendamentos.');
    });

    if (applyBtn) applyBtn.addEventListener('click', () => {
      const ok = window.confirm(
        'Isso remove as exceções manuais do mês exibido e reaplica o padrão semanal. Deseja continuar?'
      );
      if (!ok) return;
      const { year, month } = view;
      Object.keys(state.overrides).forEach((dateStr) => {
        const [y, m] = dateStr.split('-').map(Number);
        if (y === year && (m - 1) === month) delete state.overrides[dateStr];
      });
      state.blocked = state.blocked.filter((dateStr) => {
        const [y, m] = dateStr.split('-').map(Number);
        return !(y === year && (m - 1) === month);
      });
      renderCalendar();
      renderDayConfig();
      toast('Padrão semanal aplicado ao mês exibido.');
    });
  }

  /* ----------------------------------------------------------------- */
  /* Tabela "Configuração Padrão Semanal"                               */
  /* ----------------------------------------------------------------- */

  function renderWeeklyTable() {
    const rows = qsa('.weekly-table tbody tr');
    rows.forEach((row, idx) => {
      const weekday = TABLE_ROW_TO_WEEKDAY[idx];
      const pattern = state.weeklyPattern[weekday];
      const statusSpan = row.querySelector('.status-check');
      const [startInput, endInput, capInput] = row.querySelectorAll('input');

      row.classList.toggle('is-disabled', !pattern.open);
      if (statusSpan) {
        statusSpan.className = pattern.open ? 'status-check is-open' : 'status-check is-closed';
        statusSpan.innerHTML = pattern.open
          ? '<span class="check-box is-checked"><i class="ph-bold ph-check"></i></span> Aberto'
          : '<span class="check-box"></span> Fechado';
      }
      if (startInput) { startInput.value = pattern.start; startInput.disabled = !pattern.open; }
      if (endInput) { endInput.value = pattern.end; endInput.disabled = !pattern.open; }
      if (capInput) { capInput.value = pattern.capacity; capInput.disabled = !pattern.open; }
    });
  }

  function bindWeeklyTable() {
    const rows = qsa('.weekly-table tbody tr');
    rows.forEach((row, idx) => {
      const weekday = TABLE_ROW_TO_WEEKDAY[idx];
      const statusSpan = row.querySelector('.status-check');
      const [startInput, endInput, capInput] = row.querySelectorAll('input');

      if (statusSpan) {
        statusSpan.style.cursor = 'pointer';
        statusSpan.addEventListener('click', () => {
          const pattern = state.weeklyPattern[weekday];
          pattern.open = !pattern.open;
          renderWeeklyTable();
          renderCalendar();
          renderDayConfig();
        });
      }

      if (startInput) startInput.addEventListener('change', () => {
        const pattern = state.weeklyPattern[weekday];
        const val = startInput.value.trim();
        if (!parseTime12h(val)) {
          toast('Formato de horário inválido. Use HH:MM AM/PM.', true);
          startInput.value = pattern.start;
          return;
        }
        pattern.start = val;
        renderCalendar();
        renderDayConfig();
      });

      if (endInput) endInput.addEventListener('change', () => {
        const pattern = state.weeklyPattern[weekday];
        const val = endInput.value.trim();
        if (!parseTime12h(val)) {
          toast('Formato de horário inválido. Use HH:MM AM/PM.', true);
          endInput.value = pattern.end;
          return;
        }
        pattern.end = val;
        renderCalendar();
        renderDayConfig();
      });

      if (capInput) {
        capInput.addEventListener('input', () => {
          capInput.value = capInput.value.replace(/[^\d]/g, '');
        });
        capInput.addEventListener('change', () => {
          const pattern = state.weeklyPattern[weekday];
          const val = parseInt(capInput.value, 10);
          pattern.capacity = Number.isNaN(val) ? 0 : val;
          capInput.value = pattern.capacity;
          renderCalendar();
          renderDayConfig();
        });
      }
    });
  }

  function bindWeeklyResetButton() {
    const btn = qs('.panel-actions .icon-btn');
    if (!btn) return;
    btn.title = 'Restaurar padrão original';
    btn.addEventListener('click', () => {
      const ok = window.confirm(
        'Restaurar a configuração padrão semanal original (Seg-Sex 08:00-18:00 · 120 vagas, '
        + 'Sáb 08:00-12:00 · 60 vagas, Dom fechado)?'
      );
      if (!ok) return;
      state.weeklyPattern = defaultWeeklyPattern();
      renderWeeklyTable();
      renderCalendar();
      renderDayConfig();
      toast('Configuração padrão semanal restaurada.');
    });
  }

  /* ----------------------------------------------------------------- */
  /* Salvar alterações                                                  */
  /* ----------------------------------------------------------------- */

  function bindSaveButton() {
    const btn = qs('.page-actions .btn-primary');
    if (!btn) return;
    btn.addEventListener('click', () => saveState(true));
  }

  /* ----------------------------------------------------------------- */
  /* Notificações (toast) + pequenos estilos que a página ainda não tem */
  /* ----------------------------------------------------------------- */

  let toastTimer = null;

  function injectRuntimeStyles() {
    if (document.getElementById('agendamento-runtime-styles')) return;
    const style = document.createElement('style');
    style.id = 'agendamento-runtime-styles';
    style.textContent = `
      .agendamento-toast {
        position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%) translateY(16px);
        background: #7a0026; color: #fff; padding: 12px 22px; border-radius: 8px;
        font-size: 14px; font-family: inherit; box-shadow: 0 10px 28px rgba(0,0,0,.25);
        opacity: 0; pointer-events: none; transition: opacity .25s ease, transform .25s ease;
        z-index: 9999;
      }
      .agendamento-toast.is-visible { opacity: 1; transform: translateX(-50%) translateY(0); }
      .agendamento-toast.is-error { background: #b3261e; }
      .horario-empty { color: #8a8a8a; font-size: 14px; padding: 8px 0 4px; }
      .horario-remove {
        border: none; background: transparent; color: #b3261e; cursor: pointer;
        font-size: 15px; line-height: 1; padding: 4px 6px; border-radius: 6px;
      }
      .horario-remove:hover:not(:disabled) { background: rgba(179, 38, 30, .08); }
      .horario-remove:disabled { color: #ccc; cursor: not-allowed; }
      .status-check { cursor: pointer; user-select: none; }
    `;
    document.head.appendChild(style);
  }

  function toast(message, isError) {
    let el = qs('.agendamento-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'agendamento-toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.toggle('is-error', !!isError);
    requestAnimationFrame(() => el.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  }

  /* ----------------------------------------------------------------- */
  /* Inicialização                                                      */
  /* ----------------------------------------------------------------- */

  function init() {
    injectRuntimeStyles();

    renderCalendar();
    renderDayConfig();
    renderWeeklyTable();

    bindCalendarNav();
    bindOpenToggle();
    bindHorarioListEvents();
    bindAddHorarioButton();
    bindToolbar();
    bindWeeklyTable();
    bindWeeklyResetButton();
    bindSaveButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
