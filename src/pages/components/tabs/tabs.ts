document.addEventListener('astro:page-load', () => {
  const eventTabs = document.getElementById('event-tabs');
  if (!eventTabs) return;
  const tabLog = document.getElementById('tab-event-log');
  let tabCount = 0;
  eventTabs.addEventListener('native:change', (e) => {
    tabCount++;
    if (tabLog) {
      tabLog.textContent = `#${tabCount} native:change → value: "${/** @type {CustomEvent} */ (e).detail.value}"\n` + tabLog.textContent;
      if (tabLog.textContent.length > 500) tabLog.textContent = tabLog.textContent.slice(0, 500);
    }
  });
});
