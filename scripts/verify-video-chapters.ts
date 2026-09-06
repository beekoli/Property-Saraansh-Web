/**
 * Verifies the chapter parser that drives Google "Key Moments" (schema.org
 * Clip) on the watch pages. Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-video-chapters.ts
 *
 * The important guarantee here is that the two videos whose chapters used to be
 * hardcoded in src/app/our-videos/[slug]/page.tsx still produce byte-identical
 * offsets now that they come from the text format.
 */
import {
  parseChapters,
  parseTimeParam,
  timestampToSeconds,
  secondsToTimestamp,
  toClips,
  FALLBACK_CHAPTERS,
} from '../src/lib/videoChapters';

let failures = 0;

function check(label: string, got: unknown, want: unknown) {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) {
    failures++;
    console.log(`FAIL  ${label}\n  got  ${g}\n  want ${w}`);
  } else {
    console.log(`pass  ${label}`);
  }
}

// --- timestamps ---
check('12:23 -> 743', timestampToSeconds('12:23'), 743);
check('1:02:30 -> 3750', timestampToSeconds('1:02:30'), 3750);
check('12:99 rejected', timestampToSeconds('12:99'), undefined);
check('743 -> 12:23', secondsToTimestamp(743), '12:23');
check('3750 -> 1:02:30', secondsToTimestamp(3750), '1:02:30');

// --- ?t= forms that appear in the wild ---
check('t=510', parseTimeParam('510'), 510);
check('t=510s', parseTimeParam('510s'), 510);
check('t=8m30s', parseTimeParam('8m30s'), 510);
check('t=1h2m30s', parseTimeParam('1h2m30s'), 3750);
check('t=8:30', parseTimeParam('8:30'), 510);
check('t=abc rejected', parseTimeParam('abc'), undefined);

// --- offsets must match what was hardcoded before ---
const noida = parseChapters(FALLBACK_CHAPTERS['noida-market-slowdown-2026'], 720);
check('noida starts', noida.map((c) => c.startOffset), [45, 96, 371, 509]);
check('noida ends', noida.map((c) => c.endOffset), [96, 371, 509, 720]);
check('noida labels', noida.map((c) => c.label), ['0:45', '1:36', '6:11', '8:29']);

const arden = parseChapters(FALLBACK_CHAPTERS['godrej-arden-sigma-3-review'], 743);
check('arden starts', arden.map((c) => c.startOffset), [0, 139, 237, 455, 521, 647]);
check('arden ends', arden.map((c) => c.endOffset), [139, 237, 455, 521, 647, 743]);

// --- what editors will actually paste ---
const messy = parseChapters(
  `Chapters:\n[2:00] - Second thing\n0:30 – First thing\n0:30 Duplicate start\nnot a chapter line\n4:00: Third thing`,
  600
);
check('messy sorted + deduped', messy.map((c) => c.startOffset), [30, 120, 240]);
check('messy names', messy.map((c) => c.name), ['First thing', 'Second thing', 'Third thing']);

// --- guards: never emit invalid markup ---
check('single chapter suppressed', parseChapters('0:00 Only one', 600), []);
check('empty suppressed', parseChapters(undefined, 600), []);
check(
  'timestamps past the runtime dropped',
  parseChapters('0:30 A\n1:00 B\n20:00 Stale', 600).map((c) => c.startOffset),
  [30, 60]
);

// --- clip URLs must point at our own watch page and carry ?t= ---
const clips = toClips(noida, 'https://www.propertysaraansh.com/our-videos/noida-market-slowdown-2026');
check(
  'clip url seeks',
  clips[2].url,
  'https://www.propertysaraansh.com/our-videos/noida-market-slowdown-2026?t=371'
);
check('clip shape', Object.keys(clips[0]), ['@type', 'name', 'startOffset', 'endOffset', 'url']);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILING`);
process.exit(failures === 0 ? 0 : 1);
