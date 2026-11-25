// Lightweight, read-only progress view; safe while the sole 3D soak browser runs.
const fs = require('node:fs');
const path = require('node:path');
const file = path.resolve(__dirname, '../evidence/v6-soak.json');
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const last = report.phases?.at(-1);
console.log(JSON.stringify({
  observedAt: new Date().toISOString(),
  writtenAt: fs.statSync(file).mtime.toISOString(),
  build: report.build,
  startedAt: report.startedMs ? new Date(report.startedMs).toISOString() : null,
  minutesCompleted: last ? +(last.elapsedMs / 60000).toFixed(2) : 0,
  phases: report.phases?.length || 0,
  round: last?.round,
  state: last ? `${last.form}/${last.name}` : null,
  latestAverageMs: last?.averageMs,
  latestP95Ms: last?.p95Ms,
  latestMemory: last?.memory,
  errors: report.errors,
  passed: report.passed ?? null,
  failure: report.failure ?? null,
}, null, 2));
