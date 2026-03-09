import { logPrepend } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  const lineChart = document.getElementById('chart-line');
  if (!lineChart) return;

  // ── Shared data ──

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueData = {
    series: [
      { name: 'Revenue', data: months.map((m, i) => ({ x: m, y: [42, 58, 65, 51, 73, 82, 91, 78, 88, 95, 102, 110][i] })) },
      { name: 'Costs', data: months.map((m, i) => ({ x: m, y: [35, 40, 45, 42, 48, 52, 55, 50, 54, 58, 62, 65][i] })) },
    ]
  };

  const productData = {
    series: [
      { name: 'Q1', data: [{ x: 'Product A', y: 120 }, { x: 'Product B', y: 95 }, { x: 'Product C', y: 150 }, { x: 'Product D', y: 80 }] },
      { name: 'Q2', data: [{ x: 'Product A', y: 140 }, { x: 'Product B', y: 110 }, { x: 'Product C', y: 130 }, { x: 'Product D', y: 100 }] },
    ]
  };

  const sixSeriesData = {
    series: [
      { name: 'Organic', data: months.map((m, i) => ({ x: m, y: 30 + Math.round(Math.sin(i * 0.5) * 15 + i * 3) })) },
      { name: 'Paid', data: months.map((m, i) => ({ x: m, y: 20 + Math.round(Math.cos(i * 0.6) * 10 + i * 2) })) },
      { name: 'Referral', data: months.map((m, i) => ({ x: m, y: 15 + Math.round(Math.sin(i * 0.3) * 8 + i * 1.5) })) },
      { name: 'Social', data: months.map((m, i) => ({ x: m, y: 10 + Math.round(Math.cos(i * 0.4) * 6 + i * 1) })) },
      { name: 'Email', data: months.map((m, i) => ({ x: m, y: 8 + Math.round(Math.sin(i * 0.7) * 5 + i * 0.8) })) },
      { name: 'Direct', data: months.map((m, i) => ({ x: m, y: 25 + Math.round(Math.cos(i * 0.5) * 12 + i * 2.5) })) },
    ]
  };

  const singleSeries = { series: [revenueData.series[0]] };

  const sparkData = [
    [12, 15, 13, 18, 22, 20, 25, 23, 28, 30],
    [50, 48, 45, 47, 42, 40, 38, 35, 37, 33],
    [5, 8, 12, 10, 15, 18, 14, 20, 22, 25],
    [100, 98, 102, 97, 105, 103, 108, 110, 107, 112],
  ];

  // ── Widget Tier — KPI Sparklines ──

  sparkData.forEach((values, i) => {
    const el = document.getElementById(`spark-${i + 1}`);
    if (el) el.data = { series: [{ name: 'trend', data: values.map((y, x) => ({ x, y })) }] };
  });

  // ── Card Tier — Compact Charts ──

  document.getElementById('card-line').data = revenueData;
  document.getElementById('card-bar').data = productData;
  document.getElementById('card-area').data = singleSeries;
  document.getElementById('card-scatter').data = {
    series: [{
      name: 'Users',
      data: Array.from({ length: 20 }, () => ({
        x: Math.round(Math.random() * 100),
        y: Math.round(Math.random() * 80 + 10),
      })),
    }],
  };

  // ── Dashboard charts ──

  lineChart.data = revenueData;
  document.getElementById('chart-smooth-area').data = revenueData;

  // ── Bar Chart Modes ──

  document.getElementById('chart-bar-grouped').data = productData;
  document.getElementById('chart-bar-stacked').data = productData;

  // ── Horizontal Bar ──

  document.getElementById('chart-bar-horizontal').data = {
    series: [{
      name: 'Duration (min)',
      data: [{ x: 'Setup', y: 12 }, { x: 'Build', y: 34 }, { x: 'Test', y: 28 }, { x: 'Deploy', y: 8 }, { x: 'Verify', y: 5 }],
    }],
  };

  // ── Scatter / Bubble ──

  document.getElementById('chart-scatter').data = {
    series: [
      { name: 'Cluster A', data: Array.from({ length: 30 }, () => ({ x: Math.random() * 100, y: Math.random() * 80 + 10, r: Math.random() * 20 + 5 })) },
      { name: 'Cluster B', data: Array.from({ length: 25 }, () => ({ x: Math.random() * 60 + 40, y: Math.random() * 60 + 30, r: Math.random() * 15 + 3 })) },
    ]
  };

  // ── Stacked Area ──

  document.getElementById('chart-stacked-area').data = sixSeriesData;

  // ── Reference Lines ──

  const refChart = document.getElementById('chart-reference');
  refChart.data = revenueData;
  refChart.referenceLines = [
    { axis: 'y', value: 80, label: 'Target', color: 'var(--n-color-success-500)', style: 'dashed' },
    { axis: 'y', value: 50, label: 'Baseline', color: 'var(--n-color-warning-500)', style: 'dotted' },
    { axis: 'x', value: 'Jul', label: 'Launch', color: 'var(--n-color-info-500)', style: 'solid' },
  ];

  // ── Average Lines ──

  document.getElementById('chart-average').data = revenueData;

  // ── Reference + Average Combined ──

  const refAvgChart = document.getElementById('chart-ref-avg');
  refAvgChart.data = revenueData;
  refAvgChart.referenceLines = [
    { axis: 'y', value: 100, label: 'Goal', color: 'var(--n-color-success-500)', style: 'dashed' },
  ];

  // ── Grid Modes ──

  const gridData = {
    series: [{ name: 'Sales', data: months.slice(0, 6).map((m, i) => ({ x: m, y: [20, 35, 28, 45, 38, 52][i] })) }],
  };
  ['h', 'v', 'b', 'n'].forEach(g => {
    const el = document.getElementById(`chart-grid-${g}`);
    if (el) el.data = gridData;
  });

  // ── Legend Positions ──

  ['top', 'bottom', 'none'].forEach(pos => {
    const el = document.getElementById(`chart-legend-${pos}`);
    if (el) el.data = revenueData;
  });

  // ── Aspect Ratios ──

  document.getElementById('chart-aspect-16').data = revenueData;
  document.getElementById('chart-aspect-1').data = revenueData;

  // ── Custom Series Colors ──

  document.getElementById('chart-custom-colors').data = {
    series: [
      { name: 'Alpha', color: 'oklch(0.65 0.2 260)', data: months.slice(0, 6).map((m, i) => ({ x: m, y: [30, 45, 38, 55, 48, 62][i] })) },
      { name: 'Beta', color: 'oklch(0.7 0.18 340)', data: months.slice(0, 6).map((m, i) => ({ x: m, y: [20, 32, 28, 42, 35, 50][i] })) },
      { name: 'Gamma', color: 'oklch(0.75 0.15 140)', data: months.slice(0, 6).map((m, i) => ({ x: m, y: [15, 22, 18, 30, 25, 38][i] })) },
    ],
  };

  // ── Multi-Series Full Palette ──

  document.getElementById('chart-full-palette').data = sixSeriesData;

  // ── Palette Switcher ──

  const paletteChart = document.getElementById('chart-palette');
  paletteChart.data = sixSeriesData;
  const paletteSelect = document.getElementById('palette-select');
  paletteSelect?.addEventListener('native:change', (e) => {
    paletteChart.palette = e.detail.value;
  });

  // ── Sparklines in Table ──

  sparkData.forEach((values, i) => {
    const el = document.getElementById(`table-spark-${i + 1}`);
    if (el) el.data = { series: [{ name: 'trend', data: values.map((y, x) => ({ x, y })) }] };
  });

  // ── Animate ──

  document.getElementById('chart-animate').data = productData;

  // ── Disabled ──

  document.getElementById('chart-disabled').data = revenueData;

  // ── Events ──

  const eventsChart = document.getElementById('chart-events');
  const eventLog = document.getElementById('chart-event-log');
  eventsChart.data = revenueData;

  eventsChart.addEventListener('native:chart-hover', (e) => {
    if (e.detail?.point) logPrepend(eventLog, `hover — ${e.detail.series}: (${e.detail.point.x}, ${e.detail.point.y})`);
  });
  eventsChart.addEventListener('native:chart-select', (e) => {
    logPrepend(eventLog, `select — ${e.detail.series}: (${e.detail.point.x}, ${e.detail.point.y})`);
  });
  eventsChart.addEventListener('native:chart-legend-toggle', (e) => {
    logPrepend(eventLog, `legend-toggle — ${e.detail.series}: visible=${e.detail.visible}`);
  });
});
