/**
 * prelaunch — which projects are still pre-launch, and what they may say.
 *
 * The rule, in the owner's words: **no RERA number means the project is in its
 * pre-launch phase.** A project cannot legally be registered before it exists,
 * so the absence of a registration number is the cleanest available signal that
 * it has not formally launched. A launch date in the future says the same thing
 * and is treated identically.
 *
 * One guard sits on top of that, and it earns its place.
 *
 * A blank `rera_number` in WordPress can mean two different things: the project
 * genuinely has no registration, or nobody has typed the number in. Four
 * projects are in that state today, and three of them — ACE Golfshire, ACE
 * Platinum, ACE Aspire — are Delivered or Ready to Move. None of the three
 * appears in UP RERA's registered-projects list, which is expected: a
 * registration lapses once a project completes and moves to the completed list.
 * So for those three the blank field means "finished years ago", the exact
 * opposite of pre-launch.
 *
 * Rendering PRE-LAUNCH on an occupied tower would be a false claim on a page
 * that generates leads. So a project whose possession says it is delivered or
 * ready to move is never treated as pre-launch, whatever its RERA field says —
 * being delivered is itself proof that it launched. Remove `looksDelivered`
 * from `isPreLaunch` if you ever want the raw rule with no guard.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Relative rather than "@/lib/launchDate" so the verify script can run this
// module under plain ts-node, which does not resolve the "@/" path alias.
import { parseLaunchDate } from "./launchDate";

type WithAcf = { acf?: any };

/** ACF checkboxes arrive as true, 1, "1" or "yes" depending on how the field is configured. */
function isTicked(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "on";
  }
  return false;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** True once a RERA registration number has been recorded. */
export function hasReraNumber(prop: WithAcf): boolean {
  return text(prop?.acf?.rera_number) !== "";
}

/**
 * The possession field is marketing prose, and when it says delivered or ready
 * to move that is a definitive statement that the project launched. Used only
 * to veto a pre-launch label, never to apply one.
 */
export function looksDelivered(prop: WithAcf): boolean {
  return /deliver|ready to move|ready-to-move/i.test(text(prop?.acf?.possession_date));
}

/** A launch date still in the future means the project has not launched yet. */
export function launchesInFuture(prop: WithAcf, now: number = Date.now()): boolean {
  const parsed = parseLaunchDate(text(prop?.acf?.launch_date));
  return parsed ? parsed.time > now : false;
}

/**
 * Pre-launch when there is no RERA registration, or the launch date is still
 * ahead of us — unless the project has already been delivered, or an editor has
 * ticked `is_prelaunch` to force the label on.
 */
export function isPreLaunch(prop: WithAcf, now: number = Date.now()): boolean {
  if (isTicked(prop?.acf?.is_prelaunch)) return true;
  if (looksDelivered(prop)) return false;
  return !hasReraNumber(prop) || launchesInFuture(prop, now);
}

/**
 * The editor's own words for when the project is expected to open — "Q1 2027".
 * Free text on purpose: nothing about an unregistered project is firm enough to
 * deserve a date picker, and we never compute or infer this value.
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
 * Split a listing into registered projects and pre-launch ones. Input order is
 * preserved within each group, so an already launch-date-sorted list stays
 * sorted.
 */
export function partitionPreLaunch<T extends WithAcf>(
  items: T[],
  now: number = Date.now()
): { registered: T[]; preLaunch: T[] } {
  const registered: T[] = [];
  const preLaunch: T[] = [];
  for (const item of items) {
    (isPreLaunch(item, now) ? preLaunch : registered).push(item);
  }
  return { registered, preLaunch };
}
