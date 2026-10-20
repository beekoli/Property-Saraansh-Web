#!/usr/bin/env python3
"""Gate the blog video section so it only renders when a real video is set.
Idempotent: safe to run multiple times. Run from PS-in/."""
import os, re, sys

F = os.path.join(os.path.dirname(__file__), "src", "app", "blog", "[slug]", "page.tsx")
s = open(F, "rb").read().decode("utf-8").replace("\r\n", "\n")

if "const hasVideo" in s:
    print("Already patched (hasVideo present).")
else:
    # 1) Replace the video-resolve block (drop the generic fallback + default video)
    new_block = (
        '  let relatedVideoId = acfVideoId || "";\n'
        "  if (slug.includes('noida-residents') || slug.includes('nobody-talks')) {\n"
        '    relatedVideoId = "z-nxbCBtffY";\n'
        "  } else if (slug === 'noida-real-estate-2026-dasnac-arc-fairfox-eon') {\n"
        '    relatedVideoId = "LJo0YtPpTnY";\n'
        "  } else if (slug.includes('godrej-arden-detailed-review')) {\n"
        '    relatedVideoId = "tWk2i0WUqiY";\n'
        "  }\n"
        "  const hasVideo = !!relatedVideoId;\n"
    )
    s2, n = re.subn(
        r'  let relatedVideoId = acfVideoId \|\| "xicR-MeU77g";.*?\n  }\n',
        new_block, s, count=1, flags=re.DOTALL,
    )
    if n != 1:
        print("ERROR: could not match video-resolve block"); sys.exit(1)
    s = s2

    # 2) Gate the VideoObject JSON-LD script
    old_schema = ('      <script\n'
                  '        type="application/ld+json"\n'
                  '        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}\n'
                  '      />')
    new_schema = ('      {hasVideo && (\n'
                  '        <script\n'
                  '          type="application/ld+json"\n'
                  '          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}\n'
                  '        />\n'
                  '      )}')
    if old_schema not in s:
        print("ERROR: could not match videoJsonLd script"); sys.exit(1)
    s = s.replace(old_schema, new_schema, 1)

    # 3) Gate the video section JSX (open + close)
    open_div = '            <div className="mb-10 bg-brand-dark text-white rounded-3xl p-6 md:p-8 shadow-xl border border-brand-primary">'
    if open_div not in s:
        print("ERROR: could not match video section opening div"); sys.exit(1)
    s = s.replace(open_div, '            {hasVideo && (\n' + open_div, 1)
    close_anchor = '            </div>\n\n            {/* Table of Contents'
    if close_anchor not in s:
        print("ERROR: could not match video section closing anchor"); sys.exit(1)
    s = s.replace(close_anchor, '            </div>\n            )}\n\n            {/* Table of Contents', 1)

    open(F, "w", encoding="utf-8", newline="\n").write(s)
    print("Patched OK. hasVideo occurrences:", s.count("hasVideo"))
