#!/usr/bin/env python3
"""Add the Rise & Fall of Supertech video to videos.ts so its watch page renders.
Idempotent. Run from PS-in/."""
import os, sys
F = os.path.join(os.path.dirname(__file__), "src", "lib", "videos.ts")
s = open(F, "rb").read().decode("utf-8").replace("\r\n", "\n")

SLUG = "rise-and-fall-of-supertech-twin-towers"
if SLUG in s:
    print("Already present."); sys.exit(0)

entry = (
    "  {\n"
    '    "slug": "rise-and-fall-of-supertech-twin-towers",\n'
    '    "title": "Rise and Fall of Supertech: The Twin Tower Story",\n'
    '    "description": "The full rise and fall of Supertech - the Noida Twin Tower story, RK Arora, Supernova, NBCC and the 50,000 families still waiting for their homes.",\n'
    '    "youtubeId": "zhXSWOzPrAs",\n'
    '    "thumbnail": "https://img.youtube.com/vi/zhXSWOzPrAs/maxresdefault.jpg",\n'
    '    "publishedAt": "2026-09-23",\n'
    '    "duration": "PT19M",\n'
    '    "focusKeyword": "rise and fall of supertech",\n'
    '    "category": "Real Estate",\n'
    '    "views": "1K views"\n'
    "  },\n"
)

anchor = "export const videos: Video[] = [\n"
i = s.find(anchor)
if i == -1:
    print("ERROR: could not find videos array declaration"); sys.exit(1)
at = i + len(anchor)
s = s[:at] + entry + s[at:]
open(F, "w", encoding="utf-8", newline="\n").write(s)
print("Inserted. slug count now:", s.count('"slug":'))
