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

import { Kernel, resetKernel } from '@nonoun/native-ui/kernel';
import { createA2UIAdapter, COMPONENT_MAP as REGISTRY, getComponentCategory } from '@nonoun/native-ai';
import type { A2UIAdapter } from '@nonoun/native-ai';
import { ClaudeGatewayAdapter, OpenAiGatewayAdapter } from '@nonoun/native-ai/gateway';
import type { GatewayAdapter } from '@nonoun/native-ai/gateway';
import { CSSInspectController } from '@nonoun/native-ui/traits';
import { PIPELINE_STEPS, runPipeline } from '../a2ui-builder/pipeline.ts';
import promptJson from '../a2ui-builder/system-prompt.json';

import { loadCatalog, loadPattern } from './patterns/pattern-loader.ts';
import type { CatalogEntry, Pattern } from './patterns/pattern-types.ts';

// ── System prompt + component reference ──

const componentRef = Array.from(REGISTRY.values())
  .map((m) => {
    const cat = getComponentCategory(m.a2uiType);
    const props = m.properties?.map((p: { attr: string }) => p.attr).join(', ') || '';
    return `  - ${m.a2uiType} → <${m.nativeTag}> [${cat}]${props ? ': ' + props : ''}`;
  })
  .join('\n');

const systemPrompt = ((promptJson as { prompt: string }).prompt ?? JSON.stringify(promptJson))
  .replace('{{COMPONENT_REF}}', componentRef);

// ── LLM adapter (proxy mode) ──

function isClaudeModel(model: string): boolean {
  return model.startsWith('claude-') || ['opus-4.6', 'sonnet-4.6', 'haiku-4.5'].includes(model);
}

