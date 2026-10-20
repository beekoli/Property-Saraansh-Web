#!/usr/bin/env python3
"""Add the 4 BHK comparison video to videos.ts so its watch page renders.
Idempotent. Run from PS-in/."""
import os, sys
F = os.path.join(os.path.dirname(__file__), "src", "lib", "videos.ts")
s = open(F, "rb").read().decode("utf-8").replace("\r\n", "\n")

SLUG = "4-bhk-apartments-noida-expressway-comparison"
if SLUG in s:
    print("Already present."); sys.exit(0)

entry = (
    "  {\n"
    '    "slug": "4-bhk-apartments-noida-expressway-comparison",\n'
    '    "title": "4 BHK Apartments in Noida: Godrej Riverine vs Experion Elements vs Max 128 vs M3M Cullinan",\n'
    '    "description": "Which 4 BHK in Noida wins? Godrej Riverine, Experion Elements, Max Estate 128 and M3M Cullinan compared on size, loading, price and honest verdict.",\n'
    '    "youtubeId": "-dPXsv61mPI",\n'
    '    "thumbnail": "https://img.youtube.com/vi/-dPXsv61mPI/maxresdefault.jpg",\n'
    '    "publishedAt": "2026-08-23",\n'
    '    "duration": "PT20M",\n'
    '    "focusKeyword": "4 bhk apartments in noida",\n'
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
