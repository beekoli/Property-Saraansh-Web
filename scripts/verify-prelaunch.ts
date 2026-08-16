/**
 * Verifies the pre-launch rule and the three-flag classification.
 *
 * The rule: no RERA number means pre-launch, and so does a launch date still in
 * the future. The one guard is that a delivered project is never pre-launch,
 * because a blank RERA field can equally mean "finished years ago and dropped
 * off the registered list" — which is the case for three real projects today.
 *
 * Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-prelaunch.ts
 */
import { isPreLaunch, hasReraNumber, looksDelivered, launchesInFuture, expectedLaunchLine, partitionPreLaunch } from '../src/lib/prelaunch';

const NOW = Date.UTC(2026, 7, 16); // 16 Aug 2026
const p = (acf: Record<string, unknown>) => ({ acf });

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.log(`  FAIL ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`); }
  else console.log(`  ok   ${name}`);
}

console.log('1. The rule — no RERA number means pre-launch');
check('no rera', isPreLaunch(p({ rera_number: '' }), NOW), true);
check('rera absent entirely', isPreLaunch(p({}), NOW), true);
check('whitespace-only rera', isPreLaunch(p({ rera_number: '   ' }), NOW), true);
check('has rera', isPreLaunch(p({ rera_number: 'UPRERAPRJ683816' }), NOW), false);

console.log('\n2. A future launch date also means pre-launch');
check('launches 2027', isPreLaunch(p({ rera_number: 'X1', launch_date: 'March 2027' }), NOW), true);
check('launched 2025', isPreLaunch(p({ rera_number: 'X1', launch_date: 'March 2025' }), NOW), false);
check('launched last month', isPreLaunch(p({ rera_number: 'X1', launch_date: '28 July 2026' }), NOW), false);
check('launchesInFuture direct', launchesInFuture(p({ launch_date: 'January 2028' }), NOW), true);

console.log('\n3. The guard — delivered projects are never pre-launch');
// ACE Golfshire, ACE Platinum, ACE Aspire: no RERA number in WordPress, absent
// from the registered list because they completed, all Delivered/Ready to Move.
check('ace-golfshire', isPreLaunch(p({ rera_number: '', possession_date: 'Delivered. Ready to move' }), NOW), false);
check('ace-platinum', isPreLaunch(p({ rera_number: '', possession_date: 'Delivered. Ready to move' }), NOW), false);
check('ace-aspire', isPreLaunch(p({ rera_number: '', possession_date: 'Delivered' }), NOW), false);
check('looksDelivered', looksDelivered(p({ possession_date: 'Delivered. Possession from December 2022' })), true);
check('not delivered', looksDelivered(p({ possession_date: 'December 2028 (Expected)' })), false);

console.log('\n4. The checkbox can still force the label on');
check('ticked overrides everything', isPreLaunch(p({ is_prelaunch: true, rera_number: 'X1', possession_date: 'Delivered' }), NOW), true);
for (const v of [false, 0, '0', '', null, undefined]) {
  check(`unticked as ${JSON.stringify(v)} falls through to the rule`, isPreLaunch(p({ is_prelaunch: v, rera_number: 'X1' }), NOW), false);
}

console.log('\n5. hasReraNumber');
check('present', hasReraNumber(p({ rera_number: 'UPRERAPRJ1' })), true);
check('blank', hasReraNumber(p({ rera_number: '' })), false);
check('no acf', hasReraNumber({}), false);

console.log('\n6. Expected launch line');
check('set', expectedLaunchLine(p({ expected_launch: 'Q1 2027' })), 'Expected launch — Q1 2027');
check('blank omits', expectedLaunchLine(p({ expected_launch: '' })), null);

console.log('\n7. Partition against the live shape of the catalogue');
const live = [
  { id: 'ace-terra', acf: { rera_number: 'UPRERAPRJ683816', possession_date: 'December 2028 (Expected)' } },
  { id: 'ace-golfshire', acf: { rera_number: '', possession_date: 'Delivered. Ready to move' } },
  { id: 'ace-platinum', acf: { rera_number: '', possession_date: 'Delivered. Ready to move' } },
  { id: 'ace-aspire', acf: { rera_number: '', possession_date: 'Delivered' } },
  { id: 'aspire-leisure-park', acf: { rera_number: '', possession_date: 'Under Construction' } },
];
const { registered, preLaunch } = partitionPreLaunch(live, NOW);
check('registered', registered.map((x) => x.id), ['ace-terra', 'ace-golfshire', 'ace-platinum', 'ace-aspire']);
check('preLaunch — only the genuinely unlaunched one', preLaunch.map((x) => x.id), ['aspire-leisure-park']);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
