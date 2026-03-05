// View Transition–safe page initialization helper.
//
// Problem: On the first client-side navigation to a page, the page's module
// script loads ASYNC (via swapHeadElements), but astro:page-load fires SYNC
// right after the swap. The page's event listener is registered too late and
// misses the event. On subsequent visits, the listener is already registered.
//
// Solution: Run the callback immediately (for the first-visit case) AND
// register it for future astro:page-load events (for subsequent navigations).
// The guard element ID prevents the callback from running on wrong pages.
// A WeakSet tracks which elements have been initialized to prevent double-init
// on hard reload (where both the immediate call and page-load event fire).

const initialized = new WeakSet<HTMLElement>();

export function onPageLoad(guardId: string, callback: (el: HTMLElement) => void) {
  function run() {
    const el = document.getElementById(guardId);
    if (!el || initialized.has(el)) return;
    initialized.add(el);
    callback(el);
  }

  // Immediate call — handles first client-side navigation where
  // this script loaded after astro:page-load already fired.
  run();

  // Future navigations — the guard element changes on each navigation
  // (new DOM node), so the WeakSet naturally allows re-initialization.
  document.addEventListener('astro:page-load', run);
}
