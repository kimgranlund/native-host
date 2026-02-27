// Wire up all .copy-btn elements to copy sibling code content to clipboard.
// Used across 44+ demo pages. Import from any page <script> block:
//   import '../../scripts/copy-buttons';

for (const btn of document.querySelectorAll('.copy-btn')) {
  btn.addEventListener('click', async () => {
    const code = btn.closest('.layout-code')?.querySelector('code');
    if (!code) return;
    await navigator.clipboard.writeText(code.textContent ?? '');
    const icon = btn.querySelector('ui-icon');
    if (icon) {
      icon.setAttribute('name', 'check');
      setTimeout(() => icon.setAttribute('name', 'copy'), 1500);
    }
  });
}
