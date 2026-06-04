/**
 * form.js — Formulário de criação e edição de histórias
 */

function resetForm() {
  steps     = [];
  evidences = [];

  document.getElementById('f-title').value    = '';
  document.getElementById('f-id').value       = 'TC-' + String(stories.length + 1).padStart(3, '0');
  document.getElementById('f-module').value   = '';
  document.getElementById('f-version').value  = '';
  document.getElementById('f-date').value     = new Date().toISOString().slice(0, 10);
  document.getElementById('f-priority').value = 'medium';
  document.getElementById('f-status').value   = 'new';
  document.getElementById('f-tester').value   = '';
  document.getElementById('f-desc').value     = '';
  document.getElementById('f-pre').value      = '';
  document.getElementById('f-expected').value = '';
  document.getElementById('f-obtained').value = '';
  document.getElementById('f-notes').value    = '';
  document.getElementById('save-btn').textContent = 'Save Story';

  addStep(); addStep(); addStep();
  renderSteps();
  renderEvidenceGrid();
}

function loadStoryIntoForm(id) {
  const s = stories.find(x => x.id === id);
  if (!s) return;

  editingId = id;
  steps     = s.steps     ? [...s.steps]     : [];
  evidences = s.evidences ? [...s.evidences] : [];

  document.getElementById('f-title').value    = s.title    || '';
  document.getElementById('f-id').value       = s.testId   || '';
  document.getElementById('f-module').value   = s.module   || '';
  document.getElementById('f-version').value  = s.version  || '';
  document.getElementById('f-date').value     = s.date     || '';
  document.getElementById('f-priority').value = s.priority || 'medium';
  document.getElementById('f-status').value   = s.status   || 'new';
  document.getElementById('f-tester').value   = s.tester   || '';
  document.getElementById('f-desc').value     = s.desc     || '';
  document.getElementById('f-pre').value      = s.pre      || '';
  document.getElementById('f-expected').value = s.expected || '';
  document.getElementById('f-obtained').value = s.obtained || '';
  document.getElementById('f-notes').value    = s.notes    || '';
  document.getElementById('save-btn').textContent = 'Update Story';

  renderSteps();
  renderEvidenceGrid();
}

/* Steps */
function addStep(text = '') {
  steps.push({ id: uid(), text });
  renderSteps();
}

function removeStep(id) {
  steps = steps.filter(s => s.id !== id);
  renderSteps();
}

function renderSteps() {
  const area = document.getElementById('steps-area');

  if (!steps.length) {
    area.innerHTML = '<div class="steps-empty">No steps added yet</div>';
    return;
  }

  area.innerHTML = `<div class="steps-container">` +
    steps.map((s, i) => `
      <div class="step-row">
        <div class="step-index">${i + 1}</div>
        <input type="text"
               value="${esc(s.text)}"
               placeholder="Step ${i + 1} description..."
               oninput="steps[${i}].text = this.value">
        <button type="button" class="step-del" onclick="removeStep('${s.id}')" title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`).join('') +
  `</div>`;
}

/* Evidence */
function handleEvidenceUpload(event) {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      evidences.push({ id: uid(), dataUrl: e.target.result, name: file.name });
      renderEvidenceGrid();
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function removeEvidence(id) {
  evidences = evidences.filter(e => e.id !== id);
  renderEvidenceGrid();
}

function renderEvidenceGrid() {
  const grid = document.getElementById('evidence-grid');

  if (!evidences.length) { grid.innerHTML = ''; return; }

  grid.innerHTML = evidences.map(e => `
    <div class="evidence-item">
      <img src="${e.dataUrl}" alt="${esc(e.name)}">
      <button class="evidence-del" type="button" onclick="removeEvidence('${e.id}')">Remove</button>
      <div class="evidence-name">${esc(e.name)}</div>
    </div>
  `).join('');
}

/* Save */
function saveStory(event) {
  event.preventDefault();

  const story = {
    id:        editingId || uid(),
    title:     document.getElementById('f-title').value.trim(),
    testId:    document.getElementById('f-id').value.trim(),
    module:    document.getElementById('f-module').value.trim(),
    version:   document.getElementById('f-version').value.trim(),
    date:      document.getElementById('f-date').value,
    priority:  document.getElementById('f-priority').value,
    status:    document.getElementById('f-status').value,
    tester:    document.getElementById('f-tester').value.trim(),
    desc:      document.getElementById('f-desc').value.trim(),
    pre:       document.getElementById('f-pre').value.trim(),
    expected:  document.getElementById('f-expected').value.trim(),
    obtained:  document.getElementById('f-obtained').value.trim(),
    notes:     document.getElementById('f-notes').value.trim(),
    steps:     steps.filter(s => s.text.trim()),
    evidences: [...evidences],
    createdAt: editingId
      ? (stories.find(x => x.id === editingId) || {}).createdAt
      : Date.now(),
    updatedAt: Date.now(),
  };

  if (editingId) {
    const idx = stories.findIndex(x => x.id === editingId);
    stories[idx] = story;
    toast('Story updated');
  } else {
    stories.push(story);
    toast('Story created');
  }

  saveToStorage();
  navigate('detail', story.id);
}

/* Delete */
function deleteStory(id) {
  if (!confirm('Delete this test story?')) return;
  stories = stories.filter(s => s.id !== id);
  saveToStorage();
  toast('Story deleted', 'error');
  navigate('dashboard');
}
