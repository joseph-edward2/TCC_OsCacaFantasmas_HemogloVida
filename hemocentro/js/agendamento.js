(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const DIAS  = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const LINHA_DIA = [1, 2, 3, 4, 5, 6, 0]; // Ordem das linhas da tabela semanal -> getDay()

  // ---- estado ---------------------------------------------------------
  const state = {
    pattern: [ // 0=Domingo ... 6=Sábado
      { open: false, start: '12:00 AM', end: '12:00 AM', cap: 0 },
      { open: true,  start: '08:00 AM', end: '06:00 PM', cap: 120 },
      { open: true,  start: '08:00 AM', end: '06:00 PM', cap: 120 },
      { open: true,  start: '08:00 AM', end: '06:00 PM', cap: 120 },
      { open: true,  start: '08:00 AM', end: '06:00 PM', cap: 120 },
      { open: true,  start: '08:00 AM', end: '06:00 PM', cap: 120 },
      { open: true,  start: '08:00 AM', end: '12:00 PM', cap: 60 },
    ],
    overrides: {
      '2026-09-12': { open: true, horarios: [
        { start: '08:00', end: '09:00', vagas: 5,  active: true },
        { start: '09:00', end: '10:00', vagas: 10, active: true },
        { start: '10:00', end: '11:00', vagas: 8,  active: true },
      ] },
    },
    blocked: [],
  };

  let view = { ano: 2026, mes: 9 }; 
  let selecionado = '2026-09-12';

  // ---- utilitários ------------------------------------------------------
  const pad = (n) => String(n).padStart(2, '0');
  const chave = (a, m, d) => `${a}-${pad(m + 1)}-${pad(d)}`;
  const diaSemana = (a, m, d) => new Date(a, m, d).getDay();

  function paraMinutos(str) {
    const m = /^(\d{1,2}):(\d{2})\s*([AP]M)$/i.exec((str || '').trim());
    if (!m) return null;
    let h = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return h * 60 + parseInt(m[2], 10);
  }
  const paraHora = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

  // gera horários de 1h com vagas distribuídas a partir do padrão semanal
  function gerarHorarios(p) {
    if (!p.open) return [];
    const ini = paraMinutos(p.start);
    const fim = paraMinutos(p.end);
    if (ini === null || fim === null || fim <= ini) return [];
    const slots = Math.max(1, Math.round((fim - ini) / 60));
    const base = Math.floor(p.cap / slots);
    let resto = p.cap - base * slots;
    const lista = [];
    for (let t = ini; t < fim; t += 60) {
      let vagas = base;
      if (resto > 0) { vagas += 1; resto -= 1; }
      lista.push({ start: paraHora(t), end: paraHora(Math.min(t + 60, fim)), vagas, active: true });
    }
    return lista;
  }

  // configuração efetiva: bloqueio manual > exceção do dia > padrão semanal
  function configDoDia(data) {
    const [a, m, d] = data.split('-').map(Number);
    const dw = diaSemana(a, m - 1, d);
    if (state.blocked.includes(data)) return { open: false, horarios: [], bloqueado: true, dw };
    const ov = state.overrides[data];
    if (ov) return { open: ov.open, horarios: ov.horarios, bloqueado: false, dw };
    const p = state.pattern[dw];
    return { open: p.open, horarios: gerarHorarios(p), bloqueado: false, dw };
  }

  // cria (se ainda não existir) uma exceção editável para o dia
  function overrideDoDia(data) {
    if (!state.overrides[data]) {
      const c = configDoDia(data);
      state.overrides[data] = { open: c.open, horarios: c.horarios.map((h) => ({ ...h })) };
    }
    return state.overrides[data];
  }

  // ---- calendário ---------------------------------------------------------
  function desenharCalendario() {
    const grid = $('.calendar-grid');
    $('.calendar-header h2').textContent = `${MESES[view.mes]} ${view.ano}`;
    const inicio = new Date(view.ano, view.mes, 1 - new Date(view.ano, view.mes, 1).getDay());
    grid.innerHTML = '';
    for (let i = 0; i < 42; i += 1) {
      const d = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
      const data = chave(d.getFullYear(), d.getMonth(), d.getDate());
      const cel = document.createElement('div');
      cel.className = 'calendar-day';
      cel.textContent = pad(d.getDate());

      if (d.getMonth() !== view.mes) {
        cel.classList.add('is-outside');
      } else {
        const c = configDoDia(data);
        if (data === selecionado) cel.classList.add('is-selected');
        if (c.bloqueado || !c.open) {
          cel.classList.add('is-indisponivel');
        } else {
          const dot = document.createElement('span');
          dot.className = 'dot';
          cel.appendChild(dot);
        }
        cel.addEventListener('click', () => selecionar(data));
      }
      grid.appendChild(cel);
    }
  }

  function mudarMes(delta) {
    let { ano, mes } = view;
    mes += delta;
    if (mes < 0) { mes = 11; ano -= 1; }
    if (mes > 11) { mes = 0; ano += 1; }
    view = { ano, mes };
    desenharCalendario();
  }

  // ---- painel do dia selecionado -------------------------------------------
  function selecionar(data) {
    selecionado = data;
    desenharCalendario();
    desenharPainel();
  }

  function desenharPainel() {
    const c = configDoDia(selecionado);
    const [, m, d] = selecionado.split('-').map(Number);

    $('.day-config-head h2').textContent = `Configurar ${pad(d)} de ${MESES[m - 1]}`;
    $('.day-config-head p').textContent = DIAS[c.dw];

    const chk = $('.toggle-box .switch input');
    chk.checked = c.open && !c.bloqueado;
    chk.disabled = c.bloqueado;

    desenharHorarios(c);
    atualizarTotal(c);
  }

  function habilitarHorarios(v) {
    $$('.horario-vagas').forEach((i) => { i.disabled = !v; });
    $$('.horario-row .switch input').forEach((i) => { i.disabled = !v; });
    $$('.horario-remove').forEach((b) => { b.disabled = !v; });
    $('.btn-dashed').disabled = !v;
  }

  function desenharHorarios(c) {
    const lista = $('.horario-list');
    lista.innerHTML = '';
    if (c.bloqueado || !c.open) {
      const msg = c.bloqueado ? 'Este dia está bloqueado para agendamentos.' : 'Hemocentro fechado neste dia.';
      lista.innerHTML = `<p style="color:var(--ink-soft);font-size:13px;">${msg}</p>`;
      habilitarHorarios(false);
      return;
    }
    c.horarios.forEach((h, i) => {
      const row = document.createElement('div');
      row.className = 'horario-row';
      row.dataset.i = i;
      row.innerHTML = `
        <div class="horario-time">${h.start} - ${h.end}<small>Intervalo de 1 hora</small></div>
        <input class="horario-vagas" type="text" value="${h.vagas}">
        <label class="switch"><input type="checkbox" ${h.active ? 'checked' : ''}><span class="track"></span></label>
        <button type="button" class="horario-remove" title="Remover" style="border:none;background:none;color:var(--brand);cursor:pointer;font-size:14px;">✕</button>
      `;
      lista.appendChild(row);
    });
    habilitarHorarios(true);
  }

  function atualizarTotal(c) {
    c = c || configDoDia(selecionado);
    const total = (c.open && !c.bloqueado)
      ? c.horarios.filter((h) => h.active).reduce((s, h) => s + (Number(h.vagas) || 0), 0)
      : 0;
    $('.day-config-subhead .total').innerHTML = `Total: ${total}<br>vagas`;
  }

  // toggle "Hemocentro aberto neste dia"
  $('.toggle-box .switch input').addEventListener('change', (e) => {
    const ov = overrideDoDia(selecionado);
    ov.open = e.target.checked;
    if (ov.open && !ov.horarios.length) {
      const [a, m, d] = selecionado.split('-').map(Number);
      ov.horarios = gerarHorarios(state.pattern[diaSemana(a, m - 1, d)]);
    }
    desenharCalendario();
    desenharPainel();
  });

  // vagas / ativo / remover em cada horário (delegação de eventos)
  $('.horario-list').addEventListener('input', (e) => {
    if (e.target.classList.contains('horario-vagas')) {
      e.target.value = e.target.value.replace(/\D/g, '');
    }
  });
  $('.horario-list').addEventListener('change', (e) => {
    const row = e.target.closest('.horario-row');
    if (!row) return;
    const h = overrideDoDia(selecionado).horarios[row.dataset.i];
    if (!h) return;
    if (e.target.classList.contains('horario-vagas')) {
      h.vagas = parseInt(e.target.value, 10) || 0;
      e.target.value = h.vagas;
    } else {
      h.active = e.target.checked;
    }
    atualizarTotal();
  });
  $('.horario-list').addEventListener('click', (e) => {
    if (!e.target.closest('.horario-remove')) return;
    const row = e.target.closest('.horario-row');
    overrideDoDia(selecionado).horarios.splice(row.dataset.i, 1);
    desenharHorarios(configDoDia(selecionado));
    atualizarTotal();
  });

  // adicionar novo horário
  $('.btn-dashed').addEventListener('click', () => {
    const ov = overrideDoDia(selecionado);
    if (!ov.open) return;
    const ultimo = ov.horarios[ov.horarios.length - 1];
    const inicio = ultimo ? ultimo.end : '08:00';
    const [h, m] = inicio.split(':').map(Number);
    ov.horarios.push({ start: inicio, end: `${pad(Math.min(h + 1, 23))}:${pad(m)}`, vagas: 0, active: true });
    desenharHorarios(configDoDia(selecionado));
    atualizarTotal();
  });

  // ---- barra de ferramentas: bloquear / liberar / aplicar padrão ------------
  const [btnBloquear, btnLiberar, btnAplicar] = $$('.toolbar button');
  btnBloquear.addEventListener('click', () => {
    if (!state.blocked.includes(selecionado)) state.blocked.push(selecionado);
    desenharCalendario();
    desenharPainel();
  });
  btnLiberar.addEventListener('click', () => {
    state.blocked = state.blocked.filter((d) => d !== selecionado);
    desenharCalendario();
    desenharPainel();
  });
  btnAplicar.addEventListener('click', () => {
    if (!confirm('Remover as exceções manuais do mês exibido e aplicar o padrão semanal?')) return;
    Object.keys(state.overrides).forEach((d) => {
      const [a, m] = d.split('-').map(Number);
      if (a === view.ano && m - 1 === view.mes) delete state.overrides[d];
    });
    state.blocked = state.blocked.filter((d) => {
      const [a, m] = d.split('-').map(Number);
      return !(a === view.ano && m - 1 === view.mes);
    });
    desenharCalendario();
    desenharPainel();
  });

  const [btnAnterior, btnProximo] = $$('.calendar-nav button');
  btnAnterior.addEventListener('click', () => mudarMes(-1));
  btnProximo.addEventListener('click', () => mudarMes(1));

  // ---- tabela "Configuração Padrão Semanal" -----------------------------
  function desenharTabelaSemanal() {
    $$('.weekly-table tbody tr').forEach((row, i) => {
      const p = state.pattern[LINHA_DIA[i]];
      const status = row.querySelector('.status-check');
      const [ini, fim, cap] = row.querySelectorAll('input');
      row.classList.toggle('is-disabled', !p.open);
      status.className = p.open ? 'status-check is-open' : 'status-check is-closed';
      status.innerHTML = p.open
        ? '<span class="check-box is-checked"><i class="ph-bold ph-check"></i></span> Aberto'
        : '<span class="check-box"></span> Fechado';
      ini.value = p.start; ini.disabled = !p.open;
      fim.value = p.end;   fim.disabled = !p.open;
      cap.value = p.cap;   cap.disabled = !p.open;
    });
  }

  $$('.weekly-table tbody tr').forEach((row, i) => {
    const dw = LINHA_DIA[i];
    const status = row.querySelector('.status-check');
    const [ini, fim, cap] = row.querySelectorAll('input');

    status.style.cursor = 'pointer';
    status.addEventListener('click', () => {
      state.pattern[dw].open = !state.pattern[dw].open;
      desenharTabelaSemanal();
      desenharCalendario();
      desenharPainel();
    });
    ini.addEventListener('change', () => {
      state.pattern[dw].start = ini.value.trim();
      desenharCalendario();
      desenharPainel();
    });
    fim.addEventListener('change', () => {
      state.pattern[dw].end = fim.value.trim();
      desenharCalendario();
      desenharPainel();
    });
    cap.addEventListener('input', () => { cap.value = cap.value.replace(/\D/g, ''); });
    cap.addEventListener('change', () => {
      state.pattern[dw].cap = parseInt(cap.value, 10) || 0;
      desenharCalendario();
      desenharPainel();
    });
  });

  // ---- salvar --------------------------------------------------------------
  $('.page-actions .btn-primary').addEventListener('click', () => alert('Alterações salvas com sucesso!'));

  // ---- primeira renderização -------------------------------------------
  desenharCalendario();
  desenharPainel();
  desenharTabelaSemanal();
})();
