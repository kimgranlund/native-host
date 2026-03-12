// LLMChatController — source-copied from @nonoun/native-ai/src/chat/llm-chat/llm-chat-controller.ts
// Not yet exported from the npm dist. Remove this file when native-ai exports it.
//
// Host adaptation: signal/computed import → @nonoun/native-ui (not @nonoun/native-core)
// GatewayAdapter types → @nonoun/native-ai/gateway

import { signal, computed } from '@nonoun/native-ui';
import type { GatewayAdapter } from '@nonoun/native-ai/gateway';

// ── Adapter message types (subset of gateway/adapter.ts) ──

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
  datetime: number;
}

interface SendMessageStreamChunk {
  fullMessage: string;
}

// ── Context Binding ──

export interface LLMChatContext {
  id: string;
  label: string;
  element?: HTMLElement;
  read: () => string;
  apply: (output: string) => void;
  systemPromptFragment?: string;
  icon?: string;
}

// ── Controller Options ──

export interface LLMChatControllerOptions {
  contexts?: LLMChatContext[];
  systemPrompt: string;
  models?: string[];
  model?: string;
  maxContextMessages?: number;
  createAdapter: (system: string, model: string, maxTokens: number) => GatewayAdapter | null;
  onStream?: (fullMessage: string) => void;
  onComplete?: (finalMessage: string) => void;
}

// ── Message Type ──

export interface LLMChatMessage {
  role: 'user' | 'assistant';
  content: string;
  datetime: number;
  contextId?: string;
  status: 'sent' | 'streaming' | 'error' | 'partial';
}

// ── Controller ──

const MAX_CONTEXT_MESSAGES = 50;

export class LLMChatController {
  readonly activeContext = signal<LLMChatContext | null>(null);
  readonly contexts = signal<LLMChatContext[]>([]);
  readonly streaming = signal(false);
  readonly messages = signal<LLMChatMessage[]>([]);
  readonly model = signal('claude-haiku-4-5');
  readonly maxTokens = signal(4096);
  readonly streamDelta = signal('');
  readonly hasActiveContext = computed(() => this.activeContext.value !== null);

  readonly #systemPrompt: string;
  readonly #createAdapter: LLMChatControllerOptions['createAdapter'];
  readonly #maxContextMessages: number;
  readonly #onStream?: (fullMessage: string) => void;
  readonly #onComplete?: (finalMessage: string) => void;
  #abortController: AbortController | null = null;
  #previousHighlightEl: HTMLElement | null = null;

  constructor(options: LLMChatControllerOptions) {
    this.#systemPrompt = options.systemPrompt;
    this.#createAdapter = options.createAdapter;
    this.#maxContextMessages = options.maxContextMessages ?? MAX_CONTEXT_MESSAGES;
    this.#onStream = options.onStream;
    this.#onComplete = options.onComplete;

    if (options.model) this.model.value = options.model;
    if (options.contexts?.length) {
      this.contexts.value = [...options.contexts];
      this.activeContext.value = options.contexts[0];
    }
  }

  addContext(ctx: LLMChatContext): void {
    this.contexts.value = [...this.contexts.value, ctx];
    if (!this.activeContext.value) this.activeContext.value = ctx;
  }

  removeContext(id: string): void {
    this.contexts.value = this.contexts.value.filter((c) => c.id !== id);
    if (this.activeContext.value?.id === id) {
      this.activeContext.value = this.contexts.value[0] ?? null;
    }
    this.#syncHighlight();
  }

  setActiveContext(id: string): void {
    const ctx = this.contexts.value.find((c) => c.id === id);
    if (ctx) {
      this.activeContext.value = ctx;
      this.#syncHighlight();
    }
  }

  #syncHighlight(): void {
    if (this.#previousHighlightEl) {
      this.#previousHighlightEl.removeAttribute('data-llm-context');
      this.#previousHighlightEl = null;
    }
    const el = this.activeContext.value?.element;
    if (el) {
      el.setAttribute('data-llm-context', 'active');
      this.#previousHighlightEl = el;
    }
  }

  async send(query: string): Promise<void> {
    const ctx = this.activeContext.value;
    if (!ctx || this.streaming.value) return;

    const contextState = ctx.read();
    const systemParts = [this.#systemPrompt];
    if (ctx.systemPromptFragment) systemParts.push(ctx.systemPromptFragment);
    systemParts.push(`\n\nCurrent state of "${ctx.label}":\n\`\`\`\n${contextState}\n\`\`\``);
    const system = systemParts.join('\n\n');

    const adapter = this.#createAdapter(system, this.model.value, this.maxTokens.value);
    if (!adapter) return;

    this.#abortController?.abort();
    const abort = new AbortController();
    this.#abortController = abort;

    const userMsg: LLMChatMessage = {
      role: 'user',
      content: query,
      datetime: Date.now(),
      contextId: ctx.id,
      status: 'sent',
    };

    const assistantMsg: LLMChatMessage = {
      role: 'assistant',
      content: '',
      datetime: Date.now(),
      contextId: ctx.id,
      status: 'streaming',
    };

    const msgs = [...this.messages.value, userMsg, assistantMsg];
    if (msgs.length > this.#maxContextMessages) {
      msgs.splice(0, msgs.length - this.#maxContextMessages);
    }
    this.messages.value = msgs;

    this.streaming.value = true;
    this.streamDelta.value = '';

    const history: ChatMessage[] = msgs
      .filter((m) => m.status === 'sent')
      .map((m) => ({
        role: m.role,
        message: m.content,
        datetime: m.datetime,
      }));

    try {
      const response = await adapter.sendMessageStream({
        id: crypto.randomUUID(),
        messages: history,
        query,
        model: this.model.value,
        signal: abort.signal,
        onChunk: (chunk: SendMessageStreamChunk) => {
          this.streamDelta.value = chunk.fullMessage;
          if (this.#onStream) {
            this.#onStream(chunk.fullMessage);
          } else {
            const updated = [...this.messages.value];
            const last = updated[updated.length - 1];
            if (last?.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: chunk.fullMessage };
              this.messages.value = updated;
            }
          }
        },
      });

      ctx.apply(response.message);
      this.#onComplete?.(response.message);

      const final = [...this.messages.value];
      const last = final[final.length - 1];
      if (last?.role === 'assistant') {
        final[final.length - 1] = {
          ...last,
          content: last.content || response.message,
          status: 'sent',
        };
        this.messages.value = final;
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        const partial = [...this.messages.value];
        const last = partial[partial.length - 1];
        if (last?.role === 'assistant') {
          partial[partial.length - 1] = { ...last, status: 'partial' };
          this.messages.value = partial;
        }
        return;
      }
      const errMsgs = [...this.messages.value];
      const last = errMsgs[errMsgs.length - 1];
      if (last?.role === 'assistant') {
        errMsgs[errMsgs.length - 1] = {
          ...last,
          content: `Error: ${(err as Error).message}`,
          status: 'error',
        };
        this.messages.value = errMsgs;
      }
    } finally {
      this.streaming.value = false;
      this.#abortController = null;
    }
  }

  stop(): void {
    this.#abortController?.abort();
  }

  clear(): void {
    this.messages.value = [];
    this.streamDelta.value = '';
  }

  destroy(): void {
    this.stop();
    this.#syncHighlight();
    this.activeContext.value = null;
    this.contexts.value = [];
    this.messages.value = [];
  }
}
