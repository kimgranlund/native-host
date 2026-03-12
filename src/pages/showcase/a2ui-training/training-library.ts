// A2UI Training Library — copied from @nonoun/native-ai/src/a2ui/training-library.demo.ts
// Adapted for Astro host: npm imports, proxy API keys, astro:page-load guard.
//
// ── Changes from source ──
// 1. Registration/icon imports removed (handled by setup.ts + icons.ts)
// 2. Kernel/adapter imports → npm package paths
// 3. API key env vars → 'proxy' (host uses server-side API proxies)
// 4. All imperative code wrapped in astro:page-load with element guard
// 5. REGISTRY from npm (COMPONENT_MAP export), not local array
// 6. Pipeline imports → local copies shared with builder page
// 7. parseJsonFromResponse/stripFences → inline implementations
// 8. CSSInspectController → npm path (@nonoun/native-ui/traits)
// 9. Pattern loader → local source copy (not exported from npm)
// 10. n-editor (CodeMirror) language extensions from npm
// 11. LLMChatController → local source copy (not yet exported from @nonoun/native-ai dist)
// 12. buildLLMAdapter uses proxy adapters (ClaudeGatewayAdapter/OpenAiGatewayAdapter)
// 13. Copilot prompt → co-located copilot-prompt.json (not builder's system-prompt.json)
// 14. effect() from @nonoun/native-ui (not @nonoun/native-core)

import { Kernel, resetKernel } from '@nonoun/native-ui/kernel';
import { effect } from '@nonoun/native-ui';
import { createA2UIAdapter, COMPONENT_MAP as REGISTRY, getComponentCategory } from '@nonoun/native-ai';
import type { A2UIAdapter } from '@nonoun/native-ai';
import { ClaudeGatewayAdapter, OpenAiGatewayAdapter } from '@nonoun/native-ai/gateway';
import type { GatewayAdapter } from '@nonoun/native-ai/gateway';
import { LLMChatController } from './llm-chat-controller.ts';
import type { LLMChatMessage } from './llm-chat-controller.ts';
import { CSSInspectController } from '@nonoun/native-ui/traits';
import { PIPELINE_STEPS, runPipeline } from '../a2ui-builder/pipeline.ts';
import copilotPromptJson from './copilot-prompt.json';

// n-editor (CodeMirror)
import { json } from '@codemirror/lang-json';
import { html as htmlLang } from '@codemirror/lang-html';
import { css as cssLang } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import type { EditorView } from '@codemirror/view';

import { loadCatalog, loadPattern, initPatterns } from './patterns/pattern-loader.ts';
import type { CatalogEntry, Pattern } from './patterns/pattern-types.ts';

// ── System prompt + component reference ──

const componentRef = Array.from(REGISTRY.values())
  .map((m) => {
    const cat = getComponentCategory(m.a2uiType);
    const props = m.properties?.map((p: { attr: string }) => p.attr).join(', ') || '';
    return `  - ${m.a2uiType} → <${m.nativeTag}> [${cat}]${props ? ': ' + props : ''}`;
  })
  .join('\n');

const systemPrompt = ((copilotPromptJson as { prompt: string }).prompt ?? JSON.stringify(copilotPromptJson))
  .replace('{{COMPONENT_REF}}', componentRef);

// ── LLM adapter (proxy mode) ──

function isClaudeModel(model: string): boolean {
  return model.startsWith('claude-') || ['opus-4.6', 'sonnet-4.6', 'haiku-4.5'].includes(model);
}

function buildLLMAdapter(system: string, model: string, tokens: number, temp?: number): GatewayAdapter | null {
  if (isClaudeModel(model)) {
    return new ClaudeGatewayAdapter({
      clientId: 'tl-regen',
      baseUrl: '/api/anthropic',
      model,
      maxTokens: tokens,
      temperature: temp,
      system,
      apiKey: 'proxy',
      anthropicVersion: '2023-06-01',
    });
  }
  return new OpenAiGatewayAdapter({
    clientId: 'tl-regen',
    baseUrl: '/api/openai',
    model,
    maxTokens: tokens,
    temperature: temp,
    system,
    apiKey: 'proxy',
  });
}

// ── Inline JSON parsing (not exported from npm) ──

function stripFences(raw: string): string {
  const trimmed = raw.trim();
  const fenceStart = /^```(?:json)?\s*\n?/;
  const fenceEnd = /\n?```\s*$/;
  return trimmed.replace(fenceStart, '').replace(fenceEnd, '');
}

function parseJsonFromResponse<T = Record<string, unknown>>(raw: string): T | null {
  try {
    return JSON.parse(stripFences(raw));
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch { /* ignore */ }
    }
    return null;
  }
}

// ── Types ──

interface CopilotResponse {
  type?: string;
  reply?: string;
  schema?: { surfaceId?: string; components?: Record<string, unknown>[] };
  components?: Record<string, unknown>[];
  suggestions?: Array<{ label: string; prompt?: string; value?: string }>;
}

// ══════════════════════════════════════════════════════════════════
// Boot — wrapped in astro:page-load with element guard
// ══════════════════════════════════════════════════════════════════

