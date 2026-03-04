// Wire up all copy buttons to copy sibling code content to clipboard.
// Selects by aria-label rather than class handle (no classes on components).
// Used across 77+ demo pages. Import from any page <script> block:
//   import '../../scripts/copy-buttons';

for (const btn of document.querySelectorAll('n-button[aria-label="Copy"]')) {
  btn.addEventListener('click', async () => {
    const code = btn.closest('.layout-code')?.querySelector('code');
    if (!code) return;
    await navigator.clipboard.writeText(code.textContent ?? '');
    const icon = btn.querySelector('n-icon');
    if (icon) {
      icon.setAttribute('name', 'check');
      setTimeout(() => icon.setAttribute('name', 'copy'), 1500);
    }
  });
}
