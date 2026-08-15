/**
 * prelaunch — which projects belong in the Pre-Launch section, and what they
 * are allowed to say.
 *
 * A project is pre-launch only when an editor has deliberately ticked the
 * `is_prelaunch` checkbox in WordPress AND the project has no RERA number.
 *
 * Both halves matter, for different reasons:
 *
 *   The checkbox is required because a missing RERA number does NOT mean a
 *   project is unregistered — it usually means nobody has typed the number in
 *   yet. Four projects are in that state today, and two of them (ACE Golfshire,
 *   ACE Platinum) are Ready to Move. Inferring pre-launch status from a blank
 *   field would advertise finished, occupied towers as unlaunched.
 *
 *   The RERA number is required because that is the promotion trigger the
 *   business wants: the moment a registration number exists, the project has
 *   launched and belongs in the main listing, whether or not anyone remembered
 *   to untick the box. Data entry should not be able to strand a registered
 *   project in a pre-launch bucket.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type WithAcf = { acf?: any };

/** ACF checkboxes arrive as true, 1, "1" or "yes" depending on how the field is configured. */
function isTicked(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v === '1' || v === 'true' || v === 'yes' || v === 'on';
  }
  return false;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** True once a RERA registration number has been recorded. */
export function hasReraNumber(prop: WithAcf): boolean {
  return text(prop?.acf?.rera_number) !== '';
}

/**
 * Pre-launch = explicitly flagged and not yet registered. Entering a RERA
 * number promotes the project into the main listing on the next revalidate,
 * with no other edit required.
 */
export function isPreLaunch(prop: WithAcf): boolean {
  return isTicked(prop?.acf?.is_prelaunch) && !hasReraNumber(prop);
}

/**
 * The editor's own words for when the project is expected to open — "Q1 2027",
 * "Expected early 2027". Free text on purpose: nothing about an unregistered
 * project is firm enough to deserve a date picker, and we never compute or
 * infer this value.
 */
export function expectedLaunch(prop: WithAcf): string {
  return text(prop?.acf?.expected_launch);
}

/** "Expected launch — Q1 2027", or null when the editor has not said. */
export function expectedLaunchLine(prop: WithAcf): string | null {
  const value = expectedLaunch(prop);
  return value ? `Expected launch — ${value}` : null;
}

/**
 * Split a listing into the projects that carry a registration and the ones
 * still in pre-launch. Input order is preserved within each group, so an
 * already launch-date-sorted list stays sorted.
 */
export function partitionPreLaunch<T extends WithAcf>(items: T[]): { registered: T[]; preLaunch: T[] } {
  const registered: T[] = [];
  const preLaunch: T[] = [];
  for (const item of items) {
    (isPreLaunch(item) ? preLaunch : registered).push(item);
  }
  return { registered, preLaunch };
}
