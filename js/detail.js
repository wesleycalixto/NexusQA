/**
 * detail.js — View de detalhe de uma história de teste
 */

function renderDetail(id) {
  const s = stories.find(x => x.id === id);
  if (!s) { navigate('dashboard'); return; }

  const el = document.getElementById('detail-content');

  const stepsHtml = s.steps?.length
    ? s.steps.map((step, i) => `
        <div class="step-detail-row">
          <div class="step-detail-index">${i + 1}</div>
          <div class="step-detail-text">${esc(step.text)}</div>
        </div>`).join('')
    : '<p class="section-text" style="color:var(--text3)">No steps defined.</p>';

  const evidencesHtml = s.evidences?.length
    ? `<div class="evidence-grid">
        ${s.evidences.map(e => `
          <div class="evidence-item">
            <img src="${e.dataUrl}" alt="${esc(e.name)}">
            <div class="evidence-name">${esc(e.name)}</div>
          </div>`).join('')}
      </div>`
    : '<p class="section-text" style="color:var(--text3)">No evidence attached.</p>';

  el.innerHTML = `
    <div class="detail-title-row">
      <div>
        <div class="detail-chips">
          ${statusChip(s.status)}
          ${priorityBadge(s.priority)}
          ${s.testId ? `<span class="test-id-label">${esc(s.testId)}</span>` : ''}
        </div>
        <h1 class="detail-title">${esc(s.title)}</h1>
      </div>
    </div>

    <div class="detail-meta">
      <div class="meta-card"><div class="meta-label">Module</div>     <div class="meta-value">${esc(s.module  || '—')}</div></div>
      <div class="meta-card"><div class="meta-label">Version</div>    <div class="meta-value">${esc(s.version || '—')}</div></div>
      <div class="meta-card"><div class="meta-label">Test Date</div>  <div class="meta-value">${s.date ? formatDate(s.date) : '—'}</div></div>
      <div class="meta-card"><div class="meta-label">Tester</div>     <div class="meta-value">${esc(s.tester  || '—')}</div></div>
      <div class="meta-card"><div class="meta-label">Evidence</div>   <div class="meta-value">${s.evidences?.length || 0} file(s)</div></div>
      <div class="meta-card"><div class="meta-label">Updated</div>    <div class="meta-value">${new Date(s.updatedAt).toLocaleDateString('pt-BR')}</div></div>
    </div>

    ${s.desc ? `
    <div class="section-block">
      <div class="section-title">Description</div>
      <p class="section-text">${esc(s.desc)}</p>
    </div>` : ''}

    ${s.pre ? `
    <div class="section-block">
      <div class="section-title">Preconditions</div>
      <p class="section-text">${esc(s.pre)}</p>
    </div>` : ''}

    ${s.steps?.length ? `
    <div class="section-block">
      <div class="section-title">Test Steps</div>
      ${stepsHtml}
    </div>` : ''}

    <div class="section-block">
      <div class="section-title">Results</div>
      <div class="result-grid">
        <div>
          <div class="result-label">Expected Result</div>
          <div class="result-box">${esc(s.expected || '—')}</div>
        </div>
        <div>
          <div class="result-label">Actual Result</div>
          <div class="result-box ${s.status === 'fail' ? 'fail' : ''}">${esc(s.obtained || '—')}</div>
        </div>
      </div>
    </div>

    ${s.notes ? `
    <div class="section-block">
      <div class="section-title">Observations / Bugs</div>
      <div class="notes-box">${esc(s.notes)}</div>
    </div>` : ''}

    ${s.evidences?.length ? `
    <div class="section-block">
      <div class="section-title">Evidence (${s.evidences.length})</div>
      ${evidencesHtml}
    </div>` : ''}

    <div class="detail-actions">
      <button class="btn btn-danger btn-sm" onclick="deleteStory('${s.id}')">Delete</button>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm"   onclick="navigate('edit','${s.id}')">Edit</button>
        <button class="btn btn-success btn-sm" onclick="exportSinglePDF('${s.id}')">Export PDF</button>
      </div>
    </div>
  `;
}
