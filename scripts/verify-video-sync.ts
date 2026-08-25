/**
 * Guards the two numbers a video watch page states to Google.
 *
 * Both used to be wrong. The upload date was hand-typed in videos.ts and 52 of
 * the 84 entries had drifted onto the same placeholder, so videos published in
 * 2024 were declaring themselves as uploaded in June 2026. The view count was
 * reconstructed by pulling the digits out of a display string and multiplying
 * by 1000, which turned "6.1K views" into 61,000 and "741 views" into 741,000.
 *
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-video-sync.ts
 */
import { rawViewCount, publishedDate } from "../src/lib/videoStats";

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}  → ${JSON.stringify(actual)}${ok ? "" : ` (expected ${JSON.stringify(expected)})`}`);
}

// The API hands back a plain integer string; it must survive untouched.
check("6694 views stays 6694", rawViewCount("6694"), 6694);
check("741 views stays 741", rawViewCount("741"), 741);
check("no value yields undefined", rawViewCount(undefined), undefined);
check("junk yields undefined", rawViewCount("many"), undefined);

// The old expression, kept here so the regression is visible rather than
// remembered: this is what the page used to publish for the same two videos.
const oldWay = (views: string) => parseInt(views.replace(/[^0-9]/g, "")) * 1000 || 15000;
check("old hack inflated 6.1K views 10x", oldWay("6.1K views"), 61000);
check("old hack inflated 741 views 1000x", oldWay("741 views"), 741000);

// Upload dates come from YouTube, reduced to a plain date.
check("ISO timestamp reduces to a date", publishedDate("2026-03-16T05:30:00Z"), "2026-03-16");
check("2024 upload keeps its year", publishedDate("2024-06-13T11:00:00Z"), "2024-06-13");
check("missing date yields undefined", publishedDate(undefined), undefined);
check("unparseable date yields undefined", publishedDate("last Tuesday"), undefined);

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
