import { NoodleController, MagnetController, PresentController } from '@nonoun/native-ui';
import { createEditorView, EditorView } from '@nonoun/native-code';
import { json } from '@codemirror/lang-json';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('noodleable-page')) return;

  // ── Interactive Flow Builder ──

  const flowArena = /** @type {HTMLElement} */ (document.getElementById('flow-arena'));
  const flowViewport = document.getElementById('flow-viewport');
  const flowTransform = document.getElementById('flow-transform');
  const editorContainer = document.getElementById('flow-json-editor');

  /** @type {MagnetController|null} */
  let magnet = null;
  /** @type {NoodleController|null} */
  let noodle = null;
  /** @type {EditorView|null} */
  let editorView = null;
  let nodeCounter = 0;
  let suppressEditorSync = false;
  let suppressCanvasSync = false;
  /** @type {number|null} */
  let editorSyncTimer = null;
  const intents = ['accent', 'info', 'success', 'warning', 'danger'];

  if (flowArena && flowViewport && flowTransform) {
    magnet = new MagnetController(flowArena, {
      selector: '.flow-node',
      snapToEdges: true,
      threshold: 15,
      guides: true,
    });

    noodle = new NoodleController(flowArena, {
      editable: true,
      showPorts: true,
      animated: true,
      strokeWidth: 2.5,
      connections: [
        { id: 'init-1', from: 'f-sensor', to: 'f-filter', fromPort: 'right', toPort: 'left' },
        { id: 'init-2', from: 'f-transform', to: 'f-merge', fromPort: 'right', toPort: 'left' },
      ],
    });

    // ── Guides Toggle ──

    const guidesToggle = document.getElementById('flow-guides-toggle');
    guidesToggle?.addEventListener('native:change', () => {
      if (magnet) magnet.guides = /** @type {HTMLInputElement} */ (guidesToggle).checked;
    });

    // ── Present Mode ──

    const flowSplit = /** @type {HTMLElement} */ (flowArena.closest('.flow-split'));
    const fullscreenBtn = document.getElementById('flow-fullscreen-btn');
    let presentCtrl = flowSplit ? new PresentController(flowSplit) : null;

    fullscreenBtn?.addEventListener('native:press', () => {
      presentCtrl?.present();
    });

    flowSplit?.addEventListener('native:present', () => {
      const icon = fullscreenBtn?.querySelector('n-icon');
      if (icon) icon.setAttribute('name', 'arrows-in');
      noodle?.update();
    });
    flowSplit?.addEventListener('native:dismiss', () => {
      const icon = fullscreenBtn?.querySelector('n-icon');
      if (icon) icon.setAttribute('name', 'arrows-out');
      noodle?.update();
    });

    flowArena.addEventListener('native:magnet-snap', () => {
      noodle?.update();
      syncCanvasToEditor();
    });
    flowArena.addEventListener('native:magnet-drop', () => {
      noodle?.update();
      syncCanvasToEditor();
    });
    flowArena.addEventListener('native:noodle-connect', () => syncCanvasToEditor());
    flowArena.addEventListener('native:noodle-disconnect', () => syncCanvasToEditor());

    // ── Pan ──

    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let panX = 0;
    let panY = 0;
    let panBaseX = 0;
    let panBaseY = 0;

    flowViewport.addEventListener('pointerdown', (e) => {
      // Pan on empty space click or middle mouse
      const target = /** @type {HTMLElement} */ (e.target);
      const isEmptySpace = target === flowArena || target === flowViewport || target === flowTransform;
      if (isEmptySpace || e.button === 1) {
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        panBaseX = panX;
        panBaseY = panY;
        flowViewport.setPointerCapture(e.pointerId);
        flowViewport.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });

    flowViewport.addEventListener('pointermove', (e) => {
      if (!isPanning) return;
      panX = panBaseX + (e.clientX - panStartX);
      panY = panBaseY + (e.clientY - panStartY);
      flowTransform.style.transform = `translate(${panX}px, ${panY}px)`;
      noodle?.update();
    });

    flowViewport.addEventListener('pointerup', () => {
      if (!isPanning) return;
      isPanning = false;
      flowViewport.style.cursor = '';
    });

    // ── Add Node on Port Hover ──

    /** @type {HTMLElement|null} */
    let addBtn = null;
    /** @type {HTMLElement|null} */
    let hoveredNode = null;
    /** @type {string|null} */
    let hoveredPort = null;

    function showAddButton(/** @type {HTMLElement} */ node, /** @type {string} */ port) {
      if (!addBtn) {
        addBtn = document.createElement('button');
        addBtn.className = 'flow-add-btn';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (hoveredNode && hoveredPort) {
            addNodeFromPort(hoveredNode, hoveredPort);
          }
          hideAddButton();
        });
      }
      let btnX = 0;
      let btnY = 0;
      if (port === 'right') {
        btnX = node.offsetLeft + node.offsetWidth + 8;
        btnY = node.offsetTop + node.offsetHeight / 2 - 10;
      } else if (port === 'left') {
        btnX = node.offsetLeft - 28;
        btnY = node.offsetTop + node.offsetHeight / 2 - 10;
      } else if (port === 'bottom') {
        btnX = node.offsetLeft + node.offsetWidth / 2 - 10;
        btnY = node.offsetTop + node.offsetHeight + 8;
      } else {
        btnX = node.offsetLeft + node.offsetWidth / 2 - 10;
        btnY = node.offsetTop - 28;
      }
      addBtn.style.left = btnX + 'px';
      addBtn.style.top = btnY + 'px';
      flowArena.appendChild(addBtn);
      hoveredNode = node;
      hoveredPort = port;
    }

    function hideAddButton() {
      if (addBtn && addBtn.parentNode) {
        addBtn.parentNode.removeChild(addBtn);
      }
      hoveredNode = null;
      hoveredPort = null;
    }

    flowArena.addEventListener('pointerenter', (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      if (!target.classList?.contains('flow-node')) return;
      const ports = (target.getAttribute('data-noodle-port') || '').split(' ');
      const port = ports[ports.length - 1];
      if (port) showAddButton(target, port);
    }, true);

    flowArena.addEventListener('pointerleave', (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      if (!target.classList?.contains('flow-node')) return;
      setTimeout(() => {
        if (addBtn && !addBtn.matches(':hover')) hideAddButton();
      }, 150);
    }, true);

    function addNodeFromPort(/** @type {HTMLElement} */ sourceNode, /** @type {string} */ sourcePort) {
      nodeCounter++;
      const id = `f-new-${nodeCounter}`;
      const intent = intents[nodeCounter % intents.length];
      const label = `Node ${nodeCounter}`;

      let x = sourceNode.offsetLeft;
      let y = sourceNode.offsetTop;
      if (sourcePort === 'right') { x += sourceNode.offsetWidth + 80; }
      else if (sourcePort === 'left') { x -= 180; }
      else if (sourcePort === 'bottom') { y += sourceNode.offsetHeight + 60; }
      else { y -= 60; }

      const node = document.createElement('div');
      node.className = 'flow-node';
      node.setAttribute('intent', intent);
      node.id = id;
      node.setAttribute('data-noodle-port', 'left right');
      node.style.cssText = `left: ${Math.max(0, x)}px; top: ${Math.max(0, y)}px;`;
      node.textContent = label;
      flowArena.appendChild(node);

      if (magnet) {
        magnet.detach();
        magnet.attach();
      }

      const fromPort = sourcePort;
      const toPort = sourcePort === 'right' ? 'left' : sourcePort === 'left' ? 'right' : sourcePort === 'bottom' ? 'top' : 'bottom';
      noodle?.connect(sourceNode.id, id, fromPort, toPort);
      noodle?.update();
      syncCanvasToEditor();
    }

    // ── JSON Editor ──

    function serializeGraph() {
      const nodes = /** @type {any[]} */ ([]);
      flowArena.querySelectorAll('.flow-node').forEach((/** @type {HTMLElement} */ el) => {
        nodes.push({
          id: el.id,
          label: el.textContent?.trim() || '',
          intent: el.getAttribute('intent') || 'neutral',
          ports: el.getAttribute('data-noodle-port') || '',
          x: Math.round(el.offsetLeft),
          y: Math.round(el.offsetTop),
        });
      });
      const connections = noodle?.getConnections() || [];
      return { nodes, connections };
    }

    function syncCanvasToEditor() {
      if (suppressCanvasSync || !editorView) return;
      suppressEditorSync = true;
      const text = JSON.stringify(serializeGraph(), null, 2);
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: text },
      });
      suppressEditorSync = false;
    }

    function syncEditorToCanvas() {
      if (suppressEditorSync || !editorView || !noodle) return;
      try {
        const data = JSON.parse(editorView.state.doc.toString());
        if (!data.nodes || !data.connections) return;

        suppressCanvasSync = true;

        const existingIds = new Set(
          Array.from(flowArena.querySelectorAll('.flow-node')).map(el => el.id)
        );
        const newIds = new Set(data.nodes.map((/** @type {any} */ n) => n.id));

        existingIds.forEach(id => {
          if (!newIds.has(id)) {
            const el = document.getElementById(id);
            if (el) el.remove();
          }
        });

        for (const n of data.nodes) {
          let el = /** @type {HTMLElement|null} */ (document.getElementById(n.id));
          if (!el) {
            el = document.createElement('div');
            el.className = 'flow-node';
            el.id = n.id;
            flowArena.appendChild(el);
          }
          el.textContent = n.label || n.id;
          el.setAttribute('intent', n.intent || 'neutral');
          el.setAttribute('data-noodle-port', n.ports || 'left right');
          el.style.left = n.x + 'px';
          el.style.top = n.y + 'px';
        }

        if (magnet) {
          magnet.detach();
          magnet.attach();
        }

        noodle.setConnections(data.connections);
        noodle.update();

        suppressCanvasSync = false;
      } catch {
        suppressCanvasSync = false;
      }
    }

    if (editorContainer) {
      const initial = JSON.stringify(serializeGraph(), null, 2);
      editorView = createEditorView(editorContainer, {
        doc: initial,
        extensions: [
          json(),
          EditorView.updateListener.of((update) => {
            if (!update.docChanged || suppressEditorSync) return;
            if (editorSyncTimer) clearTimeout(editorSyncTimer);
            editorSyncTimer = window.setTimeout(syncEditorToCanvas, 300);
          }),
        ],
      });
    }

    // ── Split Handle Resize ──

    const splitHandle = document.getElementById('flow-split-handle');
    const canvasPane = document.getElementById('flow-canvas-pane');
    if (splitHandle && canvasPane) {
      let isResizing = false;
      let startX = 0;
      let startWidth = 0;

      splitHandle.addEventListener('pointerdown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = canvasPane.offsetWidth;
        splitHandle.setPointerCapture(e.pointerId);
        document.body.style.userSelect = 'none';
        e.preventDefault();
      });

      splitHandle.addEventListener('pointermove', (e) => {
        if (!isResizing) return;
        const newWidth = Math.max(300, Math.min(startWidth + (e.clientX - startX), window.innerWidth - 200));
        canvasPane.style.width = newWidth + 'px';
        canvasPane.style.flex = 'none';
        noodle?.update();
      });

      splitHandle.addEventListener('pointerup', () => {
        isResizing = false;
        document.body.style.userSelect = '';
      });
    }
  }

  // ── Curve Styles ──

  const bezierArena = document.getElementById('style-bezier');
  if (bezierArena) {
    new NoodleController(bezierArena, {
      style: 'bezier',
      tension: 0.5,
      connections: [
        { id: 'bz1', from: 'bz-a', to: 'bz-b', fromPort: 'right', toPort: 'left' },
        { id: 'bz2', from: 'bz-b', to: 'bz-c', fromPort: 'right', toPort: 'left' },
      ],
    });
  }

  const stepArena = document.getElementById('style-step');
  if (stepArena) {
    new NoodleController(stepArena, {
      style: 'step',
      connections: [
        { id: 'st1', from: 'st-a', to: 'st-b', fromPort: 'right', toPort: 'left' },
        { id: 'st2', from: 'st-b', to: 'st-c', fromPort: 'right', toPort: 'left' },
      ],
    });
  }

  const straightArena = document.getElementById('style-straight');
  if (straightArena) {
    new NoodleController(straightArena, {
      style: 'straight',
      connections: [
        { id: 'ln1', from: 'ln-a', to: 'ln-b', fromPort: 'right', toPort: 'left' },
        { id: 'ln2', from: 'ln-b', to: 'ln-c', fromPort: 'right', toPort: 'left' },
      ],
    });
  }

  // ── Static Connections ──

  const staticArena = document.getElementById('static-arena');
  if (staticArena) {
    new NoodleController(staticArena, {
      connections: [
        { id: 'sc1', from: 's-input-a', to: 's-process', fromPort: 'right', toPort: 'left' },
        { id: 'sc2', from: 's-input-b', to: 's-process', fromPort: 'right', toPort: 'left' },
        { id: 'sc3', from: 's-process', to: 's-output', fromPort: 'right', toPort: 'left' },
      ],
    });
  }

  // ── Disabled ──

  const disabledArena = document.getElementById('disabled-arena');
  if (disabledArena) {
    new NoodleController(disabledArena, {
      disabled: true,
      connections: [
        { id: 'd1', from: 'd-input', to: 'd-process', fromPort: 'right', toPort: 'left' },
        { id: 'd2', from: 'd-process', to: 'd-output', fromPort: 'right', toPort: 'left' },
      ],
    });
  }

  // ── Event Log ──

  const logEl = document.getElementById('noodle-event-log');

  document.addEventListener('native:noodle-connect', (e) => {
    /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
    const { id, from, to, fromPort, toPort } = ce.detail;
    appendLog(logEl, `connect: ${from}:${fromPort} → ${to}:${toPort} (${id})`, 50);
  });

  document.addEventListener('native:noodle-disconnect', (e) => {
    /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
    const { id, from, to } = ce.detail;
    appendLog(logEl, `disconnect: ${from} → ${to} (${id})`, 50);
  });

  document.addEventListener('native:noodle-drag', (e) => {
    /** @type {CustomEvent} */ const ce = /** @type {any} */ (e);
    const { from, fromPort, x, y } = ce.detail;
    appendLog(logEl, `drag: ${from}:${fromPort} → (${Math.round(x)}, ${Math.round(y)})`, 50);
  });
});
