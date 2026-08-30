const hemocentros = [
  {
    id: 'central',
    name: 'Hemocentro Central - São Paulo',
    address: 'R. Dr. Dante Pazzanese, 500',
    status: 'Aberto',
    closes: 'Fecha às 19:30',
    blood: ['O-','O+','A+','A-','B+','B-','AB+','AB-'],
    x: 40, y: 33
  },
  {
    id: 'banco',
    name: 'Banco de Sangue Paulista',
    address: 'R. Dr. Dante Pazzanese, 500',
    status: 'Aberto',
    closes: 'Fecha às 19:30',
    blood: ['O-','A+','B+','AB-'],
    x: 66, y: 76
  },
  {
    id: 'clinicas',
    name: 'Posto de Coleta - Clínicas',
    address: 'R. Dr. Dante Pazzanese, 500',
    status: 'Aberto',
    closes: 'Fecha às 19:30',
    blood: ['O+','A-','B-','AB+'],
    x: 21, y: 58
  },
  {
    id: 'guarulhos',
    name: 'Hospital Geral de Guarulhos',
    address: 'R. Dr. Dante Pazzanese, 500',
    status: 'Aberto',
    closes: 'Fecha às 19:30',
    blood: ['O-','O+','A+','B+'],
    x: 79, y: 44
  }
];

let selectedId = 'banco'; // pré-selecionado como no mock

function matchesFilters(hc, query, blood){
  const q = query.trim().toLowerCase();
  const matchesQuery = !q || hc.name.toLowerCase().includes(q) || hc.address.toLowerCase().includes(q);
  const matchesBlood = !blood || hc.blood.includes(blood);
  return matchesQuery && matchesBlood;
}

function renderList(){
  const query = document.getElementById('searchInput').value;
  const blood = document.getElementById('bloodFilter').value;
  const listCol = document.getElementById('listCol');
  listCol.innerHTML = '';

  const filtered = hemocentros.filter(hc => matchesFilters(hc, query, blood));

  if(filtered.length === 0){
    listCol.innerHTML = `<div class="no-results">Nenhum hemocentro encontrado para essa busca.</div>`;
  } else {
    filtered.forEach(hc=>{
      const card = document.createElement('div');
      card.className = 'hc-card' + (hc.id === selectedId ? ' selected' : '');
      card.dataset.id = hc.id;
      card.innerHTML = `
        <div class="hc-head">
          <div class="hc-pin">📍</div>
          <div class="hc-info">
            <h3>${hc.name}</h3>
            <p>${hc.address}</p>
          </div>
          <div class="hc-status">
            <div class="open">${hc.status}</div>
            <div class="closes">${hc.closes}</div>
          </div>
        </div>
        <button class="agendar-btn ${hc.id === selectedId ? 'selected' : ''}" data-id="${hc.id}">Agendar</button>
      `;
      listCol.appendChild(card);
    });
  }

  renderPins(filtered.map(hc=>hc.id));
}

function renderPins(visibleIds){
  const pinsWrap = document.getElementById('mapPins');
  pinsWrap.innerHTML = '';
  hemocentros.forEach(hc=>{
    if(!visibleIds.includes(hc.id)) return;
    const pin = document.createElement('div');
    pin.className = 'pin' + (hc.id === selectedId ? ' selected' : '');
    pin.style.left = hc.x + '%';
    pin.style.top = hc.y + '%';
    pin.dataset.id = hc.id;
    pin.innerHTML = `<span class="pin-inner">🩸</span><span class="pin-label">${hc.name}</span>`;
    pin.addEventListener('click', ()=>{
      selectedId = hc.id;
      renderList();
    });
    pinsWrap.appendChild(pin);
  });
}

// clique nos botões "Agendar" e no card (delegação)
document.getElementById('listCol').addEventListener('click', (e)=>{
  const btn = e.target.closest('.agendar-btn');
  const card = e.target.closest('.hc-card');
  if(btn){
    selectedId = btn.dataset.id;
    const hc = hemocentros.find(h=>h.id===selectedId);
    renderList();
    showToast(`Redirecionando para agendamento em "${hc.name}"...`);

    // Depois de mostrar o toast, volta pra tela de Agendamentos
    // com esse hemocentro já escolhido.
    setTimeout(() => {
      window.location.href = "agendamentos.html";
    }, 1200);
  } else if(card){
    selectedId = card.dataset.id;
    renderList();
  }
});

document.getElementById('searchInput').addEventListener('input', renderList);
document.getElementById('bloodFilter').addEventListener('change', renderList);

let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2600);
}

renderList();
