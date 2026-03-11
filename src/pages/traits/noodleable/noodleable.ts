import { NoodleController, MagnetController, PresentController } from '@nonoun/native-ui';
import { createEditorView, EditorView } from '@nonoun/native-code';
import { EditorSelection } from '@codemirror/state';
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
  /** @type {string|null} */
  let selectedNodeId: string | null = null;

  // ── Node Selection ──

  function selectNode(nodeId: string | null) {
    flowArena?.querySelectorAll('.flow-node[data-selected]').forEach(el => el.removeAttribute('data-selected'));
    selectedNodeId = nodeId;
    if (nodeId) {
      const el = document.getElementById(nodeId);
      if (el) el.setAttribute('data-selected', '');
      syncCanvasToEditor();
      highlightNodeInEditor(nodeId);
    }
  }

  function highlightNodeInEditor(nodeId: string | null) {
    if (!editorView || !nodeId) return;
    const doc = editorView.state.doc.toString();
    // Find the node's JSON block by its "id" field
    const idPattern = `"id": "${nodeId}"`;
    const idIndex = doc.indexOf(idPattern);
    if (idIndex < 0) return;
    // Walk backwards to find the opening brace
    let braceCount = 0;
    let blockStart = idIndex;
    for (let i = idIndex; i >= 0; i--) {
      if (doc[i] === '}') braceCount++;
      if (doc[i] === '{') {
        if (braceCount === 0) { blockStart = i; break; }
        braceCount--;
      }
    }
    // Walk forwards to find the closing brace
    braceCount = 0;
    let blockEnd = idIndex;
    for (let i = idIndex; i < doc.length; i++) {
      if (doc[i] === '{') braceCount++;
      if (doc[i] === '}') {
        if (braceCount === 1) { blockEnd = i + 1; break; }
        braceCount--;
      }
    }
    suppressEditorSync = true;
    editorView.dispatch({
      selection: EditorSelection.range(blockStart, blockEnd),
      scrollIntoView: true,
    });
    suppressEditorSync = false;
  }

  // ── Inline Label Editing ──

  /** @type {HTMLElement|null} */
  let editingNode: HTMLElement | null = null;

  function startEditing(node: HTMLElement) {
    if (editingNode) stopEditing(editingNode);
    editingNode = node;
    node.setAttribute('contenteditable', 'true');
    node.setAttribute('data-editing', '');
    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function stopEditing(node: HTMLElement) {
    node.removeAttribute('contenteditable');
    node.removeAttribute('data-editing');
    editingNode = null;
    syncCanvasToEditor();
  }

  if (flowArena && flowViewport && flowTransform) {
    magnet = new MagnetController(flowArena, {
      selector: '.flow-node',
      snapToEdges: false,
      snapToSiblings: false,
      threshold: 15,
      guides: false,
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

    // ── Node Selection + Inline Editing Events ──

    flowArena.addEventListener('pointerdown', (e) => {
      const target = (e.target as HTMLElement).closest('.flow-node') as HTMLElement | null;
      if (target && !target.hasAttribute('data-editing')) {
        selectNode(target.id);
      }
    });

    flowArena.addEventListener('dblclick', (e) => {
      const target = (e.target as HTMLElement).closest('.flow-node') as HTMLElement | null;
      if (target) startEditing(target);
    });

    flowArena.addEventListener('keydown', (e) => {
      if (!editingNode) return;
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        stopEditing(editingNode);
      }
    });

    flowArena.addEventListener('focusout', (e) => {
      if (!editingNode) return;
      const related = (e as FocusEvent).relatedTarget as HTMLElement | null;
      if (!related || !editingNode.contains(related)) {
        stopEditing(editingNode);
      }
    });

    // ── Snap & Guides Toggles ──

    const snapToggle = /** @type {HTMLInputElement|null} */ (document.getElementById('flow-snap-toggle'));
    const guidesToggle = /** @type {HTMLInputElement|null} */ (document.getElementById('flow-guides-toggle'));

    snapToggle?.addEventListener('native:change', () => {
      if (magnet) {
        magnet.snapToSiblings = snapToggle.checked;
        magnet.snapToEdges = snapToggle.checked;
      }
    });

    guidesToggle?.addEventListener('native:change', () => {
      if (magnet) magnet.guides = guidesToggle.checked;
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
      highlightNodeInEditor(selectedNodeId);
    });
    flowArena.addEventListener('native:magnet-drop', () => {
      noodle?.update();
      syncCanvasToEditor();
      highlightNodeInEditor(selectedNodeId);
    });

    // Keep add button attached to node during drag
    flowArena.addEventListener('pointermove', () => {
      if (flowArena.hasAttribute('magnetized')) {
        noodle?.update();
        updateAddButtonPosition();
        syncCanvasToEditor();
        highlightNodeInEditor(selectedNodeId);
      }
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
    /** @type {number|null} */
    let hideTimer = null;

    function getNodePosition(/** @type {HTMLElement} */ node) {
      let tx = 0, ty = 0;
      const translate = node.style.translate;
      if (translate) {
        const parts = translate.match(/-?[\d.]+/g);
        if (parts) { tx = parseFloat(parts[0]) || 0; ty = parseFloat(parts[1]) || 0; }
      }
      return { x: node.offsetLeft + tx, y: node.offsetTop + ty };
    }

    function showAddButton(/** @type {HTMLElement} */ node, /** @type {string} */ port) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      if (!addBtn) {
        addBtn = document.createElement('button');
        addBtn.className = 'flow-add-btn';
        addBtn.textContent = '+';
        addBtn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (hoveredNode && hoveredPort) addNodeFromPort(hoveredNode, hoveredPort);
          hideAddButton();
        });
        addBtn.addEventListener('pointerenter', () => {
          if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        });
        addBtn.addEventListener('pointerleave', () => {
          scheduleHide();
        });
      }
      const pos = getNodePosition(node);
      let btnX = 0;
      let btnY = 0;
      const btnSize = 28;
      const gap = 6;
      if (port === 'right') {
        btnX = pos.x + node.offsetWidth + gap;
        btnY = pos.y + node.offsetHeight / 2 - btnSize / 2;
      } else if (port === 'left') {
        btnX = pos.x - btnSize - gap;
        btnY = pos.y + node.offsetHeight / 2 - btnSize / 2;
      } else if (port === 'bottom') {
        btnX = pos.x + node.offsetWidth / 2 - btnSize / 2;
        btnY = pos.y + node.offsetHeight + gap;
      } else {
        btnX = pos.x + node.offsetWidth / 2 - btnSize / 2;
        btnY = pos.y - btnSize - gap;
      }
      addBtn.style.left = btnX + 'px';
      addBtn.style.top = btnY + 'px';
      if (!addBtn.parentNode) flowArena.appendChild(addBtn);
      hoveredNode = node;
      hoveredPort = port;
    }

    function updateAddButtonPosition() {
      if (hoveredNode && hoveredPort && addBtn?.parentNode) {
        const pos = getNodePosition(hoveredNode);
        const btnSize = 28;
        const gap = 6;
        let btnX = 0, btnY = 0;
        if (hoveredPort === 'right') {
          btnX = pos.x + hoveredNode.offsetWidth + gap;
          btnY = pos.y + hoveredNode.offsetHeight / 2 - btnSize / 2;
        } else if (hoveredPort === 'left') {
          btnX = pos.x - btnSize - gap;
          btnY = pos.y + hoveredNode.offsetHeight / 2 - btnSize / 2;
        } else if (hoveredPort === 'bottom') {
          btnX = pos.x + hoveredNode.offsetWidth / 2 - btnSize / 2;
          btnY = pos.y + hoveredNode.offsetHeight + gap;
        } else {
          btnX = pos.x + hoveredNode.offsetWidth / 2 - btnSize / 2;
          btnY = pos.y - btnSize - gap;
        }
        addBtn.style.left = btnX + 'px';
        addBtn.style.top = btnY + 'px';
      }
    }

    function scheduleHide() {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        hideAddButton();
      }, 300);
    }

    function hideAddButton() {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      if (addBtn?.parentNode) addBtn.parentNode.removeChild(addBtn);
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
      scheduleHide();
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
      flowArena.querySelectorAll('.flow-node').forEach((el) => {
        const htmlEl = el as HTMLElement;
        const pos = getNodePosition(htmlEl);
        nodes.push({
          id: htmlEl.id,
          label: htmlEl.textContent?.trim() || '',
          intent: htmlEl.getAttribute('intent') || 'neutral',
          ports: htmlEl.getAttribute('data-noodle-port') || '',
          x: Math.round(pos.x),
          y: Math.round(pos.y),
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

    // ── Editor Click → Canvas Pan ──

    function findNodeIdAtCursor(): string | null {
      if (!editorView) return null;
      const pos = editorView.state.selection.main.head;
      const doc = editorView.state.doc.toString();
      // Walk backwards from cursor to find enclosing `{`
      let braceCount = 0;
      let blockStart = -1;
      for (let i = pos; i >= 0; i--) {
        if (doc[i] === '}') braceCount++;
        if (doc[i] === '{') {
          if (braceCount === 0) { blockStart = i; break; }
          braceCount--;
        }
      }
      if (blockStart < 0) return null;
      // Walk forwards to find closing `}`
      braceCount = 0;
      let blockEnd = -1;
      for (let i = blockStart; i < doc.length; i++) {
        if (doc[i] === '{') braceCount++;
        if (doc[i] === '}') {
          braceCount--;
          if (braceCount === 0) { blockEnd = i + 1; break; }
        }
      }
      if (blockEnd < 0) return null;
      const block = doc.slice(blockStart, blockEnd);
      const idMatch = block.match(/"id":\s*"([^"]+)"/);
      return idMatch ? idMatch[1] : null;
    }

    function panCanvasToNode(nodeId: string) {
      if (!flowViewport || !flowTransform) return;
      const el = document.getElementById(nodeId) as HTMLElement | null;
      if (!el) return;
      const pos = getNodePosition(el);
      const vpRect = flowViewport.getBoundingClientRect();
      const vpCenterX = vpRect.width / 2;
      const vpCenterY = vpRect.height / 2;
      const nodeCenterX = pos.x + el.offsetWidth / 2 + panX;
      const nodeCenterY = pos.y + el.offsetHeight / 2 + panY;
      const distX = Math.abs(nodeCenterX - vpCenterX);
      const distY = Math.abs(nodeCenterY - vpCenterY);
      // Only pan if node is far from center (>25% of viewport)
      if (distX > vpRect.width * 0.25 || distY > vpRect.height * 0.25) {
        panX = vpCenterX - (pos.x + el.offsetWidth / 2);
        panY = vpCenterY - (pos.y + el.offsetHeight / 2);
        flowTransform.style.transition = 'transform 300ms ease';
        flowTransform.style.transform = `translate(${panX}px, ${panY}px)`;
        flowTransform.addEventListener('transitionend', () => {
          flowTransform.style.transition = '';
          noodle?.update();
        }, { once: true });
      }
      selectNode(nodeId);
    }

    if (editorContainer) {
      const initial = JSON.stringify(serializeGraph(), null, 2);
      editorView = createEditorView(editorContainer, {
        doc: initial,
        extensions: [
          json(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !suppressEditorSync) {
              if (editorSyncTimer) clearTimeout(editorSyncTimer);
              editorSyncTimer = window.setTimeout(syncEditorToCanvas, 300);
            }
            if (update.selectionSet && !suppressEditorSync) {
              const nodeId = findNodeIdAtCursor();
              if (nodeId && nodeId !== selectedNodeId) {
                panCanvasToNode(nodeId);
              }
            }
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
