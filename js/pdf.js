/**
 * pdf.js — Exportação para PDF
 */

function showPDFLoading(show) {
  const ID = 'pdf-overlay';
  if (show) {
    const el = document.createElement('div');
    el.id = ID;
    el.className = 'pdf-loading';
    el.innerHTML = `<div class="pdf-spinner"></div><div class="pdf-loading-text">Generating PDF...</div>`;
    document.body.appendChild(el);
  } else {
    document.getElementById(ID)?.remove();
  }
}

async function exportSinglePDF(id) {
  const story = stories.find(x => x.id === id);
  if (!story) return;
  showPDFLoading(true);
  try {
    await generatePDF([story], story.title.replace(/\s+/g, '_'));
  } finally {
    showPDFLoading(false);
  }
}

async function exportAllPDF() {
  if (!stories.length) {
    toast('No stories to export', 'warn');
    navigate('dashboard');
    return;
  }
  showPDFLoading(true);
  try {
    await generatePDF(stories, 'QA_Report');
  } finally {
    showPDFLoading(false);
    navigate('dashboard');
  }
}

async function generatePDF(storiesList, filename) {
  const { jsPDF }  = window.jspdf;
  const pdf        = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const A4_W       = 210;
  const A4_H       = 297;
  const renderArea = document.getElementById('pdf-render-area');

  for (let i = 0; i < storiesList.length; i++) {
    renderArea.innerHTML     = buildPDFHTML(storiesList[i]);
    renderArea.style.display = 'block';

    await new Promise(r => setTimeout(r, 300));

    const canvas  = await html2canvas(renderArea, {
      scale: 2, useCORS: true, allowTaint: true,
      backgroundColor: '#ffffff', width: 794, windowWidth: 794, logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const imgH    = (canvas.height * A4_W) / canvas.width;

    if (i > 0) pdf.addPage();

    if (imgH <= A4_H) {
      pdf.addImage(imgData, 'JPEG', 0, 0, A4_W, imgH);
    } else {
      let yOff = 0, first = true;
      while (yOff < canvas.height) {
        if (!first) pdf.addPage();
        first = false;
        const sliceH = Math.min((A4_H / A4_W) * canvas.width, canvas.height - yOff);
        const sc = document.createElement('canvas');
        sc.width = canvas.width; sc.height = sliceH;
        sc.getContext('2d').drawImage(canvas, 0, -yOff);
        pdf.addImage(sc.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_W, (sliceH * A4_W) / canvas.width);
        yOff += sliceH;
      }
    }

    renderArea.style.display = 'none';
    renderArea.innerHTML     = '';
  }

  pdf.save(`${filename}.pdf`);
  toast('PDF exported successfully');
}

/* PDF template — light theme, A4 */
function buildPDFHTML(story) {
  const STATUS_COLORS  = { pass: '#16a34a', fail: '#dc2626', new: '#d97706', blocked: '#64748b' };
  const STATUS_LABELS  = { pass: 'PASS', fail: 'FAIL', new: 'PENDING', blocked: 'BLOCKED' };
  const PRIORITY_BG    = { low: '#f0fdf4', medium: '#fffbeb', high: '#fef2f2' };
  const PRIORITY_COLOR = { low: '#16a34a', medium: '#d97706', high: '#dc2626' };
  const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

  const sc = STATUS_COLORS[story.status]    || '#64748b';
  const sl = STATUS_LABELS[story.status]    || story.status.toUpperCase();
  const pbg = PRIORITY_BG[story.priority]   || '#f8fafc';
  const pc  = PRIORITY_COLOR[story.priority]|| '#64748b';
  const pl  = PRIORITY_LABELS[story.priority] || story.priority;

  const e = str => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const evHtml = story.evidences?.length
    ? story.evidences.map((ev, i) => `
        <div style="break-inside:avoid;margin-bottom:20px">
          <div style="font-size:10px;color:#94a3b8;font-family:monospace;margin-bottom:6px">
            Evidence ${i + 1} — ${e(ev.name)}
          </div>
          <img src="${ev.dataUrl}"
               style="width:100%;max-height:360px;object-fit:contain;
                      border-radius:4px;border:1px solid #e2e8f0;display:block">
        </div>`).join('')
    : '<p style="color:#94a3b8;font-size:12px">No evidence attached.</p>';

  const stepsHtml = story.steps?.length
    ? story.steps.map((st, i) => `
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px">
          <div style="min-width:24px;height:24px;border-radius:4px;background:#eff6ff;
                      border:1px solid #bfdbfe;display:flex;align-items:center;
                      justify-content:center;font-size:11px;font-family:monospace;
                      color:#2563eb;flex-shrink:0">${i + 1}</div>
          <div style="font-size:13px;color:#374151;line-height:1.6;padding-top:3px">${e(st.text)}</div>
        </div>`).join('')
    : '<p style="color:#94a3b8;font-size:12px">No steps defined.</p>';

  return `
  <div style="font-family:'Inter',sans-serif;color:#111827;background:#fff">

    <!-- Header -->
    <div style="background:#0f172a;color:#fff;padding:32px 40px 28px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px">
        <span style="font-size:10px;font-weight:600;letter-spacing:1.2px;color:#94a3b8;
                     text-transform:uppercase;font-family:monospace">QA Manager</span>
        <span style="color:#334155;font-size:12px">/</span>
        <span style="font-size:10px;font-weight:600;letter-spacing:1.2px;color:#94a3b8;
                     text-transform:uppercase;font-family:monospace">Test Report</span>
      </div>
      <h1 style="font-size:22px;font-weight:600;margin-bottom:14px;line-height:1.3;color:#f1f5f9">
        ${e(story.title)}
      </h1>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span style="background:${sc};color:#fff;padding:3px 10px;border-radius:4px;
                     font-size:11px;font-weight:700;letter-spacing:0.5px">${sl}</span>
        <span style="background:${pbg};color:${pc};padding:3px 10px;border-radius:4px;
                     font-size:11px;font-weight:600">Priority: ${pl}</span>
        ${story.testId
          ? `<span style="background:rgba(255,255,255,0.08);color:#94a3b8;padding:3px 10px;
                          border-radius:4px;font-size:11px;font-family:monospace">${e(story.testId)}</span>`
          : ''}
      </div>
    </div>

    <!-- Meta row -->
    <div style="background:#f8fafc;border-bottom:1px solid #e2e8f0;
                padding:14px 40px;display:flex;gap:32px;flex-wrap:wrap">
      ${pdfMeta('Module',    e(story.module  || '—'))}
      ${pdfMeta('Version',   e(story.version || '—'))}
      ${pdfMeta('Date',      story.date ? formatDate(story.date) : '—')}
      ${pdfMeta('Tester',    e(story.tester  || '—'))}
      ${pdfMeta('Generated', new Date().toLocaleDateString('pt-BR'))}
    </div>

    <!-- Body -->
    <div style="padding:28px 40px">

      ${story.desc ? pdfSection('Description',
          `<p style="font-size:13px;color:#374151;line-height:1.7">${e(story.desc)}</p>`) : ''}

      ${story.pre ? pdfSection('Preconditions',
          `<p style="font-size:13px;color:#374151;line-height:1.7">${e(story.pre)}</p>`) : ''}

      ${story.steps?.length ? pdfSection('Test Steps', stepsHtml) : ''}

      ${pdfSection('Results', `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <div style="font-size:10px;color:#94a3b8;font-weight:600;letter-spacing:0.8px;
                        text-transform:uppercase;margin-bottom:8px">Expected Result</div>
            <div style="font-size:12px;color:#374151;background:#f0fdf4;padding:12px;
                        border-radius:6px;border:1px solid #bbf7d0;line-height:1.7">
              ${e(story.expected || '—')}
            </div>
          </div>
          <div>
            <div style="font-size:10px;color:#94a3b8;font-weight:600;letter-spacing:0.8px;
                        text-transform:uppercase;margin-bottom:8px">Actual Result</div>
            <div style="font-size:12px;color:#374151;
                        background:${story.status === 'fail' ? '#fef2f2' : '#f8fafc'};
                        padding:12px;border-radius:6px;
                        border:1px solid ${story.status === 'fail' ? '#fecaca' : '#e2e8f0'};
                        line-height:1.7">
              ${e(story.obtained || '—')}
            </div>
          </div>
        </div>`)}

      ${story.notes ? pdfSection('Observations / Bugs',
          `<div style="font-size:12px;color:#374151;font-family:monospace;background:#fffbeb;
                       padding:12px;border-radius:6px;border:1px solid #fde68a;
                       line-height:1.7;white-space:pre-wrap">${e(story.notes)}</div>`) : ''}

      ${pdfSection('Evidence', evHtml)}

      <!-- Footer -->
      <div style="margin-top:28px;padding-top:14px;border-top:1px solid #e2e8f0;
                  display:flex;justify-content:space-between">
        <span style="font-size:10px;color:#94a3b8">
          Generated by QA Manager on
          ${new Date().toLocaleDateString('pt-BR')}
          at ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span style="font-size:10px;color:#94a3b8;font-family:monospace">
          ${e(story.testId || '')}${story.testId ? ' · ' : ''}${e(story.title)}
        </span>
      </div>

    </div>
  </div>`;
}

function pdfSection(title, content) {
  return `
    <div style="margin-bottom:22px;break-inside:avoid">
      <div style="font-size:10px;font-weight:600;color:#94a3b8;letter-spacing:0.8px;
                  text-transform:uppercase;margin-bottom:12px;padding-bottom:8px;
                  border-bottom:1px solid #f1f5f9">${title}</div>
      ${content}
    </div>`;
}

function pdfMeta(label, value) {
  return `
    <div>
      <div style="font-size:10px;color:#94a3b8;font-weight:600;letter-spacing:0.8px;
                  text-transform:uppercase;margin-bottom:3px">${label}</div>
      <div style="font-size:12px;color:#374151">${value}</div>
    </div>`;
}
