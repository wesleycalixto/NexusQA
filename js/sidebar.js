/**
 * sidebar.js — Renderização da sidebar
 */

function renderSidebar() {
  document.getElementById('story-count-label').textContent = stories.length;

  const el = document.getElementById('sidebar-story-list');

  if (!stories.length) {
    el.innerHTML = '<p style="font-size:11px;color:var(--text3);padding:4px 6px">No test stories yet</p>';
    return;
  }

  el.innerHTML = stories.map(s => `
    <div class="story-chip ${currentView === 'detail' ? 'selected' : ''}"
         onclick="navigate('detail','${s.id}')">
      <span class="chip-dot chip-dot-${s.status}"></span>
      <span class="chip-label">${esc(s.title)}</span>
    </div>
  `).join('');
}
