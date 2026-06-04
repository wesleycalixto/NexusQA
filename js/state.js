/**
 * state.js — Estado global, persistência e utilitários
 */

let stories     = JSON.parse(localStorage.getItem('qa_stories') || '[]');
let editingId   = null;
let steps       = [];
let evidences   = [];
let currentView = 'dashboard';

function saveToStorage() {
  localStorage.setItem('qa_stories', JSON.stringify(stories));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function toast(msg, type = 'success') {
  const colors = { success: 'var(--green)', error: 'var(--red)', warn: 'var(--amber)' };
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `
    <span style="width:6px;height:6px;border-radius:50%;background:${colors[type] || colors.success};flex-shrink:0"></span>
    ${esc(msg)}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function statusChip(s) {
  const labels = { pass: 'Pass', fail: 'Fail', new: 'Pending', blocked: 'Blocked' };
  return `<span class="chip chip-${s}">${labels[s] || s}</span>`;
}

function priorityBadge(p) {
  const labels = { low: 'Low', medium: 'Medium', high: 'High' };
  return `<span class="prio prio-${p || 'medium'}"><span class="prio-dot"></span>${labels[p] || 'Medium'}</span>`;
}
