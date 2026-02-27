// Setup script — registers traits THEN registers components.
// Uses dynamic import for register to guarantee execution order:
// traits MUST be registered before customElements.define() triggers element upgrades.
import * as nativeUI from '@nonoun/native-ui';

// 1. Register all traits first
nativeUI.registerAllTraits();

// 2. NOW register custom elements — traits are guaranteed available
await import('@nonoun/native-ui/register');
