/**
 * dashboard.js — Renderização do Dashboard
 */

function renderDashboard() {
  const total = stories.length;
  const pass  = stories.filter(s => s.status === 'pass').length;
  const fail  = stories.filter(s => s.status === 'fail').length;
  const pend  = stories.filter(s => s.status === 'new' || s.status === 'blocked').length;

  document.getElementById('s-total').textContent = total;
  document.getElementById('s-pass').textContent  = pass;
  document.getElementById('s-fail').textContent  = fail;
  document.getElementById('s-pend').textContent  = pend;

  const tbody = document.getElementById('table-body');

  if (!total) {
    tbody.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
        </div>
        <div class="empty-title">No test stories</div>
        <div class="empty-sub">Create your first story to get started</div>
        <button class="btn btn-primary btn-sm" onclick="navigate('new')">New Story</button>
      </div>`;
    return;
  }

  tbody.innerHTML = stories.map(s => `
    <div class="table-row" onclick="navigate('detail','${s.id}')">
      <div>
        <div class="row-title">${esc(s.title)}</div>
        <div class="row-id">${esc(s.testId || '—')}</div>
      </div>
      <div>${statusChip(s.status)}</div>
      <div class="row-module">${esc(s.module || '—')}</div>
      <div>${priorityBadge(s.priority)}</div>
      <div class="row-actions" onclick="event.stopPropagation()">
        <button class="btn btn-ghost btn-icon btn-sm" title="Edit"   onclick="navigate('edit','${s.id}')">
          ${iconEdit()}
        </button>
        <button class="btn btn-ghost btn-icon btn-sm" title="Export PDF" onclick="exportSinglePDF('${s.id}')">
          ${iconPDF()}
        </button>
        <button class="btn btn-danger btn-icon btn-sm" title="Delete" onclick="deleteStory('${s.id}')">
          ${iconTrash()}
        </button>
      </div>
    </div>
  `).join('');
}

/* Inline SVG icons — 14x14 */
function iconEdit() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>`;
}

function iconPDF() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>`;
}

function iconTrash() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>`;
}
