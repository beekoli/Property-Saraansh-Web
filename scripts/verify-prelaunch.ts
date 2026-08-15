/**
 * Verifies the Pre-Launch rules, in particular the two failure modes that
 * would be visible and embarrassing on a live consultancy site:
 *
 *   1. A registered project rendering as pre-launch.
 *   2. A finished project drifting into pre-launch because its RERA field
 *      happens to be blank in WordPress.
 *
 * Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-prelaunch.ts
 */
import { isPreLaunch, hasReraNumber, expectedLaunchLine, partitionPreLaunch } from '../src/lib/prelaunch';

const p = (acf: Record<string, unknown>) => ({ acf });

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures++;
    console.log(`  FAIL ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
  } else {
    console.log(`  ok   ${name}`);
  }
}

console.log('1. The four projects with a blank RERA field today stay OUT of pre-launch');
// ACE Golfshire, ACE Platinum (Ready to Move), ACE Aspire, Aspire Leisure Park.
// None has is_prelaunch ticked, so none may appear in the section.
for (const slug of ['ace-golfshire', 'ace-platinum', 'ace-aspire', 'aspire-leisure-park']) {
  check(slug, isPreLaunch(p({ rera_number: '', possession_date: 'Ready to Move' })), false);
}

console.log('\n2. The checkbox alone puts a project in pre-launch');
check('ticked, no RERA', isPreLaunch(p({ is_prelaunch: true, rera_number: '' })), true);
check('ticked, RERA absent entirely', isPreLaunch(p({ is_prelaunch: true })), true);

console.log('\n3. A RERA number promotes it out, even with the box still ticked');
check('ticked + RERA', isPreLaunch(p({ is_prelaunch: true, rera_number: 'UPRERAPRJ123456' })), false);
check('whitespace-only RERA does not count', isPreLaunch(p({ is_prelaunch: true, rera_number: '   ' })), true);

console.log('\n4. ACF checkbox truthiness — the field may serialise several ways');
for (const v of [true, 1, '1', 'true', 'yes', 'on']) {
  check(`ticked as ${JSON.stringify(v)}`, isPreLaunch(p({ is_prelaunch: v })), true);
}
for (const v of [false, 0, '0', '', 'false', 'no', null, undefined]) {
  check(`unticked as ${JSON.stringify(v)}`, isPreLaunch(p({ is_prelaunch: v })), false);
}

console.log('\n5. hasReraNumber');
check('present', hasReraNumber(p({ rera_number: 'UPRERAPRJ1' })), true);
check('blank', hasReraNumber(p({ rera_number: '' })), false);
check('no acf at all', hasReraNumber({}), false);

console.log('\n6. Expected launch line');
check('set', expectedLaunchLine(p({ expected_launch: 'Q1 2027' })), 'Expected launch — Q1 2027');
check('padded', expectedLaunchLine(p({ expected_launch: '  Early 2027 ' })), 'Expected launch — Early 2027');
check('blank omits the line', expectedLaunchLine(p({ expected_launch: '' })), null);
check('missing omits the line', expectedLaunchLine(p({})), null);

console.log('\n7. Partition keeps input order inside each group');
const list = [
  { id: 'a', acf: { rera_number: 'R1' } },
  { id: 'b', acf: { is_prelaunch: true } },
  { id: 'c', acf: { rera_number: 'R2' } },
  { id: 'd', acf: { is_prelaunch: true } },
  { id: 'e', acf: { is_prelaunch: true, rera_number: 'R3' } },
];
const { registered, preLaunch } = partitionPreLaunch(list);
check('registered', registered.map((x) => x.id), ['a', 'c', 'e']);
check('preLaunch', preLaunch.map((x) => x.id), ['b', 'd']);
check('nothing lost', registered.length + preLaunch.length, list.length);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
