/**
 * Project status — the single flag every property card carries.
 *
 * Exactly three values exist: PRE-LAUNCH, UNDER CONSTRUCTION, READY TO MOVE.
 * Every project has one; none is ever blank.
 *
 * The order of decision, highest priority first:
 *
 *   1. `status_override` in WordPress. A person has said what this project is,
 *      and a person beats a formula. "Auto" (or empty) means fall through.
 *   2. Possession says delivered or ready to move → READY TO MOVE. That is a
 *      statement of fact about a finished building; no date arithmetic should
 *      be able to contradict it.
 *   3. Within three months of the launch date → PRE-LAUNCH. The launch date is
 *      the UP RERA project registration date, so a freshly registered project
 *      reads as pre-launch for its first quarter and then moves on by itself.
 *   4. Everything else → UNDER CONSTRUCTION. This is also where projects with
 *      no launch date land, which is deliberate: a missing date is not evidence
 *      of a new launch, and under construction is the safe assumption for a
 *      registered project that is neither new nor delivered.
 *
 * Note that the RERA number no longer drives this. It did briefly, and it
 * misfired: a blank number can equally mean a project finished long ago and
 * dropped off the registered list, which was true of three delivered towers.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Relative rather than "@/lib/launchDate" so the verify script can run this
// module under plain ts-node, which does not resolve the "@/" path alias.
import { parseLaunchDate } from "./launchDate";

type WithAcf = { acf?: any };

export type ProjectStatus = "pre-launch" | "under-construction" | "ready-to-move";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  "pre-launch": "PRE-LAUNCH",
  "under-construction": "UNDER CONSTRUCTION",
  "ready-to-move": "READY TO MOVE",
};

/** How long a project reads as pre-launch after its registration date. */
export const PRE_LAUNCH_WINDOW_MONTHS = 3;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** ACF checkboxes arrive as true, 1, "1" or "yes" depending on configuration. */
function isTicked(value: unknown): boolean {
  if (value === true || value === 1) return true;
  const v = text(value).toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** True once a RERA registration number has been recorded. */
export function hasReraNumber(prop: WithAcf): boolean {
  return text(prop?.acf?.rera_number) !== "";
}

/** Possession prose that states the building is finished. */
export function looksDelivered(prop: WithAcf): boolean {
  return /deliver|ready to move|ready-to-move/i.test(text(prop?.acf?.possession_date));
}

/**
 * The editor's explicit choice, or null for automatic. Accepts the values the
 * WordPress select offers plus a few obvious spellings, so a hand-typed
 * "Ready to move" is not silently ignored.
 */
export function statusOverride(prop: WithAcf): ProjectStatus | null {
  const raw = text(prop?.acf?.status_override).toLowerCase().replace(/[\s_]+/g, "-");
  if (!raw || raw === "auto" || raw === "automatic") {
    // The older boolean field, kept working for anything already ticked.
    return isTicked(prop?.acf?.is_prelaunch) ? "pre-launch" : null;
  }
  if (raw === "pre-launch" || raw === "prelaunch") return "pre-launch";
  if (raw === "under-construction") return "under-construction";
  if (raw === "ready-to-move" || raw === "ready") return "ready-to-move";
  return null;
}

/** Adds whole months to a timestamp, keeping the day of month where possible. */
function addMonths(time: number, months: number): number {
  const d = new Date(time);
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.getTime();
}

/**
 * True while the project is inside its pre-launch window — from the launch date
 * until three months later. A launch date still in the future counts too: the
 * project has not launched at all yet.
 */
export function withinPreLaunchWindow(prop: WithAcf, now: number = Date.now()): boolean {
  const parsed = parseLaunchDate(text(prop?.acf?.launch_date));
  if (!parsed) return false;
  return now < addMonths(parsed.time, PRE_LAUNCH_WINDOW_MONTHS);
}

/** The one flag this project carries. */
export function projectStatus(prop: WithAcf, now: number = Date.now()): ProjectStatus {
  const override = statusOverride(prop);
  if (override) return override;
  if (looksDelivered(prop)) return "ready-to-move";
  if (withinPreLaunchWindow(prop, now)) return "pre-launch";
  return "under-construction";
}

/** Convenience for the places that only care whether it is pre-launch. */
export function isPreLaunch(prop: WithAcf, now: number = Date.now()): boolean {
  return projectStatus(prop, now) === "pre-launch";
}

/**
 * The editor's own words for when the project is expected to open — "Q1 2027".
 * Free text on purpose: nothing about an unlaunched project is firm enough to
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
 * Split a listing into pre-launch projects and everything else. Input order is
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
