import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const filesZone = document.getElementById('files-zone');
  if (!filesZone) return;

  /** @param {number} bytes */
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * @param {HTMLElement | null} listEl
   * @param {File[]} files
   */
  function renderFiles(listEl, files) {
    if (!listEl) return;
    listEl.innerHTML = '';
    listEl.classList.remove('drop-hidden');
    for (const file of files) {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `<span class="file-name">${file.name}</span><span class="file-size">${formatSize(file.size)}</span>`;
      listEl.appendChild(item);
    }
  }

  filesZone.addEventListener('native:drop', (e) => {
    /** @type {CustomEvent} */ const evt = e;
    if (evt.detail.type !== 'file') return;
    renderFiles(document.getElementById('files-list'), evt.detail.files);
    for (const file of evt.detail.files) {
      appendLog(document.getElementById('files-log'), `${file.name} (${formatSize(file.size)})`);
    }
  });

  document.getElementById('images-zone')?.addEventListener('native:drop', (e) => {
    /** @type {CustomEvent} */ const evt = e;
    if (evt.detail.type !== 'file') return;
    renderFiles(document.getElementById('images-list'), evt.detail.files);
    for (const file of evt.detail.files) {
      appendLog(document.getElementById('images-log'), `${file.name} (${file.type}, ${formatSize(file.size)})`);
    }
  });

  document.getElementById('text-zone')?.addEventListener('native:drop', (e) => {
    /** @type {CustomEvent} */ const evt = e;
    if (evt.detail.type !== 'text') return;
    const contentEl = document.getElementById('text-content');
    if (contentEl) {
      contentEl.classList.remove('drop-hidden');
      contentEl.textContent = evt.detail.text;
    }
    appendLog(document.getElementById('text-log'), `Dropped ${evt.detail.text.length} characters`);
  });

  document.getElementById('single-zone')?.addEventListener('native:drop', (e) => {
    /** @type {CustomEvent} */ const evt = e;
    if (evt.detail.type !== 'file') return;
    renderFiles(document.getElementById('single-list'), evt.detail.files);
    const file = evt.detail.files[0];
    appendLog(document.getElementById('single-log'), `${file.name} (${formatSize(file.size)}) — only 1 file accepted`);
  });
});
