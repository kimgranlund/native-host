// Shared event log utility for demo pages.
// Two modes: prepend (newest-first, .log containers) and append (oldest-first, .output containers).

/** Prepend a log entry (newest on top). Used with .log containers. */
export function logPrepend(el: Element | null, msg: string) {
  if (!el) return;
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = msg;
  el.prepend(entry);
}

/** Append a log entry (oldest on top, auto-scroll). Used with .output containers. */
export function logAppend(el: Element | null, msg: string, maxEntries = 20) {
  if (!el) return;
  const line = document.createElement('div');
  line.textContent = msg;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
  while (el.children.length > maxEntries) el.removeChild(el.firstChild!);
}
