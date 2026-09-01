// ---------- DADOS ----------
const criticalOrders = [
  {
    id: 'HC-4429',
    hospital: 'Hospital das Clínicas',
    blood: 'O-',
    urgency: 'Crítico',
    qty: '05 bolsas',
    patient: 'Maria S. Oliveira',
    time: 'Hoje, 10:45',
    stage: 1 // 0=Recebido,1=Em Separação,2=Enviado,3=Entregue
  }
];

const recentOrders = [
  {
    id: 'SC-8812',
    hospital: 'Santa Casa SP',
    blood: 'A+',
    qty: '12 bolsas',
    urgency: 'Rotina',
    patient: null,
    status: 'received', // aguardando confirmação
    statusLabel: 'RECEBIDO (AGUARDANDO CONFIRMAÇÃO)',
    meta: 'Solicitado há 15 min',
    technician: null
  },
  {
    id: 'AE-2104',
    hospital: 'Hosp. Albert Einstein',
    blood: 'AB-',
    qty: '02 bolsas',
    urgency: 'Urgente',
    patient: 'João P. Silva',
    status: 'separating',
    statusLabel: 'EM SEPARAÇÃO',
    meta: null,
    technician: 'Ricardo M.'
  }
];

// pool extra para "Carregar mais pedidos"
const moreOrdersPool = [
  {
    id: 'BR-3391', hospital: 'Beneficência Portuguesa', blood: 'B+', qty: '06 bolsas',
    urgency: 'Rotina', patient: null, status: 'received',
    statusLabel: 'RECEBIDO (AGUARDANDO CONFIRMAÇÃO)', meta: 'Solicitado há 32 min', technician: null
  },
  {
    id: 'SP-9021', hospital: 'Hospital São Paulo', blood: 'O+', qty: '10 bolsas',
    urgency: 'Urgente', patient: 'Carla N. Souza', status: 'separating',
    statusLabel: 'EM SEPARAÇÃO', meta: null, technician: 'Bruno A.'
  },
  {
    id: 'IC-1187', hospital: 'Instituto do Coração', blood: 'A-', qty: '04 bolsas',
    urgency: 'Rotina', patient: null, status: 'received',
    statusLabel: 'RECEBIDO (AGUARDANDO CONFIRMAÇÃO)', meta: 'Solicitado há 48 min', technician: null
  }
];
let moreIndex = 0;

const stageLabels = ['Recebido','Em Separação','Enviado','Entregue'];
const stageIcons = ['✓','📋','🚚','✔️'];

// ---------- RENDER ----------
function renderCritical(){
  const wrap = document.getElementById('criticalList');
  wrap.innerHTML = '';
  criticalOrders.forEach(order=>{
    const card = document.createElement('div');
    card.className = 'critical-card';

    const stepsHtml = stageLabels.map((label, i)=>{
      let cls = '';
      if(i < order.stage) cls = 'done';
      else if(i === order.stage) cls = 'current';
      const icon = i < order.stage ? '✓' : stageIcons[i];
      return `<div class="step ${cls}">
                <div class="dot">${icon}</div>
                <div class="label">${label}</div>
              </div>`;
    }).join('');

    const isFinal = order.stage >= 2; // enviado ou além -> desabilita botão de marcar enviado
    card.innerHTML = `
      <div class="critical-head">
        <h3>${order.hospital}</h3>
        <span class="badge blood">${order.blood}</span>
        <span class="badge critical">${order.urgency.toUpperCase()}</span>
      </div>
      <div class="critical-meta">
        <div class="meta-item"><div class="m-label">Qtd. Solicitada</div><div class="m-value">${order.qty}</div></div>
        <div class="meta-item"><div class="m-label">Paciente</div><div class="m-value">${order.patient}</div></div>
        <div class="meta-item"><div class="m-label">Horário</div><div class="m-value">${order.time}</div></div>
        <div class="meta-item"><div class="m-label">Protocolo</div><div class="m-value">#${order.id}</div></div>
        <div class="critical-actions">
          <button class="btn btn-primary" data-action="advance" data-id="${order.id}" ${order.stage>=2?'disabled':''}>
            ${order.stage>=2 ? 'Enviado' : 'Marcar como Enviado'}
          </button>
          <button class="btn btn-outline" data-action="details" data-id="${order.id}">Ver Detalhes</button>
        </div>
      </div>
      <div class="stepper">${stepsHtml}</div>
    `;
    wrap.appendChild(card);
  });
}

function renderRecent(){
  const wrap = document.getElementById('recentList');
  wrap.innerHTML = '';
  recentOrders.forEach(order=>{
    const card = document.createElement('div');
    card.className = 'recent-card';

    let urgencyBadge = '';
    if(order.urgency === 'Urgente') urgencyBadge = `<span class="badge urgent">URGENTE</span>`;
    else if(order.urgency === 'Crítico') urgencyBadge = `<span class="badge critical">CRÍTICO</span>`;

    const subParts = [`Pedido #${order.id}`, order.qty];
    if(order.patient) subParts.push(`Paciente: ${order.patient}`);
    else subParts.push(`Urgência: ${order.urgency}`);

    let statusHtml = '';
    if(order.status === 'received'){
      statusHtml = `
        <span class="status-pill received"><span class="sdot"></span>${order.statusLabel}</span>
        <span>🕒 ${order.meta}</span>`;
    } else {
      statusHtml = `
        <span class="status-pill separating">📋 ${order.statusLabel}</span>
        <span>👤 Técnico: ${order.technician}</span>`;
    }

    let actionsHtml = '';
    if(order.status === 'received'){
      actionsHtml = `
        <button class="btn btn-primary" data-action="accept" data-id="${order.id}">Aceitar e Separar</button>
        <button class="btn btn-ghost-danger" data-action="reject" data-id="${order.id}">Recusar</button>`;
    } else if(order.status === 'separating'){
      actionsHtml = `<button class="btn btn-primary" data-action="ready" data-id="${order.id}">Marcar Pronto</button>`;
    } else if(order.status === 'sent'){
      actionsHtml = `<button class="btn btn-outline" disabled>Enviado</button>`;
    }

    card.innerHTML = `
      <div class="blood-tag">${order.blood}</div>
      <div class="recent-info">
        <div class="r-title">
          <h4>${order.hospital}</h4>
          ${urgencyBadge}
        </div>
        <div class="r-sub">${subParts.join(' • ')}</div>
        <div class="recent-status">${statusHtml}</div>
      </div>
      <div class="recent-actions">${actionsHtml}</div>
    `;
    wrap.appendChild(card);
  });
}

