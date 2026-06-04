/**
 * navigation.js — Roteamento entre views
 */

function navigate(view, storyId = null) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  currentView = view;

  const activate = id => {
    const el = document.getElementById('nav-' + id);
    if (el) el.classList.add('active');
  };

  switch (view) {
    case 'dashboard':
      document.getElementById('view-dashboard').classList.add('active');
      activate('dashboard');
      document.getElementById('topbar-title').textContent = 'Dashboard';
      document.getElementById('topbar-actions').innerHTML =
        `<button class="btn btn-primary btn-sm" onclick="navigate('new')">New Story</button>`;
      renderDashboard();
      break;

    case 'new':
      document.getElementById('view-new').classList.add('active');
      activate('new');
      document.getElementById('topbar-title').textContent = 'New Test Story';
      document.getElementById('topbar-actions').innerHTML = '';
      editingId = null;
      resetForm();
      break;

    case 'edit':
      if (!storyId) break;
      document.getElementById('view-new').classList.add('active');
      document.getElementById('topbar-title').textContent = 'Edit Story';
      document.getElementById('topbar-actions').innerHTML = '';
      loadStoryIntoForm(storyId);
      break;

    case 'detail':
      if (!storyId) break;
      document.getElementById('view-detail').classList.add('active');
      document.getElementById('topbar-title').textContent = 'Story Detail';
      document.getElementById('topbar-actions').innerHTML = `
        <button class="btn btn-ghost btn-sm" onclick="navigate('edit','${storyId}')">Edit</button>
        <button class="btn btn-success btn-sm" onclick="exportSinglePDF('${storyId}')">Export PDF</button>`;
      renderDetail(storyId);
      break;

    case 'export-all':
      activate('export-all');
      exportAllPDF();
      break;
  }

  renderSidebar();
}
