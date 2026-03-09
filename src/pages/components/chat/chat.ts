document.addEventListener('astro:page-load', () => {
  const feedMsg1 = document.getElementById('demo-feed-msg1');
  if (!feedMsg1) return;

  // ── Feed Messages ──

  feedMsg1.content = "Hello! I'm your AI assistant. How can I help you today?";

  const feedMsg2 = document.getElementById('demo-feed-msg2');
  if (feedMsg2) feedMsg2.content = 'Can you explain how web components work?';

  const feedMsg3 = document.getElementById('demo-feed-msg3');
  if (feedMsg3) feedMsg3.content = `Web components are a set of **browser APIs** that let you create reusable custom elements. The main specs are:

1. **Custom Elements** — define new HTML tags with \`customElements.define()\`
2. **Shadow DOM** — encapsulated DOM and styling
3. **HTML Templates** — reusable markup fragments

Here's a simple example:

\`\`\`js
class MyButton extends HTMLElement {
  connectedCallback() {
    this.textContent = 'Click me';
  }
}
customElements.define('my-button', MyButton);
\`\`\`

They work in **all modern browsers** without a framework.`;

  const feedMsgA1 = document.getElementById('demo-feed-msg-a1');
  if (feedMsgA1) feedMsgA1.content = 'Hey, quick question';

  const feedMsgA2 = document.getElementById('demo-feed-msg-a2');
  if (feedMsgA2) feedMsgA2.content = "What's the difference between shadow DOM and light DOM?";

  const feedMsgA3 = document.getElementById('demo-feed-msg-a3');
  if (feedMsgA3) feedMsgA3.content = `**Light DOM** is the regular DOM tree — children you write in HTML. **Shadow DOM** is an encapsulated tree attached via \`attachShadow()\`.

Key differences:

- Shadow DOM styles don't leak out
- External styles don't reach in (unless using CSS custom properties or \`::part()\`)
- Shadow DOM creates a _flat tree_ for rendering`;

  const feedMsgA4 = document.getElementById('demo-feed-msg-a4');
  if (feedMsgA4) feedMsgA4.content = 'This library (`native-ui`) deliberately avoids Shadow DOM — all components use **light DOM** so CSS custom properties cascade naturally.';

  // ── Message Text ──

  const mdFull = document.getElementById('demo-md-full');
  if (mdFull) {
    mdFull.content = `## Web Components

Here's what you need to know about **web components**:

- **Custom Elements** — define new HTML tags
- **Shadow DOM** — encapsulated styling
- **HTML Templates** — declarative structure

Inline \`code\` works too. And here's a fenced block:

\`\`\`js
class MyEl extends HTMLElement {
  connectedCallback() {
    this.textContent = 'Hello';
  }
}
\`\`\`

> Web components work in all modern browsers without a framework.

Visit [MDN](https://developer.mozilla.org) for more.`;
  }

  const mdPlain = document.getElementById('demo-md-plain');
  if (mdPlain) {
    mdPlain.content = 'This is plain text. No **bold** or *italic* formatting is applied. Links like https://example.com stay as text.';
  }

  // ── Seed Chips ──

  const seeds = document.getElementById('demo-seeds');
  if (seeds) {
    seeds.options = [
      { value: 'explain', label: 'Explain this code' },
      { value: 'refactor', label: 'Suggest refactoring' },
      { value: 'test', label: 'Write tests' },
      { value: 'docs', label: 'Generate docs' },
    ];
  }

  const seedsDisabled = document.getElementById('demo-seeds-disabled');
  if (seedsDisabled) {
    seedsDisabled.options = [
      { value: 'explain', label: 'Explain this code' },
      { value: 'refactor', label: 'Suggest refactoring' },
    ];
  }

  // ── Structured Input ──

  const structSingle = document.getElementById('demo-structured-single');
  if (structSingle) {
    structSingle.options = [
      { value: 'ts', label: 'TypeScript' },
      { value: 'js', label: 'JavaScript' },
      { value: 'py', label: 'Python' },
      { value: 'rs', label: 'Rust' },
    ];
  }

  const structMulti = document.getElementById('demo-structured-multi');
  if (structMulti) {
    structMulti.options = [
      { value: 'signals', label: 'Reactive signals' },
      { value: 'traits', label: 'Composable traits' },
      { value: 'tokens', label: 'CSS token system' },
      { value: 'a11y', label: 'Accessibility' },
    ];
  }

  // ── GenUI ──

  const genuiInline = document.getElementById('demo-genui-inline');
  if (genuiInline) {
    genuiInline.schema = {
      tag: 'n-card',
      children: [
        { tag: 'n-header', children: [
          { tag: 'span', text: 'Generated Card' },
        ]},
        { tag: 'n-body', children: [
          { tag: 'p', text: 'This UI was rendered from a schema object.' },
        ]},
        { tag: 'n-footer', children: [
          { tag: 'n-button', text: 'Confirm', attributes: { variant: 'primary', intent: 'accent' } },
          { tag: 'n-button', text: 'Cancel', attributes: { variant: 'ghost' } },
        ]},
      ],
    };
  }

  const genuiLightbox = document.getElementById('demo-genui-lightbox');
  if (genuiLightbox) {
    genuiLightbox.schema = {
      tag: 'n-card',
      children: [
        { tag: 'n-header', children: [
          { tag: 'span', text: 'Interactive Form' },
        ]},
        { tag: 'n-body', children: [
          { tag: 'p', text: 'Click "Open" to view in a dialog overlay.' },
          { tag: 'n-button', text: 'Submit', attributes: { variant: 'primary', intent: 'accent' } },
        ]},
      ],
    };
  }
});
