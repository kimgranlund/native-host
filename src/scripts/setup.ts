// Setup script — registers traits and components.
// All registrations live here so elements are defined before any
// client-side navigation. Chunks are cached after the first page load.
import '@nonoun/native-ui/register';
import '@nonoun/native-dashboard';
import '@nonoun/native-ai/register';
import '@nonoun/native-design';
import '@nonoun/native-code/register';
import '@nonoun/native-data-viz/register';
import { registerAllTraits } from '@nonoun/native-ui';

registerAllTraits();

// n-dashboard-panel: CSS-driven layout panel used for the main content area.
// native-app 0.3.x removed the JS class but kept the CSS. Register a minimal
// element so :not(:defined) doesn't hide it. Aside panels now use component-
// specific elements (native-design-panel, native-chat-panel).
if (!customElements.get('n-dashboard-panel')) {
  customElements.define('n-dashboard-panel', class extends HTMLElement {});
}
