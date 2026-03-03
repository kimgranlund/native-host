# Examples

Ten copy-pasteable patterns for native-host Astro pages. For library-level
examples (component APIs, traits), see native-ui docs/EXAMPLES.md.

## 1. Minimal Component Demo Page

Template for any new component demo page. `SidebarLayout` provides sidebar,
breadcrumb, inspector, and chat. Copy-button wiring is automatic.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Widget">
  <main>
<h1>&lt;n-widget&gt;</h1>
    <p style="color: var(--n-ink-muted-neutral); font-size: 0.875rem; margin-bottom: 1.5rem;">
      One-line description of the component.
    </p>

    <h2>Basic Usage</h2>
    <div class="layout-section">
      <div class="layout-row">
        <n-widget>Hello</n-widget>
        <n-widget variant="accent">Accent</n-widget>
      </div>
      <pre class="layout-code"><code>&lt;n-widget&gt;Hello&lt;/n-widget&gt;</code><n-button class="copy-btn" size="sm" variant="ghost" aria-label="Copy"><n-icon name="copy"></n-icon></n-button></pre>
    </div>
  </main>

  <style is:global>
    /* Page-specific styles — must be is:global for n-* elements */
  </style>
</SidebarLayout>
```

**Expected result:**
- Breadcrumb: "Components > Widget"; inspector/chat toggles in breadcrumb
- `.layout-row` displays items inline; copy button copies code to clipboard

## 2. Block Page (No Panels)

`panels={[]}` disables inspector and chat. Full-width content, no toggle buttons.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Auth Login" panels={[]}>
  <main>
<h1>Sign In</h1>
    <div class="auth-centered">
      <n-stack gap="4">
        <n-button variant="primary" intent="accent" size="lg">
          <span slot="label">Continue with Google</span>
        </n-button>
        <n-button size="lg"><span slot="label">Continue with email</span></n-button>
      </n-stack>
    </div>
  </main>

  <style is:global>
    .auth-centered { display:flex; flex-direction:column; align-items:center; padding:2rem; }
  </style>
</SidebarLayout>
```

**Expected result:**
- Sidebar present, breadcrumb shows "Blocks > Auth Login", no inspector/chat buttons
- Content gets full width (no aside panels)

## 3. Standalone Page (No Sidebar)

`BaseLayout` directly -- no sidebar, breadcrumb, or command palette.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Log In">
  <style is:global>@import '../styles/layout.css';</style>

  <main class="login-screen">
    <div class="login-card">
      <h1>Log in</h1>
      <n-stack gap="3">
        <n-button variant="primary" intent="accent" size="lg">
          <span slot="label">Continue with Google</span>
        </n-button>
      </n-stack>
    </div>
  </main>

  <script>
    import { navigate } from 'astro:transitions/client';
    document.addEventListener('astro:page-load', () => {
      for (const btn of document.querySelectorAll('.login-card n-button'))
        btn.addEventListener('click', () => navigate('/blocks/data-dashboard-stats'));
    });
  </script>

  <style is:global>
    .login-screen { display:flex; justify-content:center; align-items:center; min-height:100dvh; }
    .login-card { width:100%; max-width:22rem; }
  </style>
</BaseLayout>
```

**Expected result:**
- Full-viewport centered card, no sidebar or breadcrumb
- Button navigates via Astro client-side routing

## 4. Code Blocks with Copy Button

For HTML entities in code, define the string in frontmatter and use `set:html`.
Copy wiring is automatic via `copy-buttons.ts` (loaded once in `layout.ts`).

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';

const codeExamples = {
  usage: `&lt;n-widget variant="primary"&gt;
  &lt;span slot="label"&gt;Click me&lt;/span&gt;
&lt;/n-widget&gt;`,
};
---
<SidebarLayout title="Widget">
  <main>
<h1>&lt;n-widget&gt;</h1>
    <div class="layout-section">
      <!-- Inline code -->
      <pre class="layout-code"><code>&lt;n-widget&gt;Hello&lt;/n-widget&gt;</code><n-button class="copy-btn" size="sm" variant="ghost" aria-label="Copy"><n-icon name="copy"></n-icon></n-button></pre>

      <!-- Dynamic code via set:html -->
      <pre class="layout-code"><code set:html={codeExamples.usage} /><n-button class="copy-btn" size="sm" variant="ghost" aria-label="Copy"><n-icon name="copy"></n-icon></n-button></pre>
    </div>
  </main>
</SidebarLayout>
```

