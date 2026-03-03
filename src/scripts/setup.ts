// Setup script — registers traits and components.
import '@nonoun/native-ui/register';
import '@nonoun/native-app';
import '@nonoun/native-chat/register';
import { registerAllTraits } from '@nonoun/native-ui';

registerAllTraits();

// n-app-panel: CSS-driven layout panel used for the main content area.
// native-app 0.3.x removed the JS class but kept the CSS. Register a minimal
// element so :not(:defined) doesn't hide it. Aside panels now use component-
// specific elements (native-tokens-panel, native-chat-panel).
if (!customElements.get('n-app-panel')) {
  customElements.define('n-app-panel', class extends HTMLElement {});
}
