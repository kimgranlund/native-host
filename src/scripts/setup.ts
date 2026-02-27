// Setup script — registers traits, exposes globals, THEN registers components.
// Uses dynamic import for register to guarantee execution order:
// traits MUST be registered before customElements.define() triggers element upgrades.
import * as nativeUI from '@nonoun/native-ui';
import * as kernel from '@nonoun/native-ui/kernel';

// 1. Register all traits first
nativeUI.registerAllTraits();

// 2. Expose all exports on window for snippet inline scripts
Object.assign(window, nativeUI, kernel);

// 3. Signal that globals are ready (promise was created in BaseLayout <head>)
(window as any).__nativeUIResolve?.();

// 4. NOW register custom elements — traits are guaranteed available
await import('@nonoun/native-ui/register');
