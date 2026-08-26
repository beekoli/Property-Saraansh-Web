/**
 * Guards the two-channel setup.
 *
 * Property Saraansh publishes from a main channel and a Reviews channel. Both
 * feed /our-videos, both are listed in the Organization schema, and a watch
 * page names the one its video came from. The failure modes worth pinning:
 * a video from the Reviews channel being rejected as "not ours", and an older
 * curated entry with no channelId being attributed to the wrong channel.
 *
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/verify-channels.ts
 */
import {
  CHANNELS,
  CHANNEL_URLS,
  MAIN_CHANNEL,
  REVIEWS_CHANNEL,
  channelById,
  isOwnChannel,
  subscribeUrl,
  uploadsPlaylistId,
} from "../src/lib/channels";

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}  → ${JSON.stringify(actual)}${ok ? "" : ` (expected ${JSON.stringify(expected)})`}`);
}

check("both channels are registered", CHANNELS.length, 2);
check("main channel id", MAIN_CHANNEL.id, "UC5eDcgQ_bYCzNrJUm34C4_w");
check("reviews channel id", REVIEWS_CHANNEL.id, "UChOfCm-Xo4NABiBfKuw7H0g");
check("the two ids are distinct", MAIN_CHANNEL.id === REVIEWS_CHANNEL.id, false);

// A video from either channel is ours; anyone else's is not.
check("main channel is ours", isOwnChannel(MAIN_CHANNEL.id), true);
check("reviews channel is ours", isOwnChannel(REVIEWS_CHANNEL.id), true);
check("a stranger's channel is not ours", isOwnChannel("UCstrangerchannelid00"), false);
check("no channel id is not ours", isOwnChannel(undefined), false);

check("reviews id resolves to the reviews channel", channelById(REVIEWS_CHANNEL.id)?.name, "Property Saraansh Reviews");
check("unknown id resolves to nothing", channelById("UCnope"), undefined);

// "UC…" → "UU…" is how YouTube names a channel's uploads playlist.
check("uploads playlist for main", uploadsPlaylistId(MAIN_CHANNEL.id), "UU5eDcgQ_bYCzNrJUm34C4_w");
check("uploads playlist for reviews", uploadsPlaylistId(REVIEWS_CHANNEL.id), "UUhOfCm-Xo4NABiBfKuw7H0g");

check("both channel URLs go into sameAs", CHANNEL_URLS, [
  "https://www.youtube.com/@PropertySaraansh",
  "https://www.youtube.com/@PropertySaraanshReviews",
]);
check("subscribe link is one-click", subscribeUrl(REVIEWS_CHANNEL), "https://www.youtube.com/@PropertySaraanshReviews?sub_confirmation=1");

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
