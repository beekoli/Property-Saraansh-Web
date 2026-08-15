/**
 * Verifies the launch-date parser and sort against the 21 real `launch_date`
 * values on production as of 15 Aug 2026, plus the edge cases we expect
 * editors to type. Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-launch-sort.ts
 */
import { parseLaunchDate, launchLabel, sortByLaunchDate } from '../src/lib/launchDate';

// Exactly as they appear in WordPress today.
const LIVE: Array<[string, string]> = [
  ['ace-edit', '11 September 2025'],
  ['ace-hive', '25 March 2025'],
  ['ace-arte', 'RERA registered July 2026, allotment expected around 10 August 2026'],
  ['ace-hanei', 'October 2024'],
  ['gaur-chrysalis', '4 November 2025'],
  ['godrej-crown-residences', '15 May 2026'],
  ['dasnac-yuva', 'January 2025'],
  ['crc-maesta', ' June 2024 '],
  ['ace-verde', '2025'],
  ['ats-province-d-olympia', 'March 2025'],
  ['ace-estate', 'October 2024'],
  ['m3m-the-line', 'November 2023'],
  ['experion-saatori', 'January 2026'],
  ['ace-acreville', 'March 2025'],
  ['crc-the-flagship', 'March 2023'],
  ['godrej-riverine', 'November 2024'],
  ['max-estate-128', 'September 2023'],
  ['m3m-the-cullinan', 'April 2023'],
  ['crc-the-peridona', 'March 2026'],
  ['jacob-and-co', 'October 2025'],
  ['eldeco-7-peaks-residences', 'January 2026'],
];

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.log(`  FAIL ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`); }
  return ok;
}

console.log('1. Every live value parses to a sortable time');
for (const [slug, raw] of LIVE) {
  if (!parseLaunchDate(raw)) { failures++; console.log(`  FAIL ${slug}: "${raw}" did not parse`); }
}
console.log(`   ${LIVE.length} values, ${failures} unparsed`);

console.log('\n2. Labels print only for clean dates');
check('day+month+year', launchLabel('11 September 2025'), 'Launched Sep 2025');
check('month+year', launchLabel('October 2024'), 'Launched Oct 2024');
check('padded whitespace', launchLabel(' June 2024 '), 'Launched Jun 2024');
check('year only', launchLabel('2025'), 'Launched 2025');
check('ISO', launchLabel('2025-10-10'), 'Launched Oct 2025');
check('prose is not labelled', launchLabel(LIVE[2][1]), null);
check('empty', launchLabel(''), null);
check('undefined', launchLabel(undefined), null);
check('garbage', launchLabel('TBA'), null);

console.log('\n3. Prose still sorts, using the date inside it');
check('ace-arte time', parseLaunchDate(LIVE[2][1])?.time, Date.UTC(2026, 7, 10));

console.log('\n4. Undated projects sink, original order preserved');
const mixed = [
  { s: 'blank-a', d: '' },
  { s: 'old', d: 'March 2023' },
  { s: 'blank-b', d: undefined as unknown as string },
  { s: 'new', d: 'January 2026' },
  { s: 'blank-c', d: 'TBA' },
];
check(
  'order',
  sortByLaunchDate(mixed, (m) => m.d).map((m) => m.s),
  ['new', 'old', 'blank-a', 'blank-b', 'blank-c']
);

console.log('\n5. Full live ordering');
const ordered = sortByLaunchDate(LIVE, ([, raw]) => raw);
ordered.forEach(([slug, raw], i) => {
  console.log(`  ${String(i + 1).padStart(2)}. ${slug.padEnd(26)} ${(launchLabel(raw) ?? '(sorted, no label)').padEnd(22)} ← "${raw.trim().slice(0, 40)}"`);
});
check('newest is ace-arte', ordered[0][0], 'ace-arte');
check('oldest is crc-the-flagship', ordered[ordered.length - 1][0], 'crc-the-flagship');
check('descending', ordered.every((r, i) => i === 0 || parseLaunchDate(ordered[i - 1][1])!.time >= parseLaunchDate(r[1])!.time), true);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
