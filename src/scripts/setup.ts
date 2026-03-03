// Setup script — registers traits and components.
import '@nonoun/native-ui/register';
import '@nonoun/native-app';
import '@nonoun/native-chat/register';
import { registerAllTraits } from '@nonoun/native-ui';

registerAllTraits();

// n-app-panel: CSS-driven layout panel. native-app 0.3.0 removed the JS class
// but kept the CSS. Register a minimal element so :not(:defined) doesn't hide it
// and layout.ts can call .toggle().
if (!customElements.get('n-app-panel')) {
  customElements.define('n-app-panel', class extends HTMLElement {
    get open() { return this.hasAttribute('open'); }
    set open(v: boolean) { this.toggleAttribute('open', v); }
    toggle() { this.open = !this.open; }
  });
}