**Expected result:**
- Ghost copy button at right edge; click copies text, shows checkmark 1.5s
- `set:html` renders entities as angle brackets in DOM

## 5. Event Logging

`logAppend` (oldest-first, auto-scroll) or `logPrepend` (newest-first). Guard
on a page-specific ID to prevent duplicate listeners during view transitions.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Pressable">
  <main>
<h1>Pressable</h1>
    <div class="layout-section">
      <n-controller traits="pressable">
        <div class="press-box" tabindex="0">Click or press Enter</div>
      </n-controller>
      <div id="press-log" class="output"></div>
    </div>
  </main>

  <script>
import { logAppend } from '../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('press-log')) return;

  let count = 0;
  const logEl = document.getElementById('press-log');
  for (const box of document.querySelectorAll('.press-box')) {
    box.addEventListener('native:press', (e: CustomEvent) => {
      count++;
      logAppend(logEl, `#${count} native:press — pointerType: "${e.detail.pointerType}"`);
    });
  }
});
  </script>

  <style is:global>
    .press-box {
      display:inline-flex; align-items:center; padding:1rem 1.5rem;
      border:1px solid var(--n-border-muted-neutral); border-radius:var(--n-radius-md);
      cursor:pointer; user-select:none;
    }
    .press-box[pressed] { background:var(--n-surface-sunken-neutral); }
  </style>
</SidebarLayout>
```

**Expected result:**
- Click appends numbered log entries to `.output`; auto-scrolls to bottom
- Guard prevents duplicate listeners on view-transition re-entry

## 6. SSR Preference Reading

`parsePreferences(Astro.cookies)` returns `{ colorScheme, sidebarCollapsed,
groupStates, showCode }` with defaults. Renders correct state on first byte.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
import { parsePreferences } from '../../lib/preferences';

const prefs = parsePreferences(Astro.cookies);
---
<SidebarLayout title="Theme Demo">
  <main>
<h1>Theme Demo</h1>
    <div class="layout-section">
      <div class={`preview ${prefs.colorScheme === 'dark' ? 'preview-dark' : ''}`}>
        <p>Theme: <strong>{prefs.colorScheme || 'system'}</strong></p>
        <p>Sidebar collapsed: <strong>{prefs.sidebarCollapsed}</strong></p>
      </div>
    </div>
  </main>

  <style is:global>
    .preview { padding:1.5rem; border:1px solid var(--n-border-muted-neutral); border-radius:var(--n-radius-md); }
    .preview-dark { background:var(--n-surface-sunken-neutral); }
  </style>
</SidebarLayout>
```

**Expected result:**
- Card reflects saved theme on first byte (no flash of wrong state)
- `colorScheme` is `""` when unset; `sidebarCollapsed`/`showCode` default `false`

## 7. Custom Panel Content

Override the default inspector (`<native-tokens>`) via `slot="inspector"`.
The `chat` slot works identically.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Widget">
  <main>
<h1>&lt;n-widget&gt;</h1>
    <div class="layout-section">
      <n-widget id="demo-widget">Hello</n-widget>
    </div>
  </main>

  <div slot="inspector">
    <div style="padding:1rem;">
      <h3 style="font-size:0.75rem; font-weight:600; text-transform:uppercase; color:var(--n-ink-muted-neutral); margin:0 0 0.75rem;">Controls</h3>
      <n-field>
        <label slot="label">Variant</label>
        <n-select id="variant-select">
          <n-button justify="spread">
            <span slot="label">default</span>
            <n-icon name="caret-up-down" slot="trailing"></n-icon>
          </n-button>
          <n-listbox popover="manual">
            <n-option value="default" selected>Default</n-option>
            <n-option value="primary">Primary</n-option>
          </n-listbox>
        </n-select>
      </n-field>
    </div>
  </div>
