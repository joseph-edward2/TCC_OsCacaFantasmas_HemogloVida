const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const dows = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];

  // State: fixed reference month = Março 2026 (per mockup)
  let viewYear = 2026, viewMonth = 2; // month index 0-based -> 2 = March
  let selectedDay = 1;
  let selectedTime = "09:30";

  // Days considered unavailable within the month (weekdays highlighted differently in mock: e.g. Sun & day 24 unavailable)
  function isUnavailable(day, weekday){
    if(weekday === 0) return true; // Sundays unavailable
    if(day === 24) return true;    // matches mock (24 has no dot)
    return false;
  }

  const slotsData = ["08:00","09:30","11:00","13:00","14:00","15:30","16:00","17:30"];
  const disabledSlots = ["13:00"];

  function buildCalendar(){
    const grid = document.getElementById('calGrid');
    grid.innerHTML = "";
    document.getElementById('calTitle').textContent = `${monthNames[viewMonth]} ${viewYear}`;

    dows.forEach(d=>{
      const el = document.createElement('div');
      el.className = 'dow';
      el.textContent = d;
      grid.appendChild(el);
    });

    const firstDate = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDate.getDay();
    const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // leading muted days
    for(let i=startWeekday-1; i>=0; i--){
      const el = document.createElement('div');
      el.className = 'day-cell muted';
      el.textContent = daysInPrevMonth - i;
      grid.appendChild(el);
    }

    for(let day=1; day<=daysInMonth; day++){
      const weekday = new Date(viewYear, viewMonth, day).getDay();
      const el = document.createElement('div');
      el.className = 'day-cell';
      el.dataset.day = day;

      const unavailable = isUnavailable(day, weekday);
      if(!unavailable){
        el.classList.add('available');
        el.innerHTML = `${day}<span class="dot"></span>`;
        el.addEventListener('click', ()=>{
          selectedDay = day;
          updateSelection();
        });
      } else {
        el.textContent = day;
      }
      grid.appendChild(el);
    }

    // trailing to complete grid to full weeks
    const totalCells = startWeekday + daysInMonth;
    const remainder = totalCells % 7;
    if(remainder !== 0){
      for(let i=1; i<=7-remainder; i++){
        const el = document.createElement('div');
        el.className = 'day-cell muted';
        el.textContent = i;
        grid.appendChild(el);
      }
    }
    updateSelection();
  }

  function buildSlots(){
    const grid = document.getElementById('slotsGrid');
    grid.innerHTML = "";
    slotsData.forEach(t=>{
      const el = document.createElement('div');
      el.className = 'slot';
      el.textContent = t;
      if(disabledSlots.includes(t)){
        el.classList.add('disabled');
      } else {
        el.addEventListener('click', ()=>{
          selectedTime = t;
          updateSelection();
        });
      }
      grid.appendChild(el);
    });
    updateSelection();
  }

  function updateSelection(){
    document.querySelectorAll('.day-cell.available').forEach(el=>{
      el.classList.toggle('selected', Number(el.dataset.day) === selectedDay);
    });
    document.querySelectorAll('.slot:not(.disabled)').forEach(el=>{
      el.classList.toggle('selected', el.textContent === selectedTime);
    });

    document.getElementById('summaryDate').textContent =
      `${String(selectedDay).padStart(2,'0')} de ${monthNames[viewMonth]} de ${viewYear}`;
    document.getElementById('summaryTime').textContent = selectedTime;
  }

  document.getElementById('prevMonth').addEventListener('click', ()=>{
    viewMonth--; if(viewMonth<0){ viewMonth=11; viewYear--; }
    selectedDay = 1;
    buildCalendar();
  });
  document.getElementById('nextMonth').addEventListener('click', ()=>{
    viewMonth++; if(viewMonth>11){ viewMonth=0; viewYear++; }
    selectedDay = 1;
    buildCalendar();
  });

  // Confirm -> decide qual modal mostrar conforme a metade do mês em que a data selecionada cai
  const overlay = document.getElementById('overlay');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  const MODAL_CONTENT = {
    success: {
      icon: '✅',
      iconClass: 'success',
      title: 'Agendamento feito',
      text: 'Agendamento realizado, se cuide até a data da doação!'
    },
    error: {
      icon: '🗓️',
      iconClass: '',
      title: 'Aguarde um pouco mais',
      text: 'Notamos que sua última doação foi recente. Para sua segurança, o intervalo mínimo entre doações é de 60 dias para homens e 90 dias para mulheres.'
    }
  };

  function showModal(type){
    const content = MODAL_CONTENT[type];
    modalIcon.textContent = content.icon;
    modalIcon.className = 'modal-icon' + (content.iconClass ? ' ' + content.iconClass : '');
    modalTitle.textContent = content.title;
    modalText.textContent = content.text;
    overlay.classList.add('show');
  }

  document.getElementById('confirmBtn').addEventListener('click', ()=>{
    // Divide o mês em duas metades pelo número de dias.
    // 1ª metade do mês -> agendamento feito (sucesso)
    // 2ª metade do mês -> erro (intervalo mínimo entre doações)
    const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
    const midpoint = Math.ceil(daysInMonth / 2);
    const resultType = selectedDay <= midpoint ? 'success' : 'error';
    showModal(resultType);
  });

  function closeModal(){ overlay.classList.remove('show'); }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOk').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });

  buildCalendar();
  buildSlots();

  // Botão "Trocar" leva para a tela de busca de hemocentro (local.html),
  // que permite escolher outro local antes de voltar pra agendar.
  const trocarBtn = document.querySelector(".trocar-btn");
  if (trocarBtn) {
    trocarBtn.addEventListener("click", () => {
      window.location.href = "local.html";
    });
  }