document.addEventListener('astro:page-load', async () => {
  const grid = document.getElementById('pattern-grid');
  if (!grid) return; // not on this page

  // Load patterns from DB (falls back to static JSON if API unavailable)
  await initPatterns();

  // ── State ──
  const catalog = loadCatalog();
  let activeFilter: 'all' | 'micro' | 'block' = 'all';
  let activeCategory = '';
  let searchQuery = '';
  let currentPattern: Pattern | null = null;
  let originalSchema: Pattern['components'] | null = null;
  let lightboxAdapter: A2UIAdapter | null = null;
  let currentModel = 'claude-haiku-4-5';
  let temperature = 0.7;
  let maxTokens = 4096;
  let pipelineMode = false;
  let regenerating = false;
  let isDirty = false;
  let showingOriginal = false;
  let cssInspector: CSSInspectController | null = null;
  let chatController: LLMChatController | null = null;
  let chatRenderedCount = 0;
  let chatEffectCleanups: Array<() => void> = [];
  const MAX_BACKUP_VERSIONS = 10;
  const renderedCards = new Set<string>();

  // ── Pan/zoom state ──
  let panX = 0;
  let panY = 0;
  let zoom = 1;
  const ZOOM_MIN = 0.1;
  const ZOOM_MAX = 5;
  const ZOOM_STEP = 0.002;

  // ── Panel system ──
  const PANELS = [
    { id: 'preview' },
    { id: 'schema' },
    { id: 'html' },
    { id: 'css' },
    { id: 'js' },
    { id: 'insights' },
    { id: 'chat' },
  ] as const;
  type PanelId = typeof PANELS[number]['id'];
  const activePanels = new Set<PanelId>(['preview', 'schema']);
  const paneEls = new Map<PanelId, HTMLElement>();
  const chipEls = new Map<PanelId, HTMLElement>();

  // ── DOM refs ──
  const searchInput = document.getElementById('pattern-search') as HTMLElement & { value: string };
  const dialog = document.getElementById('editor-lightbox') as HTMLDialogElement;
  const lightboxPreview = document.getElementById('lightbox-preview')!;
  type NEditor = HTMLElement & { value: string; extensions: unknown[]; editorView: EditorView | null };
  const schemaEditor = document.getElementById('schema-editor') as NEditor;
  const outputPre = document.getElementById('output-pre') as NEditor;
  const cssEditor = document.getElementById('css-editor') as NEditor;
  const jsEditor = document.getElementById('js-editor') as NEditor;
  const categoryFilter = document.getElementById('category-filter') as HTMLElement & { value: string };
  const insightsWrap = document.getElementById('insights-wrap')!;
  const inspectToggleBtn = document.getElementById('inspect-toggle')!;
  const fullscreenToggleBtn = document.getElementById('fullscreen-toggle')!;
  const btnSave = document.getElementById('btn-save')!;
  const viewSelect = document.getElementById('tl-view-select') as HTMLElement & { value: string };
  const actionsMenu = document.getElementById('tl-actions-menu') as HTMLElement & { value: string };
  const compareToggle = document.getElementById('compare-toggle') as HTMLElement & { value: string };
  const chatToggle = document.getElementById('chat-toggle')!;
  const chatFeed = document.getElementById('chat-feed')!;
  const chatComposer = document.getElementById('chat-composer') as HTMLElement & { busy: boolean };
  const chatModelPicker = document.getElementById('chat-model-picker') as HTMLElement & { value: string };
  const btnCenter = document.getElementById('btn-center')!;
  const btnResetZoom = document.getElementById('btn-reset-zoom')!;

  // Create canvas wrapper for pan/zoom inside the preview mount
  const canvas = document.createElement('div');
  canvas.className = 'tl-canvas';
  lightboxPreview.appendChild(canvas);

  // Collect pane and chip elements
  for (const p of PANELS) {
    const id = p.id;
    const pane = dialog.querySelector<HTMLElement>(`n-pane[data-panel-id="${id}"]`);
    if (pane) paneEls.set(id, pane);
    const chip = dialog.querySelector<HTMLElement>(`n-button[data-chip="${id}"]`);
    if (chip) chipEls.set(id, chip);
  }

  // Set language modes on editors after CE upgrade
  customElements.whenDefined('n-editor').then(() => {
    schemaEditor.extensions = [json()];
    outputPre.extensions = [htmlLang()];
    cssEditor.extensions = [cssLang()];
    jsEditor.extensions = [javascript()];
  });

  // ── Kernel ──
  resetKernel();
  const kernel = new Kernel({ allowUnregistered: true });

  // ── Helpers ──

  function flattenComponents(comps: Record<string, unknown>[]): Record<string, unknown>[] {
    return comps.map((c) => {
      if (c.properties && typeof c.properties === 'object' && !Array.isArray(c.properties)) {
        const { properties, ...rest } = c;
        return { ...rest, ...(properties as Record<string, unknown>) };
      }
      return c;
    });
  }

  /** Update dirty state. */
  function setDirty(dirty: boolean): void {
    isDirty = dirty;
  }

  // ── Pan/zoom ──

  function applyTransform(): void {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  }

  function resetPanZoom(): void {
    panX = 0;
    panY = 0;
    zoom = 1;
    applyTransform();
  }

  function centerContents(): void {
    const mountRect = lightboxPreview.getBoundingClientRect();
    const canvasW = lightboxPreview.clientWidth;
    const canvasH = lightboxPreview.clientHeight;
    panX = (mountRect.width - canvasW * zoom) / 2;
    panY = (mountRect.height - canvasH * zoom) / 2;
    applyTransform();
  }

  function resetZoom(): void {
    const mountRect = lightboxPreview.getBoundingClientRect();
    const cx = mountRect.width / 2;
    const cy = mountRect.height / 2;
    const oldZoom = zoom;
    zoom = 1;
    panX = cx - (cx - panX) * (zoom / oldZoom);
    panY = cy - (cy - panY) * (zoom / oldZoom);
    applyTransform();
  }

  let panState: { pointerId: number; startX: number; startY: number; startPanX: number; startPanY: number } | null = null;

  function onPanPointerDown(e: PointerEvent): void {
    // Only primary button (left click)
    if (e.button !== 0) return;

    // Option held → element inspection, not pan
    if (e.altKey) return;

    // CSS Inspector active → let inspector handle drag-to-rotate
    if (cssInspector) return;

    // Pane resize active → let n-panes handle the drag
    if ((e.target as HTMLElement).closest('n-panes[data-resizing]')) return;

    // Only pan when clicking directly on the preview mount or inside the canvas
    const target = e.target as HTMLElement;
    if (target !== lightboxPreview && target !== canvas && !canvas.contains(target)) return;

    // Don't pan when clicking a2ui Card content — let normal interactions through
    if (target.closest('[data-a2ui="Card"]')) return;

    // Don't pan when clicking floating toolbar controls
    if (target.closest('.tl-floating-top') || target.closest('.tl-floating-bottom')) return;

    e.preventDefault();
    lightboxPreview.setPointerCapture(e.pointerId);
    lightboxPreview.setAttribute('data-panning', '');
    panState = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: panX,
      startPanY: panY,
    };
  }

  function onPanPointerMove(e: PointerEvent): void {
    if (!panState || e.pointerId !== panState.pointerId) return;
    panX = panState.startPanX + (e.clientX - panState.startX);
    panY = panState.startPanY + (e.clientY - panState.startY);
    applyTransform();
  }

  function onPanPointerUp(e: PointerEvent): void {
    if (!panState || e.pointerId !== panState.pointerId) return;
    try { lightboxPreview.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    lightboxPreview.removeAttribute('data-panning');
    panState = null;
  }

  function onWheelZoom(e: WheelEvent): void {
    e.preventDefault();
    const rect = lightboxPreview.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const oldZoom = zoom;
    const delta = -e.deltaY * ZOOM_STEP;
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom * (1 + delta)));

    const scale = zoom / oldZoom;
    panX = px - (px - panX) * scale;
    panY = py - (py - panY) * scale;
    applyTransform();
  }

  // ── Panel system ──

  /** Sync DOM visibility of all panes and chip active states. */
  function syncPanels(): void {
    // Clear inline flex so CSS defaults redistribute
    for (const [_, el] of paneEls) el.style.removeProperty('flex');
    for (const [id, el] of paneEls) el.hidden = !activePanels.has(id);
    for (const [id, chip] of chipEls) chip.setAttribute('variant', activePanels.has(id) ? 'selected' : 'ghost');
    chatToggle.setAttribute('variant', activePanels.has('chat') ? 'selected' : 'ghost');
  }

  /** Ensure a panel is visible. */
  function showPanel(id: PanelId): void {
    activePanels.add(id);
    syncPanels();
  }

  /** Which editor panel is currently visible (first match from active set)? */
  function activeEditorPanel(): PanelId {
    for (const id of ['schema', 'html', 'css', 'js'] as const) {
      if (activePanels.has(id)) return id;
    }
    return 'schema';
  }

  // ══════════════════════════════════════════════════════════════════
  // Grid Rendering
  // ══════════════════════════════════════════════════════════════════

  function getFilteredPatterns(): CatalogEntry[] {
    const q = searchQuery.toLowerCase();
    return catalog.patterns.filter((p) => {
      if (activeFilter !== 'all' && p.tier !== activeFilter) return false;
      if (activeCategory && p.category !== activeCategory) return false;
      if (q && !p.label.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderGrid(): void {
    const entries = getFilteredPatterns();
    searchInput.setAttribute('placeholder', `${entries.length} pattern${entries.length !== 1 ? 's' : ''}`);
    renderedCards.clear();
    grid.innerHTML = '';

    for (const entry of entries) {
      const card = document.createElement('n-container');
      card.setAttribute('bordered', '');
      card.className = 'tl-card';
      card.dataset.patternId = entry.id;

      card.innerHTML = `
        <n-body padding="none" class="tl-card-preview"><div id="card-preview-${entry.id}" inert></div></n-body>
        <n-footer class="tl-card-meta">
          <div slot="content">
            <span class="tl-card-label">${entry.label}</span>
            <span class="tl-card-badge" data-tier="${entry.tier}">${entry.tier}</span>
            <span class="tl-card-badge" data-category>${entry.category}</span>
          </div>
        </n-footer>
      `;

      grid.appendChild(card);
    }

    observeCards();
  }

  // ── Lazy rendering with IntersectionObserver ──

  let observer: IntersectionObserver | null = null;

  function observeCards(): void {
    observer?.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => (e.target as HTMLElement).dataset.patternId!)
          .filter((id) => !renderedCards.has(id));

        if (visible.length) renderBatch(visible);
      },
      { rootMargin: '200px' },
    );

    grid.querySelectorAll('n-container.tl-card').forEach((card) => observer!.observe(card));
  }

  async function renderBatch(ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i += 6) {
      const batch = ids.slice(i, i + 6);
      await Promise.all(batch.map(renderCardPreview));
      if (i + 6 < ids.length) {
        await new Promise((r) => requestAnimationFrame(r));
      }
    }
  }

  async function renderCardPreview(id: string): Promise<void> {
    if (renderedCards.has(id)) return;
    renderedCards.add(id);

    const mount = document.getElementById(`card-preview-${id}`);
    if (!mount) return;

    try {
      const pattern = await loadPattern(id);
      if (!pattern) return;

      const flat = flattenComponents(pattern.components as Record<string, unknown>[]);
      const adapter = createA2UIAdapter(kernel, {});
      adapter.receive(
        { updateComponents: { surfaceId: `card-${id}`, components: flat } },
        mount,
      );
    } catch {
      mount.textContent = '⚠ Render failed';
    }
  }

  /** Re-render a single card's preview tile on the grid (e.g. after save). */
  function refreshCardPreview(id: string, components: Record<string, unknown>[]): void {
    const mount = document.getElementById(`card-preview-${id}`);
    if (!mount) return;
    try {
      mount.innerHTML = '';
      const flat = flattenComponents(components);
      const adapter = createA2UIAdapter(kernel, {});
      adapter.receive(
        { updateComponents: { surfaceId: `card-${id}`, components: flat } },
        mount,
      );
    } catch {
      mount.textContent = '\u26A0 Render failed';
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Filters
  // ══════════════════════════════════════════════════════════════════

  function onFilterChange(filter: string): void {
    activeFilter = filter as 'all' | 'micro' | 'block';
    document.querySelectorAll('[data-filter]').forEach((btn) => {
      const isActive = btn.getAttribute('data-filter') === filter;
      btn.setAttribute('variant', isActive ? 'primary' : 'ghost');
      if (isActive) btn.setAttribute('intent', 'accent');
      else btn.removeAttribute('intent');
    });
    renderGrid();
  }

  function onCategoryChange(category: string): void {
    activeCategory = category;
    renderGrid();
  }

  function onSearchInput(value: string): void {
    searchQuery = value;
    renderGrid();
  }

  function populateCategoryFilter(): void {
    const listbox = categoryFilter.querySelector('n-listbox');
    if (!listbox) return;
    for (const cat of Object.keys(catalog.categories).sort()) {
      const option = document.createElement('n-option');
      option.setAttribute('value', cat);
      option.textContent = cat;
      listbox.appendChild(option);
    }
  }

  /** Populate the view select with all pattern entries. */
  function populateViewSelect(): void {
    const listbox = viewSelect.querySelector('n-listbox');
    if (!listbox) return;
    for (const entry of catalog.patterns) {
      const option = document.createElement('n-option');
      option.setAttribute('value', entry.id);
      option.textContent = entry.label;
      listbox.appendChild(option);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Lightbox
  // ══════════════════════════════════════════════════════════════════

  async function openLightbox(id: string): Promise<void> {
    let pattern = await loadPattern(id);
    if (!pattern) return;

    // Load saved version from localStorage if present
    const saved = localStorage.getItem(`tl-pattern-${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Pattern;
        if (parsed.components) pattern = parsed;
      } catch { /* ignore corrupt data */ }
    }

    currentPattern = pattern;
    originalSchema = structuredClone(pattern.components);

    // Sync view select to current pattern
    viewSelect.value = id;

    // Apply recommended temperature from pattern (reset to default if absent)
    temperature = pattern.temperature ?? 0.7;

    // Schema editor
    schemaEditor.value = JSON.stringify(pattern, null, 2);

    // Render preview + reset canvas transform
    resetPanZoom();
    renderLightboxPreview(pattern.components as Record<string, unknown>[]);

    // Reset state
    setDirty(false);
    showingOriginal = false;
    compareToggle.value = 'edited';
    lightboxPreview.removeAttribute('data-compare');

    // Create LLM chat controller bound to this pattern
    chatController?.destroy();
    chatRenderedCount = 0;
    chatFeed.innerHTML = '';
    chatController = new LLMChatController({
      systemPrompt,
      model: currentModel,
      createAdapter: (system, _model, tokens) => buildLLMAdapter(system, currentModel, tokens, temperature),
      contexts: [{
        id: 'pattern-schema',
        label: pattern.label,
        element: canvas,
        read: () => {
          const schema = JSON.stringify(currentPattern, null, 2);
          const html = canvas.innerHTML;
          return `Schema:\n${schema}\n\nRendered HTML:\n${html}`;
        },
        apply: (output) => {
          try {
            const parsed = parseJsonFromResponse<CopilotResponse>(output);
            const components = parsed?.schema?.components ?? parsed?.components;
            if (components) applyRegenResult(components as Record<string, unknown>[]);
          } catch { /* onComplete handles reply/seeds */ }
        },
        systemPromptFragment: `Pattern: "${pattern.label}" (${pattern.tier} tier)\nRespond with valid JSON containing a "components" array.`,
        icon: 'brackets-curly',
      }],
      onStream: (() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        let lastComponentCount = 0;
        return (fullMessage: string) => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            try {
              const parsed = parseJsonFromResponse<CopilotResponse>(fullMessage);
              const components = parsed?.schema?.components ?? parsed?.components;
              if (components?.length && components.length !== lastComponentCount) {
                lastComponentCount = components.length;
                applyRegenResult(components as Record<string, unknown>[]);
              }
            } catch { /* partial JSON not yet parseable */ }
          }, 300);
        };
      })(),
      onComplete: (finalMessage) => {
        try {
          const parsed = parseJsonFromResponse<CopilotResponse>(finalMessage);
          if (parsed?.reply && chatController) {
            const msgs = [...chatController.messages.value];
            const last = msgs[msgs.length - 1];
            if (last?.role === 'assistant') {
              msgs[msgs.length - 1] = { ...last, content: parsed.reply };
              chatController.messages.value = msgs;
            }
          }
          if (parsed?.suggestions?.length) {
            renderChatSeeds(parsed.suggestions);
          }
        } catch { /* not structured JSON — leave raw content */ }
      },
    });
    bindChatController(chatController);

    // Ensure default panels are open
    activePanels.add('preview');
    activePanels.add('schema');
    syncPanels();

    dialog.showModal();
    // Prevent showModal from auto-focusing a child element (e.g. n-select, n-editor)
    (document.activeElement as HTMLElement | null)?.blur();
  }

  function renderLightboxPreview(components: Record<string, unknown>[]): void {
    // Tear down inspector before destroying artifact DOM
    if (cssInspector) dismissInspector();
    lightboxAdapter?.destroy();
    canvas.innerHTML = '';

    const flat = flattenComponents(components);
    lightboxAdapter = createA2UIAdapter(kernel, {});
    lightboxAdapter.receive(
      { updateComponents: { surfaceId: 'lightbox', components: flat } },
      canvas,
    );

    // Update output tab
    requestAnimationFrame(() => {
      outputPre.value = formatHtml(canvas.innerHTML);
    });
  }

  /** Indent HTML for legibility — lightweight, no external deps. */
  function formatHtml(raw: string): string {
    const tokens = raw.replace(/></g, '>\n<').split('\n');
    let indent = 0;
    const lines: string[] = [];
    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      const isClosing = /^<\//.test(trimmed);
      const isSelfClosing = /\/>$/.test(trimmed) || /^<(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)\b/i.test(trimmed);
      if (isClosing) indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + trimmed);
      if (!isClosing && !isSelfClosing && /^<[a-z]/i.test(trimmed)) indent++;
    }
    return lines.join('\n');
  }

  let inspectorObserver: MutationObserver | null = null;

  /** Option+hover on the inspector clone — mirrors onOptionHover but operates on
   *  the popover clone (which lives outside the canvas). */
  function onInspectorOptionHover(e: PointerEvent): void {
    if (!e.altKey) { clearOptionHover(); return; }
    const target = (e.target as HTMLElement).closest('[id]') as HTMLElement | null;
    const current = document.querySelector('[data-option-hover]');
    if (target === current) return;
    clearOptionHover();
    if (target) {
      target.setAttribute('data-option-hover', '');
    }
  }

  /** Option+click on the inspector clone — mirrors onPreviewClick but operates
   *  on the popover clone. Falls through to the inspector's own #select for
   *  the 3D highlight; this adds the editor bridge on top. */
  function onInspectorOptionClick(e: Event): void {
    if (!(e as MouseEvent).altKey) return;
    const target = e.target as HTMLElement;
    clearHighlights();
    clearOptionHover();

    const el = target.closest('[id]') as HTMLElement | null;
    if (!el) return;
    const clickedId = el.id;

    el.setAttribute('data-highlight', '');

    const tab = activeEditorPanel();
    if (tab === 'schema' && highlightInSchema(clickedId)) return;
    if (tab === 'html' && highlightInOutput(clickedId)) return;
    if (highlightInSchema(clickedId)) { showPanel('schema'); return; }
    if (highlightInOutput(clickedId)) { showPanel('html'); return; }
  }

  /** Bridge inspector selection → editor highlighting.
   *  When the user clicks a layer in the 3D inspector, find its `id`
   *  and scroll the corresponding Schema / HTML / CSS editor to that section.
   *  Also wires Option+hover/click on the clone for the same interaction
   *  pattern as the non-inspector canvas. */
  function bridgeInspectorSelection(): void {
    inspectorObserver?.disconnect();
    if (!cssInspector?.active) return;

    const root = cssInspector.inspectRoot;

    // Wire Option+hover/click on the clone
    root.addEventListener('pointermove', onInspectorOptionHover);
    root.addEventListener('click', onInspectorOptionClick);

    inspectorObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName !== 'inspect-selected') continue;
        const el = m.target as HTMLElement;
        if (!el.hasAttribute('inspect-selected')) continue;
        // Walk up to nearest [id] — the selected layer may be a deep child without one
        const idEl = el.closest('[id]') as HTMLElement | null;
        const id = idEl?.id;
        if (!id) continue;

        clearHighlights();
        const tab = activeEditorPanel();
        if (tab === 'schema') highlightInSchema(id);
        else if (tab === 'html') highlightInOutput(id);
        else {
          if (!highlightInSchema(id)) highlightInOutput(id);
        }
        break;
      }
    });

    inspectorObserver.observe(root, {
      attributes: true,
      attributeFilter: ['inspect-selected'],
      subtree: true,
    });
  }

  function dismissInspector(): void {
    inspectorObserver?.disconnect();
    inspectorObserver = null;
    // Null the reference BEFORE dismiss — dismiss synchronously dispatches native:inspect
    // which the canvas event handler checks. If cssInspector is still set, it double-cleans.
    const inspector = cssInspector;
    cssInspector = null;
    if (inspector) {
      inspector.dismiss();
      inspector.destroy();
    }
    inspectToggleBtn.setAttribute('variant', 'ghost');
  }

  // ── Schema editor live update ──

  let schemaDebounce: ReturnType<typeof setTimeout> | undefined;

  function onSchemaInput(): void {
    clearTimeout(schemaDebounce);
    schemaDebounce = setTimeout(() => {
      try {
        const parsed = JSON.parse(schemaEditor.value);
        const components = parsed.components ?? parsed;
        if (Array.isArray(components)) {
          renderLightboxPreview(components as Record<string, unknown>[]);
          if (currentPattern) {
            currentPattern = { ...currentPattern, components };
            setDirty(true);
          }
          // Exit compare mode on edit
          if (showingOriginal) {
            showingOriginal = false;
            compareToggle.value = 'edited';
            lightboxPreview.removeAttribute('data-compare');
          }
        }
      } catch {
        // Invalid JSON — ignore
      }
    }, 500);
  }

  // ── DOM ↔ Schema bidirectional highlighting ──

  function clearHighlights(): void {
    // Global query — highlights can live on canvas OR inspector popover clone
    document.querySelectorAll('[data-highlight]').forEach((el) => {
      el.removeAttribute('data-highlight');
    });
  }

  function clearOptionHover(): void {
    document.querySelectorAll('[data-option-hover]').forEach((el) => {
      el.removeAttribute('data-option-hover');
    });
  }

  /** Option+hover: highlight the element under the cursor. */
  function onOptionHover(e: PointerEvent): void {
    if (!e.altKey) { clearOptionHover(); return; }
    const target = (e.target as HTMLElement).closest('[id]') as HTMLElement | null;
    const current = canvas.querySelector('[data-option-hover]');
    if (target === current) return;
    clearOptionHover();
    if (target && target !== canvas && target !== lightboxPreview) {
      target.setAttribute('data-option-hover', '');
    }
  }

  /** Select a range in a CodeMirror editor and scroll it into view. */
  function selectRange(editor: NEditor, from: number, to: number): void {
    const view = editor.editorView;
    if (!view) return;
    view.dispatch({ selection: { anchor: from, head: to }, scrollIntoView: true });
    view.focus();
  }

  /**
   * Find the enclosing JSON object boundaries for a `"id": "value"` match.
   * Walks outward from the match position counting braces to find `{…}`.
   */
  function findEnclosingObject(text: string, matchPos: number): { from: number; to: number } | null {
    let depth = 0;
    let from = matchPos;
    for (let i = matchPos; i >= 0; i--) {
      if (text[i] === '}') depth++;
      if (text[i] === '{') {
        if (depth === 0) { from = i; break; }
        depth--;
      }
    }
    depth = 0;
    let to = matchPos;
    for (let i = matchPos; i < text.length; i++) {
      if (text[i] === '{') depth++;
      if (text[i] === '}') {
        if (depth === 1) { to = i + 1; break; }
        depth--;
      }
    }
    return { from, to };
  }

  /** Find an HTML element's opening tag in formatted HTML text. */
  function findHtmlTag(text: string, id: string): { from: number; to: number } | null {
    const pattern = new RegExp(`id=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
    const match = pattern.exec(text);
    if (!match) return null;
    let from = match.index;
    for (let i = match.index; i >= 0; i--) {
      if (text[i] === '<') { from = i; break; }
    }
    let to = match.index + match[0].length;
    for (let i = to; i < text.length; i++) {
      if (text[i] === '>') { to = i + 1; break; }
    }
    return { from, to };
  }

  /** Try to select the clicked id in the schema editor. Returns true on match. */
  function highlightInSchema(clickedId: string): boolean {
    const text = schemaEditor.value;
    const pattern = new RegExp(`"id"\\s*:\\s*"${clickedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
    const match = pattern.exec(text);
    if (!match) return false;
    const obj = findEnclosingObject(text, match.index);
    if (!obj) return false;
    selectRange(schemaEditor, obj.from, obj.to);
    return true;
  }

  /** Try to select the clicked id in the output HTML editor. Returns true on match. */
  function highlightInOutput(clickedId: string): boolean {
    const text = outputPre.value;
    const tag = findHtmlTag(text, clickedId);
    if (!tag) return false;
    selectRange(outputPre, tag.from, tag.to);
    return true;
  }

  /** Preview → editor: Option+click selects element and highlights in the editor. */
  function onPreviewClick(e: Event): void {
    if (!(e as MouseEvent).altKey) return;
    const target = e.target as HTMLElement;
    clearHighlights();
    clearOptionHover();

    const el = target.closest('[id]') as HTMLElement | null;
    if (!el || el === lightboxPreview || el === canvas) return;
    const clickedId = el.id;

    el.setAttribute('data-highlight', '');

    const panel = activeEditorPanel();

    // If already on a highlightable panel, try that first
    if (panel === 'schema' && highlightInSchema(clickedId)) return;
    if (panel === 'html' && highlightInOutput(clickedId)) return;

    // Fall back to whichever editor has a match
    if (highlightInSchema(clickedId)) { showPanel('schema'); return; }
    if (highlightInOutput(clickedId)) { showPanel('html'); return; }
  }

  // ══════════════════════════════════════════════════════════════════
  // Insights Pane
  // ══════════════════════════════════════════════════════════════════

  let insightCounter = 0;
  const insightEntries = new Map<string, HTMLElement>();

  function clearInsights(): void {
    insightsWrap.innerHTML = '';
    insightCounter = 0;
    insightEntries.clear();
  }

  function appendInsightEntry(label: string, stepId?: string): HTMLElement {
    insightCounter++;
    const entry = document.createElement('div');
    entry.className = 'tl-insight-entry';

    const header = document.createElement('div');
    header.className = 'tl-insight-header';
    const num = document.createElement('span');
    num.className = 'tl-insight-num';
    num.textContent = `#${insightCounter}`;
    header.appendChild(num);
    const title = document.createElement('span');
    title.className = 'tl-insight-label';
    title.textContent = label;
    header.appendChild(title);
    entry.appendChild(header);

    insightsWrap.appendChild(entry);
    insightsWrap.scrollTop = insightsWrap.scrollHeight;

    if (stepId) insightEntries.set(stepId, entry);
    return entry;
  }

  function appendInsightText(parent: HTMLElement, text: string, muted = false): void {
    const el = document.createElement('span');
    el.className = 'tl-insight-text';
    if (muted) el.setAttribute('data-muted', '');
    el.textContent = text;
    parent.appendChild(el);
  }

  function appendInsightBadges(parent: HTMLElement, items: string[], intent?: string): void {
    const wrap = document.createElement('div');
    wrap.className = 'tl-insight-badges';
    for (const item of items) {
      const badge = document.createElement('n-badge');
      if (intent) badge.setAttribute('intent', intent);
      badge.textContent = item;
      wrap.appendChild(badge);
    }
    parent.appendChild(wrap);
  }

  function appendInsightPlaceholder(entry: HTMLElement, stepLabel: string): HTMLElement {
    const placeholder = document.createElement('span');
    placeholder.className = 'tl-insight-placeholder';
    placeholder.textContent = `[Reasoning state: ${stepLabel}]`;
    entry.appendChild(placeholder);
    return placeholder;
  }

  function appendInterpretation(entry: HTMLElement, output: string): void {
    entry.querySelector('.tl-insight-placeholder')?.remove();
    try {
      const data = JSON.parse(stripFences(output));
      if (data.intent) appendInsightText(entry, data.intent);
      const meta: string[] = [];
      if (data.uiKind) meta.push(data.uiKind);
      if (meta.length) appendInsightBadges(entry, meta);
      if (data.assumptions?.length) {
        for (const a of data.assumptions) appendInsightText(entry, `→ ${a}`, true);
      }
    } catch {
      appendInsightText(entry, output.slice(0, 300), true);
    }
  }

  function appendConcepts(entry: HTMLElement, output: string): void {
    entry.querySelector('.tl-insight-placeholder')?.remove();
    try {
      const data = JSON.parse(stripFences(output));
      for (const c of data.concepts ?? []) {
        const item = document.createElement('div');
        item.className = 'tl-insight-concept';
        const name = document.createElement('span');
        name.className = 'tl-insight-concept-name';
        name.textContent = c.pattern;
        item.appendChild(name);
        if (c.rationale) appendInsightText(item, c.rationale, true);
        entry.appendChild(item);
      }
      if (data.interactions?.length) {
        appendInsightBadges(entry, data.interactions, 'accent');
      }
      if (data.dataFlow) appendInsightText(entry, data.dataFlow);
      if (data.stateModel) appendInsightText(entry, data.stateModel, true);
    } catch {
      appendInsightText(entry, output.slice(0, 300), true);
    }
  }

  function appendPlan(entry: HTMLElement, output: string): void {
    entry.querySelector('.tl-insight-placeholder')?.remove();
    try {
      const data = JSON.parse(stripFences(output));
      if (data.layout) appendInsightText(entry, data.layout);
      if (data.hierarchy) appendInsightText(entry, data.hierarchy, true);
      const traits = data.traits ?? [];
      if (traits.length) appendInsightBadges(entry, traits);
      const notes: string[] = [];
      if (data.cssNeeded && data.cssNotes) notes.push(`CSS: ${data.cssNotes}`);
      if (data.jsNeeded && data.jsNotes) notes.push(`JS: ${data.jsNotes}`);
      for (const n of notes) appendInsightText(entry, n, true);
    } catch {
      appendInsightText(entry, output.slice(0, 300), true);
    }
  }

  function appendConstruct(entry: HTMLElement, _output: string): void {
    entry.querySelector('.tl-insight-placeholder')?.remove();
    appendInsightText(entry, 'Schema constructed — see Schema tab for full output.');
  }

  // ══════════════════════════════════════════════════════════════════
  // LLM Regeneration
  // ══════════════════════════════════════════════════════════════════

  async function handleRegenerate(): Promise<void> {
    if (!currentPattern || regenerating) return;
    regenerating = true;

    const query = `Regenerate this UI pattern with improved structure and styling.

Pattern: ${currentPattern.label}
Tier: ${currentPattern.tier}
Category: ${currentPattern.category}
Description: ${currentPattern.description}

Current schema:
${JSON.stringify({ surfaceId: 'lightbox', components: currentPattern.components }, null, 2)}`;

    try {
      if (pipelineMode) {
        await regeneratePipeline(query);
      } else {
        await regenerateDirect(query);
      }
    } catch (err) {
      console.error('Regeneration failed:', err);
    } finally {
      regenerating = false;
    }
  }

  async function regenerateDirect(query: string): Promise<void> {
    const adapter = buildLLMAdapter(systemPrompt, currentModel, maxTokens, temperature);
    if (!adapter) {
      schemaEditor.value = '// No API key configured.';
      return;
    }

    const now = Date.now();
    const response = await adapter.sendMessage({
      id: crypto.randomUUID(),
      messages: [],
      query,
      datetime: now,
    });

    if (!response?.message) return;

    const parsed = parseJsonFromResponse(response.message);
    if (parsed?.schema && (parsed.schema as Record<string, unknown>).components) {
      applyRegenResult((parsed.schema as Record<string, unknown>).components as Record<string, unknown>[]);
    } else if (parsed?.components) {
      applyRegenResult(parsed.components as Record<string, unknown>[]);
    }
  }

  async function regeneratePipeline(query: string): Promise<void> {
    clearInsights();
    showPanel('insights');

    const ctx = {
      query,
      currentSchema: currentPattern
        ? { surfaceId: 'lightbox', components: currentPattern.components }
        : null,
      componentRef,
      conversationHistory: [] as Array<{ role: string; message: string }>,
    };

    const stepLabels: Record<string, string> = {
      interpret: 'Interpretation',
      concepts: 'Concept Mapping',
      plan: 'Planning',
      construct: 'Constructing',
    };

    const callbacks = {
      onStepStart(step: (typeof PIPELINE_STEPS)[number], _idx: number) {
        const entry = appendInsightEntry(stepLabels[step.id] ?? step.label, step.id);
        appendInsightPlaceholder(entry, step.activeLabel);
      },
      onStepComplete(step: (typeof PIPELINE_STEPS)[number], _idx: number, output: string) {
        const entry = insightEntries.get(step.id);
        if (!entry) return;
        if (step.id === 'interpret') appendInterpretation(entry, output);
        else if (step.id === 'concepts') appendConcepts(entry, output);
        else if (step.id === 'plan') appendPlan(entry, output);
        else if (step.id === 'construct') appendConstruct(entry, output);
      },
      onStreamChunk(_delta: string, fullMessage: string) {
        schemaEditor.value = fullMessage;
      },
      onError(step: (typeof PIPELINE_STEPS)[number], _idx: number, error: Error) {
        const entry = insightEntries.get(step.id);
        if (entry) {
          entry.querySelector('.tl-insight-placeholder')?.remove();
          appendInsightText(entry, `Error: ${error.message}`, true);
        }
        schemaEditor.value = `// Error in ${step.label}: ${error.message}`;
      },
    };

    const buildStepAdapter = (system: string, tokens: number) =>
      buildLLMAdapter(system, currentModel, tokens, temperature);

    const result = await runPipeline(ctx, callbacks, buildStepAdapter, systemPrompt);

    const parsed = parseJsonFromResponse(result.raw);
    if (parsed?.schema && (parsed.schema as Record<string, unknown>).components) {
      applyRegenResult((parsed.schema as Record<string, unknown>).components as Record<string, unknown>[]);
    }
  }

  function applyRegenResult(components: Record<string, unknown>[]): void {
    if (!currentPattern) return;
    currentPattern = { ...currentPattern, components: components as Pattern['components'] };
    schemaEditor.value = JSON.stringify(currentPattern, null, 2);
    renderLightboxPreview(components);
    setDirty(true);
    showPanel('schema');
  }

  // ══════════════════════════════════════════════════════════════════
  // CRUD — Reset, Download, Save
  // ══════════════════════════════════════════════════════════════════

  function handleReset(): void {
    if (!currentPattern || !originalSchema) return;
    currentPattern = { ...currentPattern, components: structuredClone(originalSchema) };
    schemaEditor.value = JSON.stringify(currentPattern, null, 2);
    renderLightboxPreview(originalSchema as Record<string, unknown>[]);
    setDirty(false);
    // Exit compare mode
    if (showingOriginal) {
      showingOriginal = false;
      compareToggle.value = 'edited';
      lightboxPreview.removeAttribute('data-compare');
    }
  }

  function handleExportJson(): void {
    if (!currentPattern) return;
    const blob = new Blob([JSON.stringify(currentPattern, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPattern.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDuplicate(): void {
    if (!currentPattern) return;
    const dup = structuredClone(currentPattern);
    dup.id = `${dup.id}-copy`;
    dup.label = `${dup.label} (Copy)`;
    schemaEditor.value = JSON.stringify(dup, null, 2);
    currentPattern = dup;
    setDirty(true);
  }

  function backupPatternVersion(id: string): void {
    const existing = localStorage.getItem(`tl-pattern-${id}`);
    if (!existing) return;
    const key = `tl-pattern-${id}-backups`;
    let backups: string[] = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) backups = JSON.parse(raw) as string[];
    } catch { /* corrupt — start fresh */ }
    backups.push(existing);
    if (backups.length > MAX_BACKUP_VERSIONS) {
      backups = backups.slice(backups.length - MAX_BACKUP_VERSIONS);
    }
    localStorage.setItem(key, JSON.stringify(backups));
  }

  function handleSave(): void {
    if (!currentPattern || !isDirty) return;
    backupPatternVersion(currentPattern.id);
    localStorage.setItem(`tl-pattern-${currentPattern.id}`, JSON.stringify(currentPattern));
    setDirty(false);
    // Flash confirmation on save button
    btnSave.setAttribute('intent', 'success');
    setTimeout(() => btnSave.removeAttribute('intent'), 1200);
    // Update the card preview tile on the grid
    refreshCardPreview(currentPattern.id, currentPattern.components as Record<string, unknown>[]);
  }

  // ══════════════════════════════════════════════════════════════════
  // Before / After Compare
  // ══════════════════════════════════════════════════════════════════

  function setCompareMode(mode: 'edited' | 'original'): void {
    if (!currentPattern || !originalSchema) return;
    showingOriginal = mode === 'original';
    compareToggle.value = mode;

    if (showingOriginal) {
      lightboxPreview.setAttribute('data-compare', 'original');
      renderLightboxPreview(originalSchema as Record<string, unknown>[]);
    } else {
      lightboxPreview.removeAttribute('data-compare');
      renderLightboxPreview(currentPattern.components as Record<string, unknown>[]);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Event Wiring
  // ══════════════════════════════════════════════════════════════════

  // Filter chips
  document.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('pointerup', () => {
      onFilterChange(btn.getAttribute('data-filter')!);
    });
  });

  // Category filter
  categoryFilter.addEventListener('native:change', () => {
    onCategoryChange(categoryFilter.value);
  });

  // Keyword search
  searchInput.addEventListener('native:input', () => {
    onSearchInput(searchInput.value);
  });

  // Card clicks (delegated)
  grid.addEventListener('pointerup', (e) => {
    const card = (e.target as HTMLElement).closest('.tl-card') as HTMLElement | null;
    if (card?.dataset.patternId) openLightbox(card.dataset.patternId);
  });

  // Lightbox close (Escape key / backdrop)
  dialog.addEventListener('close', () => {
    dismissInspector();
    chatEffectCleanups.forEach((fn) => fn());
    chatEffectCleanups = [];
    chatController?.destroy();
    chatController = null;
    chatRenderedCount = 0;
    chatFeed.innerHTML = '';
    // Reset panels to default state
    activePanels.clear();
    activePanels.add('preview');
    activePanels.add('schema');
    syncPanels();
    dialog.removeAttribute('data-fullscreen');
    fullscreenToggleBtn.setAttribute('variant', 'ghost');
    fullscreenToggleBtn.querySelector('n-icon')!.setAttribute('name', 'arrows-out-simple');
    lightboxAdapter?.destroy();
    lightboxAdapter = null;
    currentPattern = null;
    originalSchema = null;
    canvas.innerHTML = '';
    resetPanZoom();
  });

  // Main toolbar — Save
  btnSave.addEventListener('pointerup', handleSave);

  // Main toolbar — View select (pattern picker)
  viewSelect.addEventListener('native:change', () => {
    const id = viewSelect.value;
    if (id && id !== 'examples') openLightbox(id);
  });

  // Main toolbar — Actions dropdown
  actionsMenu.addEventListener('native:change', () => {
    const action = actionsMenu.value;
    // Reset select so it can be re-triggered
    requestAnimationFrame(() => { actionsMenu.value = ''; });
    if (action === 'reset') handleReset();
    else if (action === 'export-json') handleExportJson();
    else if (action === 'duplicate') handleDuplicate();
    else if (action === 'regenerate') handleRegenerate();
  });

  // Chip toggle buttons (pane visibility)
  for (const [id, chip] of chipEls) {
    chip.addEventListener('native:press', () => {
      if (activePanels.has(id)) activePanels.delete(id);
      else activePanels.add(id);
      syncPanels();
    });
  }

  // Pane close buttons
  dialog.querySelectorAll<HTMLElement>('[data-close-panel-id]').forEach((btn) => {
    btn.addEventListener('native:press', () => {
      const panelId = btn.getAttribute('data-close-panel-id') as PanelId;
      activePanels.delete(panelId);
      syncPanels();
    });
  });

  // Pan/zoom event listeners
  lightboxPreview.addEventListener('pointerdown', onPanPointerDown);
  lightboxPreview.addEventListener('pointermove', onPanPointerMove);
  lightboxPreview.addEventListener('pointerup', onPanPointerUp);
  lightboxPreview.addEventListener('pointercancel', onPanPointerUp);
  lightboxPreview.addEventListener('wheel', onWheelZoom, { passive: false });

  // Option+hover element highlighting
  canvas.addEventListener('pointermove', onOptionHover);
  canvas.addEventListener('pointerleave', clearOptionHover);
  document.addEventListener('keyup', (e) => { if (e.key === 'Alt') clearOptionHover(); });

  // Center + reset zoom buttons
  btnCenter.addEventListener('pointerup', centerContents);
  btnResetZoom.addEventListener('pointerup', resetZoom);

  // CSS Inspector toggle — activates 3D exploded view on the whole artifact
  inspectToggleBtn.addEventListener('pointerup', () => {
    if (cssInspector) {
      dismissInspector();
    } else {
      const artifact = canvas.firstElementChild as HTMLElement | null;
      if (!artifact) return;
      cssInspector = new CSSInspectController(artifact, { labels: true, dismissOnClickOutside: false, tiltElement: lightboxPreview });
      cssInspector.inspect();
      inspectToggleBtn.setAttribute('variant', 'selected');
    }
  });

  // Sync button state + bridge selections when inspector activates/deactivates
  canvas.addEventListener('native:inspect', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.active && cssInspector) {
      bridgeInspectorSelection();
    } else if (!detail?.active) {
      inspectorObserver?.disconnect();
      inspectorObserver = null;
      // dismissInspector nulls cssInspector BEFORE dismiss(), so if it's still set
      // the deactivation was external (Escape key) — clean up the reference + button.
      if (cssInspector) {
        const inspector = cssInspector;
        cssInspector = null;
        inspector.destroy();
        inspectToggleBtn.setAttribute('variant', 'ghost');
      }
    }
  });

  // Chat toggle — show/hide the docked chat pane
  chatToggle.addEventListener('pointerup', () => {
    if (activePanels.has('chat')) activePanels.delete('chat');
    else activePanels.add('chat');
    syncPanels();
  });

  // Model picker sync
  chatModelPicker.addEventListener('native:change', () => {
    currentModel = chatModelPicker.value;
  });

  // Pipeline toggle in chat header
  const pipelineToggle = chatComposer.querySelector('[data-role="toggle-pipeline"]');
  pipelineToggle?.addEventListener('pointerup', () => {
    pipelineMode = !pipelineMode;
    pipelineToggle.setAttribute('variant', pipelineMode ? 'selected' : 'ghost');
  });

  // Fullscreen toggle
  fullscreenToggleBtn.addEventListener('pointerup', () => {
    const isFullscreen = dialog.toggleAttribute('data-fullscreen');
    fullscreenToggleBtn.setAttribute('variant', isFullscreen ? 'selected' : 'ghost');
    fullscreenToggleBtn.querySelector('n-icon')!.setAttribute('name', isFullscreen ? 'x' : 'arrows-out-simple');
  });

  // Compare control
  // TODO: only show when the schema has multiple states or scenes (future version)
  compareToggle.addEventListener('native:change', (e) => {
    setCompareMode((e as CustomEvent).detail?.value ?? 'edited');
  });

  // Schema editor — live update (n-editor fires native:input)
  schemaEditor.addEventListener('native:input', onSchemaInput);

  // Preview click inspection
  canvas.addEventListener('click', onPreviewClick);

  // ── Chat controller binding + rendering ──

  function bindChatController(ctrl: LLMChatController): void {
    chatEffectCleanups.forEach((fn) => fn());
    chatEffectCleanups = [];

    const cleanup1 = effect(() => {
      const messages = ctrl.messages.value;
      renderChatMessages(messages);
    });
    chatEffectCleanups.push(cleanup1);

    const cleanup2 = effect(() => {
      chatComposer.busy = ctrl.streaming.value;
    });
    chatEffectCleanups.push(cleanup2);
  }

  function renderChatMessages(messages: LLMChatMessage[]): void {
    for (let i = chatRenderedCount; i < messages.length; i++) {
      const msg = messages[i];
      const group = document.createElement('n-agent-dialogue');
      group.setAttribute('data-role', msg.role);
      group.setAttribute('data-msg-idx', String(i));

      const item = document.createElement('n-agent-dialogue-item');
      item.setAttribute('data-role', msg.role);
      item.setAttribute('status', msg.status);
      item.setAttribute('actions', 'none');

      const text = document.createElement('n-chat-message-text');
      (text as HTMLElement & { content: string }).content = msg.content;

      item.appendChild(text);
      group.appendChild(item);
      chatFeed.appendChild(group);
    }

    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      const lastEl = chatFeed.querySelector(`[data-msg-idx="${messages.length - 1}"] n-chat-message-text`);
      if (lastEl && last.status === 'streaming') {
        (lastEl as HTMLElement & { content: string }).content = last.content;
      }
    }

    chatRenderedCount = messages.length;
    chatFeed.scrollTop = chatFeed.scrollHeight;
  }

  function renderChatSeeds(suggestions: Array<{ label: string; prompt?: string; value?: string }>): void {
    for (const el of chatFeed.querySelectorAll('[data-seeds]')) el.remove();

    const group = document.createElement('n-agent-dialogue');
    group.setAttribute('data-role', 'assistant');
    group.setAttribute('data-seeds', '');

    const seed = document.createElement('n-chat-message-seed') as HTMLElement & { options: Array<{ label: string; value: string }> };
    seed.options = suggestions.map(s => ({
      label: s.label,
      value: s.prompt ?? s.value ?? s.label,
    }));
    group.appendChild(seed);
    chatFeed.appendChild(group);
    chatFeed.scrollTop = chatFeed.scrollHeight;
  }

  // Chat seed selection
  chatFeed.addEventListener('native:seed-select', (e: Event) => {
    const value = (e as CustomEvent).detail?.value;
    if (value && chatController) {
      for (const el of chatFeed.querySelectorAll('[data-seeds]')) el.remove();
      chatController.send(value);
    }
  });

  // Chat composer submit
  chatComposer.addEventListener('native:send', (e: Event) => {
    const value = (e as CustomEvent).detail?.value;
    if (value && chatController) {
      for (const el of chatFeed.querySelectorAll('[data-seeds]')) el.remove();
      chatController.send(value);
    }
  });

  // ── Boot ──
  populateCategoryFilter();
  populateViewSelect();
  renderGrid();
});