function refreshStats(){
  document.getElementById('statPending').textContent =
    String(recentOrders.filter(o=>o.status==='received').length).padStart(2,'0');
  document.getElementById('statSeparating').textContent =
    String(recentOrders.filter(o=>o.status==='separating').length + criticalOrders.filter(o=>o.stage===1).length).padStart(2,'0');
  document.getElementById('statCritical').textContent =
    String(criticalOrders.length).padStart(2,'0');
}

// ---------- TOAST ----------
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2600);
}

// ---------- MODAL DETALHES ----------
const detailsOverlay = document.getElementById('detailsOverlay');
function openDetails(order){
  document.getElementById('detailsTitle').textContent = `${order.hospital}`;
  document.getElementById('detailsBody').innerHTML = `
    <div class="d-row"><span>Protocolo</span><span>#${order.id}</span></div>
    <div class="d-row"><span>Tipo Sanguíneo</span><span>${order.blood}</span></div>
    <div class="d-row"><span>Quantidade</span><span>${order.qty}</span></div>
    <div class="d-row"><span>Paciente</span><span>${order.patient || '—'}</span></div>
    <div class="d-row"><span>Urgência</span><span>${order.urgency}</span></div>
    <div class="d-row"><span>Status atual</span><span>${stageLabels[order.stage]}</span></div>
  `;
  detailsOverlay.classList.add('show');
}
document.getElementById('detailsClose').addEventListener('click', ()=> detailsOverlay.classList.remove('show'));
detailsOverlay.addEventListener('click', (e)=>{ if(e.target === detailsOverlay) detailsOverlay.classList.remove('show'); });

// ---------- EVENTOS (delegação) ----------
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if(action === 'advance'){
    const order = criticalOrders.find(o=>o.id===id);
    if(order && order.stage < 2){
      order.stage++;
      renderCritical();
      refreshStats();
      showToast(`Pedido #${id} marcado como enviado.`);
    }
  }

  if(action === 'details'){
    const order = criticalOrders.find(o=>o.id===id);
    if(order) openDetails(order);
  }

  if(action === 'accept'){
    const order = recentOrders.find(o=>o.id===id);
    if(order){
      order.status = 'separating';
      order.statusLabel = 'EM SEPARAÇÃO';
      order.technician = 'Você';
      order.meta = null;
      renderRecent();
      refreshStats();
      showToast(`Pedido #${id} aceito e em separação.`);
    }
  }

  if(action === 'reject'){
    const idx = recentOrders.findIndex(o=>o.id===id);
    if(idx > -1){
      const removed = recentOrders.splice(idx,1)[0];
      renderRecent();
      refreshStats();
      showToast(`Pedido #${removed.id} recusado.`);
    }
  }

  if(action === 'ready'){
    const order = recentOrders.find(o=>o.id===id);
    if(order){
      order.status = 'sent';
      order.statusLabel = 'ENVIADO';
      renderRecent();
      showToast(`Pedido #${id} pronto e enviado.`);
    }
  }
});

// ---------- FILTROS ----------
function applyFilters(){
  const status = document.getElementById('filterStatus').value;
  const blood = document.getElementById('filterBlood').value;
  const urgency = document.getElementById('filterUrgency').value;

  document.querySelectorAll('.recent-card').forEach((card, i)=>{
    const order = recentOrders[i];
    if(!order) return;
    let visible = true;

    if(status !== 'Status: Todos'){
      const map = {'Recebido':'received','Em Separação':'separating','Enviado':'sent'};
      if(order.status !== map[status]) visible = false;
    }
    if(blood !== 'Tipo Sanguíneo' && order.blood !== blood) visible = false;
    if(urgency !== 'Urgência: Todas' && order.urgency !== urgency) visible = false;

    card.style.display = visible ? '' : 'none';
  });
}
['filterStatus','filterBlood','filterUrgency'].forEach(id=>{
  document.getElementById(id).addEventListener('change', applyFilters);
});

// ---------- CARREGAR MAIS ----------
document.getElementById('loadMoreBtn').addEventListener('click', ()=>{
  if(moreIndex >= moreOrdersPool.length){
    document.getElementById('loadMoreBtn').textContent = 'Não há mais pedidos';
    document.getElementById('loadMoreBtn').disabled = true;
    return;
  }
  recentOrders.push(moreOrdersPool[moreIndex]);
  moreIndex++;
  renderRecent();
  applyFilters();
  refreshStats();
  if(moreIndex >= moreOrdersPool.length){
    document.getElementById('loadMoreBtn').textContent = 'Não há mais pedidos';
    document.getElementById('loadMoreBtn').disabled = true;
  }
});

// ---------- INIT ----------
renderCritical();
renderRecent();
refreshStats();
