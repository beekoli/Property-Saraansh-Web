/**
 * Verifies the project-status rules.
 *
 * Three flags, one per project: PRE-LAUNCH, UNDER CONSTRUCTION, READY TO MOVE.
 * Priority: the WordPress override, then delivered possession, then the
 * three-month window from the launch (RERA registration) date, then under
 * construction.
 *
 * Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-prelaunch.ts
 */
import {
  projectStatus, isPreLaunch, statusOverride, looksDelivered,
  withinPreLaunchWindow, expectedLaunchLine, partitionPreLaunch,
  STATUS_LABELS, PRE_LAUNCH_WINDOW_MONTHS,
} from '../src/lib/prelaunch';

const NOW = Date.UTC(2026, 7, 16); // 16 Aug 2026
const p = (acf: Record<string, unknown>) => ({ acf });

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.log(`  FAIL ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`); }
  else console.log(`  ok   ${name}`);
}

console.log(`1. The ${PRE_LAUNCH_WINDOW_MONTHS}-month window from the launch date`);
// ACE Arte registered 28 Jul 2026 — pre-launch until 28 Oct 2026.
check('registered 19 days ago', projectStatus(p({ launch_date: '28 July 2026' }), NOW), 'pre-launch');
check('registered 2 months ago', projectStatus(p({ launch_date: '20 June 2026' }), NOW), 'pre-launch');
check('registered 4 months ago', projectStatus(p({ launch_date: '10 April 2026' }), NOW), 'under-construction');
check('registered years ago', projectStatus(p({ launch_date: 'August 2017' }), NOW), 'under-construction');
check('launch still in the future', projectStatus(p({ launch_date: 'March 2027' }), NOW), 'pre-launch');

console.log('\n2. The window boundary is exact');
check('one day before the window closes', withinPreLaunchWindow(p({ launch_date: '2026-05-17' }), NOW), true);
check('the day the window closes', withinPreLaunchWindow(p({ launch_date: '2026-05-16' }), NOW), false);
check('a 31st rolls safely into a shorter month', withinPreLaunchWindow(p({ launch_date: '2026-05-31' }), NOW), true);

console.log('\n3. Delivered beats the date maths');
check('delivered with a recent launch date', projectStatus(p({ launch_date: '28 July 2026', possession_date: 'Delivered. Ready to move' }), NOW), 'ready-to-move');
check('ready to move', projectStatus(p({ possession_date: 'Delivered. Possession from December 2022' }), NOW), 'ready-to-move');
check('looksDelivered false on an expected date', looksDelivered(p({ possession_date: 'December 2028 (Expected)' })), false);

console.log('\n4. No launch date falls to under construction, never pre-launch');
check('blank launch date', projectStatus(p({ rera_number: 'X1' }), NOW), 'under-construction');
check('unparseable launch date', projectStatus(p({ launch_date: 'TBA' }), NOW), 'under-construction');
check('blank everything', projectStatus(p({}), NOW), 'under-construction');

console.log('\n5. The WordPress override wins outright');
check('force pre-launch on a delivered project', projectStatus(p({ status_override: 'Pre-Launch', possession_date: 'Delivered' }), NOW), 'pre-launch');
check('force ready on a new registration', projectStatus(p({ status_override: 'Ready to Move', launch_date: '28 July 2026' }), NOW), 'ready-to-move');
check('force under construction', projectStatus(p({ status_override: 'Under Construction', launch_date: '28 July 2026' }), NOW), 'under-construction');
check('Auto falls through', projectStatus(p({ status_override: 'Auto', launch_date: '28 July 2026' }), NOW), 'pre-launch');
check('blank override falls through', projectStatus(p({ status_override: '', possession_date: 'Delivered' }), NOW), 'ready-to-move');
check('underscores and case tolerated', statusOverride(p({ status_override: 'ready_to_move' })), 'ready-to-move');
check('unknown value ignored', statusOverride(p({ status_override: 'something else' })), null);
check('legacy is_prelaunch checkbox still honoured', projectStatus(p({ is_prelaunch: true, launch_date: 'August 2017' }), NOW), 'pre-launch');

console.log('\n6. Labels');
check('pre-launch', STATUS_LABELS['pre-launch'], 'PRE-LAUNCH');
check('under-construction', STATUS_LABELS['under-construction'], 'UNDER CONSTRUCTION');
check('ready-to-move', STATUS_LABELS['ready-to-move'], 'READY TO MOVE');

console.log('\n7. Expected launch line');
check('set', expectedLaunchLine(p({ expected_launch: 'Q1 2027' })), 'Expected launch — Q1 2027');
check('blank omits', expectedLaunchLine(p({ expected_launch: '' })), null);

console.log('\n8. Partition against the live catalogue shape');
const live = [
  { id: 'ace-arte', acf: { launch_date: '28 July 2026' } },
  { id: 'ace-terra', acf: { launch_date: '4 April 2024', possession_date: 'December 2028 (Expected)' } },
  { id: 'ace-golfshire', acf: { rera_number: '', possession_date: 'Delivered. Ready to move' } },
  { id: 'gaur-alaris', acf: { launch_date: '28 July 2026' } },
  { id: 'crc-flagship', acf: { launch_date: 'February 2023' } },
];
const { registered, preLaunch } = partitionPreLaunch(live, NOW);
check('preLaunch', preLaunch.map((x) => x.id), ['ace-arte', 'gaur-alaris']);
check('registered', registered.map((x) => x.id), ['ace-terra', 'ace-golfshire', 'crc-flagship']);
check('isPreLaunch agrees', isPreLaunch(live[0], NOW), true);
check('nothing lost', registered.length + preLaunch.length, live.length);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
