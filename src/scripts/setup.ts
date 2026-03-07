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
