/**
 * Checks formatReraDate against the shapes the field can actually hold.
 * Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-rera-date-format.ts
 */
import { formatReraDate } from "../src/lib/formatDate";

let failures = 0;
function check(input: string | undefined, expected: string) {
  const actual = formatReraDate(input);
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${JSON.stringify(input)} -> ${JSON.stringify(actual)}${ok ? '' : ` (want ${JSON.stringify(expected)})`}`);
}

console.log('Real values written from the UP RERA portal');
check('2031-02-15', '15 February 2031');
check('2023-06-29', '29 June 2023');
check('2027-11-16', '16 November 2027');
check('2024-12-23', '23 December 2024');
check('2028-05-28', '28 May 2028');

console.log('\nLeading zeros are dropped from the day, not the year');
check('2026-03-31', '31 March 2026');
check('2030-01-29', '29 January 2030');

console.log('\nAnything not a clean ISO date passes through untouched');
check('', '');
check(undefined, '');
check('  2031-02-15  ', '15 February 2031');
check('Q1 2031', 'Q1 2031');
check('2031-13-01', '2031-13-01');
check('15-02-2031', '15-02-2031');
check('2031-02', '2031-02');

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