</SidebarLayout>
```

**Expected result:**
- Inspector panel shows custom controls instead of `<native-tokens>`
- Toggle button still present in breadcrumb; chat panel unaffected

## 8. Form with Validation

`n-field required` + `n-input`/`n-select` inside `n-card`. Submit button
outside `<form>` linked via `form="id"`.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Form Contact" panels={[]}>
  <main>
<h1>Contact Us</h1>
    <n-card style="max-width:36rem;">
      <n-header><span slot="label">Send a message</span></n-header>
      <n-body>
        <form id="contact-form">
          <n-stack gap="8">
            <n-field required>
              <label slot="label">Name</label>
              <n-input placeholder="Jane Doe" name="name"></n-input>
            </n-field>
            <n-field required>
              <label slot="label">Email</label>
              <n-input type="email" placeholder="you@example.com" name="email"></n-input>
            </n-field>
            <n-field required>
              <label slot="label">Subject</label>
              <n-select name="subject">
                <n-button justify="spread">
                  <span slot="label">Select a topic</span>
                  <n-icon name="caret-up-down" slot="trailing"></n-icon>
                </n-button>
                <n-listbox popover="manual">
                  <n-option value="general">General Inquiry</n-option>
                  <n-option value="support">Technical Support</n-option>
                </n-listbox>
              </n-select>
            </n-field>
          </n-stack>
        </form>
      </n-body>
      <n-footer>
        <n-button variant="ghost"><span slot="label">Cancel</span></n-button>
        <n-button variant="primary" intent="accent" type="submit" form="contact-form">
          <span slot="label">Send</span>
        </n-button>
      </n-footer>
    </n-card>
  </main>

  <script>
    document.addEventListener('astro:page-load', () => {
      const form = document.getElementById('contact-form');
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(Object.fromEntries(new FormData(form as HTMLFormElement)));
      });
    });
  </script>
</SidebarLayout>
```

**Expected result:**
- Card with header, form fields in body, action buttons in footer
- `n-field required` shows validation; submit button linked via `form=`
- `panels={[]}` gives full width

## 9. Dialog from Page Script

`n-dialog` wraps `n-card`. Open with `showModal()`, close with `close()`.
Backdrop click and Escape close by default.

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Dialog">
  <main>
<h1>&lt;n-dialog&gt;</h1>
    <div class="layout-section">
      <n-button id="open-btn">Open Dialog</n-button>
      <n-dialog id="my-dialog">
        <n-card class="dialog-card">
          <n-header><span slot="label">Confirm Action</span></n-header>
          <n-body>
            <p style="font-size:0.875rem; color:var(--n-ink-muted-neutral); margin:0;">
              Are you sure? This cannot be undone.
            </p>
          </n-body>
          <n-footer>
            <n-button id="cancel-btn">Cancel</n-button>
            <n-button id="confirm-btn" intent="accent">Confirm</n-button>
          </n-footer>
        </n-card>
      </n-dialog>
    </div>
  </main>

  <script>
document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('my-dialog')) return;
  const dialog = document.getElementById('my-dialog');
  document.getElementById('open-btn')?.addEventListener('native:press', () => (dialog as any)?.showModal());
  for (const id of ['cancel-btn', 'confirm-btn'])
    document.getElementById(id)?.addEventListener('native:press', () => (dialog as any)?.close());
});
  </script>

  <style is:global>
    .dialog-card {
      width:min(28rem, calc(100vw - 2rem));
      box-shadow:0 8px 30px oklch(0% 0 0 / 0.12), 0 2px 8px oklch(0% 0 0 / 0.06);
    }
  </style>
</SidebarLayout>
```

**Expected result:**
- Button triggers `showModal()`; dialog in top layer with backdrop
- Cancel/Confirm call `close()`; backdrop click and Escape also close

## 10. Title Override for New Page

Auto-derived titles: Components/Containers strip `ui-` + Title Case; Traits use
PascalCase; Blocks/Other use Title Case. Override when that produces the wrong
result.

**The page** (`src/pages/components/ui-input-otp.astro`):

```astro
---
import SidebarLayout from '../../layouts/SidebarLayout.astro';
---
<SidebarLayout title="Input OTP">
  <main>
<h1>&lt;n-input-otp&gt;</h1>
    <!-- page content -->
  </main>
</SidebarLayout>
```

**The override** (in `src/data/pages.ts`):

```ts
const titleOverrides: Record<string, string> = {
  // ...existing...
  '/components/ui-input-otp': 'Input OTP',
};
```

Without override: `slugToTitle('ui-input-otp', 'Components')` strips `ui-` and
Title Cases each word, producing "Input Otp". The override fixes casing.

**Expected result:**
- Sidebar, breadcrumb, and command palette all show "Input OTP"
- `title` prop on `SidebarLayout` should match the override value
