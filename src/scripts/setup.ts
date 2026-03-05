// Setup script — registers traits and components.
// All element registrations live here so they're available before any
// client-side navigation. Module scripts run once; if a registration
// only lived in a page/layout script, the first View Transition to that
// page could race: astro:page-load fires before the async module loads.
import '@nonoun/native-ui/register';
import '@nonoun/native-app';
import '@nonoun/native-chat/register';
import '@nonoun/native-tokens';
import { registerAllTraits } from '@nonoun/native-ui';

registerAllTraits();

// n-app-panel: CSS-driven layout panel used for the main content area.
// native-app 0.3.x removed the JS class but kept the CSS. Register a minimal
// element so :not(:defined) doesn't hide it. Aside panels now use component-
// specific elements (native-tokens-panel, native-chat-panel).
if (!customElements.get('n-app-panel')) {
  customElements.define('n-app-panel', class extends HTMLElement {});
}
