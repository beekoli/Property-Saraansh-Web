// Decode WordPress HTML entities (numeric + common named) so titles like
// "L&#038;T Green Reserve" / "Jacob &#038; Co" render as "L&T" / "Jacob & Co".
export const decodeHtml = (str = ""): string =>
  str
    .replace(/&#0?38;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&#8217;/g, "\u2019")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
