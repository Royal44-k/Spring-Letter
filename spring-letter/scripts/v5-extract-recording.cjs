/* CPU-only frame extraction. The source WebM is never rewritten or transcoded. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const directory = path.resolve(__dirname, '../evidence');
const report = JSON.parse(fs.readFileSync(path.join(directory, 'v5-recording-verification.json'), 'utf8'));
if (process.env.SPRING_EXPECTED_ENTRY) assert.equal(report.entry, process.env.SPRING_EXPECTED_ENTRY);
assert.equal(report.uncut, true);
assert.equal(report.audioRecorded, false);
assert.deepEqual(report.errors, []);
assert.deepEqual(report.requestsFailed, []);
const source = path.join(directory, report.file);
assert.equal(fs.statSync(source).size, report.fileBytes);
assert.ok(report.mediaDurationSeconds > 0 && report.sweepSamples?.length);
const sampledPeak = report.sweepSamples.reduce((best, value) => best.scatter > value.scatter ? best : value);
const endDifference = report.wallElapsedMs / 1000 - report.mediaDurationSeconds;
const mark = name => {
  const found = report.milestones.find(item => item.name === name);
  assert.ok(found, 'Recorded milestone exists: ' + name);
  return found.wallMs / 1000;
};
const frames = [
  { file: 'v5-final-flower-video.png', mediaSeekSeconds: mark('slow-open-flower') - endDifference + 2.2,
    purpose: 'slow-open solid flower' },
  { file: 'v5-final-scatter-near-peak-early.png', mediaSeekSeconds: sampledPeak.wallMs / 1000 - endDifference - .8,
    purpose: 'before estimated sampled-peak media position' },
  { file: 'v5-final-scatter-video.png', mediaSeekSeconds: sampledPeak.wallMs / 1000 - endDifference - .4,
    purpose: 'near estimated sampled-peak media position; visually review before claiming' },
  { file: 'v5-final-scatter-near-peak-late.png', mediaSeekSeconds: sampledPeak.wallMs / 1000 - endDifference + .2,
    purpose: 'after estimated sampled-peak media position' },
  { file: 'v5-final-farewell-video.png', mediaSeekSeconds: mark('far-side-farewell') - endDifference + 3.8,
    purpose: 'far-side farewell before the letter modal' },
];
const ffmpeg = path.resolve(__dirname, '../.tools/playwright/ffmpeg-1013/ffmpeg-win64.exe');
for (const frame of frames) {
  frame.mediaSeekSeconds = Math.round(frame.mediaSeekSeconds * 1000) / 1000;
  assert.ok(frame.mediaSeekSeconds >= 0 && frame.mediaSeekSeconds < report.mediaDurationSeconds);
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-ss', String(frame.mediaSeekSeconds),
    '-i', source, '-frames:v', '1', '-y', path.join(directory, frame.file)], { encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
}
const extraction = {
  date: new Date().toISOString(), entry: report.entry, sourceFile: report.file,
  sourceSha256: crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),
  mediaDurationSeconds: report.mediaDurationSeconds, wallElapsedMs: report.wallElapsedMs,
  estimatedEndClockDifferenceSeconds: endDifference, sampledPeak, frames,
  scope: 'PNG frames decoded directly from the unchanged silent, uncut WebM. mediaSeekSeconds are requested FFmpeg media-clock seek positions; video-frame quantization still applies. The wall-minus-media duration difference is only an approximate alignment heuristic, not measured synchronization; screenshots do not establish the exact instant of the numerical sampled peak.',
};
fs.writeFileSync(path.join(directory, 'v5-recording-frame-extractions.json'), JSON.stringify(extraction, null, 2));
fs.writeFileSync(path.join(directory, 'v5-scatter-media-comparison.json'), JSON.stringify({ ...extraction,
  frames: frames.filter(frame => frame.file.includes('scatter')) }, null, 2));
console.log(JSON.stringify(extraction, null, 2));