function buildLLMAdapter(system: string, model: string, tokens: number): GatewayAdapter | null {
  if (isClaudeModel(model)) {
    return new ClaudeGatewayAdapter({
      clientId: 'tl-regen',
      baseUrl: '/api/anthropic',
      model,
      maxTokens: tokens,
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

function parseJsonFromResponse(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(stripFences(raw));
  } catch {
    // Try to find JSON object in the response
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch { /* ignore */ }
    }
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════
// Boot — wrapped in astro:page-load with element guard
// ══════════════════════════════════════════════════════════════════

document.addEventListener('astro:page-load', () => {
  const grid = document.getElementById('pattern-grid');
  if (!grid) return; // not on this page

  // ── State ──
  const catalog = loadCatalog();
  let activeFilter: 'all' | 'micro' | 'block' = 'all';
  let activeCategory = '';
  let currentPattern: Pattern | null = null;
  let originalSchema: Pattern['components'] | null = null;
  let lightboxAdapter: A2UIAdapter | null = null;
  let currentModel = 'claude-haiku-4-5';
  let temperature = 0.7;
  let maxTokens = 4096;
  let pipelineMode = false;
  let regenerating = false;
  let cssInspector: CSSInspectController | null = null;
  const renderedCards = new Set<string>();

  // ── DOM refs ──
  const countEl = document.getElementById('pattern-count')!;
  const dialog = document.getElementById('editor-lightbox') as HTMLDialogElement;
  const lightboxTitle = document.getElementById('lightbox-title')!;
  const lightboxBadges = document.getElementById('lightbox-badges')!;
  const lightboxPreview = document.getElementById('lightbox-preview')!;
  const schemaEditor = document.getElementById('schema-editor') as HTMLTextAreaElement;
  const outputPre = document.getElementById('output-pre')!;
  const categoryFilter = document.getElementById('category-filter') as HTMLElement & { value: string };
  const modelPicker = document.getElementById('tl-model') as HTMLElement & { value: string };
  const tempRange = document.getElementById('tl-temperature') as HTMLInputElement;
  const tokensRange = document.getElementById('tl-max-tokens') as HTMLInputElement;
  const pipelineToggle = document.getElementById('tl-pipeline-toggle') as HTMLInputElement;
  const tempVal = document.getElementById('temp-val')!;
  const tokensVal = document.getElementById('tokens-val')!;
  const insightsWrap = document.getElementById('insights-wrap')!;
  const inspectToggleBtn = document.getElementById('inspect-toggle')!;
  const fullscreenToggleBtn = document.getElementById('fullscreen-toggle')!;
  const btnRegenerate = document.getElementById('btn-regenerate')!;
  const btnExport = document.getElementById('btn-export')!;
  const btnClose = document.getElementById('lightbox-close')!;

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

  // ══════════════════════════════════════════════════════════════════
  // Grid Rendering
  // ══════════════════════════════════════════════════════════════════

  function getFilteredPatterns(): CatalogEntry[] {
    return catalog.patterns.filter((p) => {
      if (activeFilter !== 'all' && p.tier !== activeFilter) return false;
      if (activeCategory && p.category !== activeCategory) return false;
      return true;
    });
  }

  function renderGrid(): void {
    const entries = getFilteredPatterns();
    countEl.textContent = `${entries.length} pattern${entries.length !== 1 ? 's' : ''}`;
    grid.innerHTML = '';

    for (const entry of entries) {
      const card = document.createElement('article');
      card.className = 'tl-card';
      card.dataset.patternId = entry.id;

      card.innerHTML = `
        <div class="tl-card-preview"><div id="card-preview-${entry.id}" inert></div></div>
        <div class="tl-card-meta">
          <span class="tl-card-label">${entry.label}</span>
          <span class="tl-card-badge" data-tier="${entry.tier}">${entry.tier}</span>
          <span class="tl-card-badge" data-category>${entry.category}</span>
        </div>
        <div class="tl-card-overlay"><span>Edit</span></div>
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

    grid.querySelectorAll('.tl-card').forEach((card) => observer!.observe(card));
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

  // ══════════════════════════════════════════════════════════════════
  // Filters
  // ══════════════════════════════════════════════════════════════════

  function onFilterChange(filter: string): void {
    activeFilter = filter as 'all' | 'micro' | 'block';
    document.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.toggleAttribute('data-active', btn.getAttribute('data-filter') === filter);
    });
    renderGrid();
  }

  function onCategoryChange(category: string): void {
    activeCategory = category;
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

  // ══════════════════════════════════════════════════════════════════
  // Lightbox
  // ══════════════════════════════════════════════════════════════════

  async function openLightbox(id: string): Promise<void> {
    const pattern = await loadPattern(id);
    if (!pattern) return;

    currentPattern = pattern;
    originalSchema = structuredClone(pattern.components);

    lightboxTitle.textContent = pattern.label;
    lightboxBadges.innerHTML = `
      <span class="tl-card-badge" data-tier="${pattern.tier}">${pattern.tier}</span>
      <span class="tl-card-badge" data-category>${pattern.category}</span>
    `;

    schemaEditor.value = JSON.stringify(pattern, null, 2);
    renderLightboxPreview(pattern.components as Record<string, unknown>[]);
    showTab('schema');
    dialog.showModal();
  }

  function renderLightboxPreview(components: Record<string, unknown>[]): void {
    lightboxAdapter?.destroy();
    lightboxPreview.innerHTML = '';

    const flat = flattenComponents(components);
    lightboxAdapter = createA2UIAdapter(kernel, {});
    lightboxAdapter.receive(
      { updateComponents: { surfaceId: 'lightbox', components: flat } },
      lightboxPreview,
    );

    requestAnimationFrame(() => {
      outputPre.textContent = lightboxPreview.innerHTML;
    });
  }

  function dismissInspector(): void {
    if (cssInspector) {
      cssInspector.dismiss();
      cssInspector.destroy();
      cssInspector = null;
      inspectToggleBtn.removeAttribute('data-active');
      inspectToggleBtn.removeAttribute('intent');
    }
  }

  function closeLightbox(): void {
    dismissInspector();
    dialog.close();
    lightboxAdapter?.destroy();
    lightboxAdapter = null;
    currentPattern = null;
    originalSchema = null;
    lightboxPreview.innerHTML = '';
  }

  // ── Tab switching ──

  function showTab(tab: string): void {
    document.querySelectorAll('.tl-tab-panel').forEach((panel) => {
      (panel as HTMLElement).hidden = panel.getAttribute('data-tab') !== tab;
    });
    dialog.querySelectorAll('[data-chip]').forEach((btn) => {
      btn.toggleAttribute('data-active', btn.getAttribute('data-chip') === tab);
    });
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
          }
        }
      } catch {
        // Invalid JSON — ignore
      }
    }, 500);
  }

  // ── DOM ↔ Schema bidirectional highlighting ──

  function clearHighlights(): void {
    lightboxPreview.querySelectorAll('[data-highlight]').forEach((el) => {
      el.removeAttribute('data-highlight');
    });
  }

  function onPreviewClick(e: Event): void {
    const target = e.target as HTMLElement;
    clearHighlights();

    const el = target.closest('[id]') as HTMLElement | null;
    if (!el || el === lightboxPreview) return;

    el.setAttribute('data-highlight', '');

    const searchStr = `"id": "${el.id}"`;
    const idx = schemaEditor.value.indexOf(searchStr);
    if (idx >= 0) {
      schemaEditor.focus();
      schemaEditor.setSelectionRange(idx, idx + searchStr.length);
      const linesBefore = schemaEditor.value.substring(0, idx).split('\n').length;
      const lineHeight = 11 * 1.6;
      schemaEditor.scrollTop = Math.max(0, (linesBefore - 3) * lineHeight);
    }

    showTab('schema');
  }

  let schemaCursorDebounce: ReturnType<typeof setTimeout> | undefined;

  function onSchemaCursorMove(): void {
    clearTimeout(schemaCursorDebounce);
    schemaCursorDebounce = setTimeout(() => {
      clearHighlights();

      const pos = schemaEditor.selectionStart;
      const text = schemaEditor.value;

      const idPattern = /"id"\s*:\s*"([^"]+)"/g;
      let bestId: string | null = null;
      let bestStart = -1;
      let match: RegExpExecArray | null;

      while ((match = idPattern.exec(text)) !== null) {
        const matchEnd = match.index + match[0].length;
        if (matchEnd > pos) {
          if (bestId) break;
          const objectStart = findObjectStart(text, match.index);
          if (objectStart <= pos) {
            bestId = match[1];
            bestStart = objectStart;
          }
          break;
        }
        bestId = match[1];
        bestStart = match.index;
      }

      if (!bestId) return;

      const objectStart = findObjectStart(text, bestStart);
      const objectEnd = findObjectEnd(text, objectStart);
      if (pos < objectStart || pos > objectEnd) return;

      const el = lightboxPreview.querySelector(`#${CSS.escape(bestId)}`) as HTMLElement | null;
      if (el) {
        el.setAttribute('data-highlight', '');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 120);
  }

  function findObjectStart(text: string, pos: number): number {
    let depth = 0;
    for (let i = pos - 1; i >= 0; i--) {
      if (text[i] === '}') depth++;
      if (text[i] === '{') {
        if (depth === 0) return i;
        depth--;
      }
    }
    return 0;
  }

  function findObjectEnd(text: string, pos: number): number {
    let depth = 0;
    for (let i = pos; i < text.length; i++) {
      if (text[i] === '{') depth++;
      if (text[i] === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return text.length;
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
    btnRegenerate.setAttribute('disabled', '');

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
      btnRegenerate.removeAttribute('disabled');
    }
  }

  async function regenerateDirect(query: string): Promise<void> {
    const adapter = buildLLMAdapter(systemPrompt, currentModel, maxTokens);
    if (!adapter) return;

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
    showTab('insights');

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
      buildLLMAdapter(system, currentModel, tokens);

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
    showTab('schema');
  }

  // ══════════════════════════════════════════════════════════════════
  // Export Improvement
  // ══════════════════════════════════════════════════════════════════

  function handleExport(): void {
    if (!currentPattern) return;

    const folder = currentPattern.tier === 'micro' ? 'micro' : 'blocks';
    const md = `# Pattern Improvement: ${currentPattern.label}

## Pattern
- **ID:** ${currentPattern.id}
- **Tier:** ${currentPattern.tier}
- **Category:** ${currentPattern.category}
- **Description:** ${currentPattern.description}
- **Concepts:** ${currentPattern.concepts.join(', ')}

## LLM Settings Used
- **Model:** ${currentModel}
- **Temperature:** ${temperature}
- **Max Tokens:** ${maxTokens}
- **Pipeline:** ${pipelineMode ? 'multi-step (4 stages)' : 'direct (single-shot)'}

## Original Schema
\`\`\`json
${JSON.stringify(originalSchema, null, 2)}
\`\`\`

## Updated Schema
\`\`\`json
${JSON.stringify(currentPattern.components, null, 2)}
\`\`\`

## Instruction for Claude Code
Update the pattern file at \`packages/native-ai/src/a2ui/patterns/${folder}/${currentPattern.id}.json\`
with the full updated pattern JSON below. Verify it renders correctly in the A2UI Training Library.

\`\`\`json
${JSON.stringify(currentPattern, null, 2)}
\`\`\`
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern-improvement-${currentPattern.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
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

  // Card clicks (delegated)
  grid.addEventListener('pointerup', (e) => {
    const card = (e.target as HTMLElement).closest('.tl-card') as HTMLElement | null;
    if (card?.dataset.patternId) openLightbox(card.dataset.patternId);
  });

  // Lightbox close
  btnClose.addEventListener('pointerup', closeLightbox);
  dialog.addEventListener('close', () => {
    dismissInspector();
    lightboxAdapter?.destroy();
    lightboxAdapter = null;
    currentPattern = null;
    originalSchema = null;
  });

  // CSS Inspector toggle
  inspectToggleBtn.addEventListener('pointerup', () => {
    if (cssInspector) {
      dismissInspector();
    } else {
      cssInspector = new CSSInspectController(lightboxPreview, { pick: true, labels: true });
      inspectToggleBtn.setAttribute('data-active', '');
      inspectToggleBtn.setAttribute('intent', 'accent');
    }
  });

  lightboxPreview.addEventListener('native:inspect', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (!detail?.active && cssInspector) {
      cssInspector = null;
      inspectToggleBtn.removeAttribute('data-active');
      inspectToggleBtn.removeAttribute('intent');
    }
  });

  // Tab chip buttons
  dialog.addEventListener('pointerup', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLElement>('[data-chip]');
    if (chip) showTab(chip.getAttribute('data-chip')!);
  });

  // Fullscreen toggle
  fullscreenToggleBtn.addEventListener('pointerup', () => {
    const isFS = dialog.toggleAttribute('data-fullscreen');
    fullscreenToggleBtn.toggleAttribute('data-active', isFS);
  });

  // Schema editor — live update + cursor-driven highlight
  schemaEditor.addEventListener('input', onSchemaInput);
  schemaEditor.addEventListener('click', onSchemaCursorMove);
  schemaEditor.addEventListener('keyup', onSchemaCursorMove);

  // Preview click inspection
  lightboxPreview.addEventListener('click', onPreviewClick);

  // Regenerate + Export
  btnRegenerate.addEventListener('pointerup', handleRegenerate);
  btnExport.addEventListener('pointerup', handleExport);

  // Settings controls
  modelPicker?.addEventListener('native:change', () => {
    currentModel = modelPicker.value;
  });

  tempRange?.addEventListener('native:input', () => {
    temperature = (tempRange as unknown as { value: number }).value;
    tempVal.textContent = String(temperature);
  });

  tokensRange?.addEventListener('native:input', () => {
    maxTokens = (tokensRange as unknown as { value: number }).value;
    tokensVal.textContent = String(maxTokens);
  });

  pipelineToggle?.addEventListener('native:change', () => {
    pipelineMode = (pipelineToggle as unknown as { checked: boolean }).checked;
  });

  // ── Boot ──
  populateCategoryFilter();
  renderGrid();
});
