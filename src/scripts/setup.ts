// Setup script — registers traits and components.
// All registrations live here so elements are defined before any
// client-side navigation. Chunks are cached after the first page load.
import '@nonoun/native-ui/register';
import '@nonoun/native-app';
import '@nonoun/native-chat/register';
import '@nonoun/native-tokens';
import '@nonoun/native-a2ui/register';
import '@nonoun/native-editor/register';
import '@nonoun/native-playground/register';
import '@nonoun/native-codemirror/register';
import '@nonoun/native-chart/register';
import { registerAllTraits } from '@nonoun/native-ui';

registerAllTraits();

// n-app-panel: CSS-driven layout panel used for the main content area.
// native-app 0.3.x removed the JS class but kept the CSS. Register a minimal
// element so :not(:defined) doesn't hide it. Aside panels now use component-
// specific elements (native-tokens-panel, native-chat-panel).
if (!customElements.get('n-app-panel')) {
  customElements.define('n-app-panel', class extends HTMLElement {});
}
