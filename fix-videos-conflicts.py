#!/usr/bin/env python3
"""
Fix videos.ts: remove git conflict markers and apply ACE Hanei SEO correction.
Run from: D:\Cloude agent\PS website\Property saraansh website\PS-in\
"""
import os, re, sys, hashlib

VIDEOS_PATH = os.path.join(os.path.dirname(__file__), "src", "lib", "videos.ts")

# Read in binary and normalize CRLF -> LF to handle Windows line endings robustly
with open(VIDEOS_PATH, "rb") as f:
    raw_bytes = f.read()

raw = raw_bytes.decode("utf-8").replace("\r\n", "\n")
original_hash = hashlib.md5(raw.encode()).hexdigest()
print(f"File read: {len(raw.splitlines())} lines, md5={original_hash[:8]}")

# Check if conflict markers exist
if "<<<<<<< " in raw:
    print("Conflict markers found — resolving...")
    # Structure: <<<<<<< Updated upstream ... ======= ... [TAKE THIS] >>>>>>> Stashed changes
    # Extract everything between ======= and >>>>>>>  (the "stashed" = our local version)
    match = re.search(r"={7}\n(.*?)>{7}", raw, re.DOTALL)
    if match:
        clean = match.group(1)
        # Verify the extracted section starts with a TypeScript import
        if not clean.lstrip().startswith("import "):
            print("  Second section doesn't start with import, trying first section...")
            match2 = re.search(r"<{7}[^\n]*\n(.*?)={7}", raw, re.DOTALL)
            if match2:
                clean = match2.group(1)
                print(f"  Using first section (between <<<< and ====)")
        print(f"  Extracted clean content: {len(clean.splitlines())} lines")
        if not clean.lstrip().startswith("import "):
            print("ERROR: extracted section does not start with 'import' — cannot safely use it")
            sys.exit(1)
    else:
        print("ERROR: could not find ======= / >>>>>>> markers to parse conflict")
        sys.exit(1)
else:
    print("No conflict markers found — using file as-is")
    clean = raw

# Apply ACE Hanei SEO fix
OLD_HANEI = '"slug": "ace-hanei-noida-3-4-bhk-review",\n    "title": "What Makes ACE Hanei the MOST Desired 3 and 4 BHK in Noida",\n    "description": "What makes Ace Hanei the most desired 3 and 4 BHK in Noida \u2014 layouts, amenities, pricing and the investment case explained.",\n    "youtubeId": "NQf0pS1cjPE",\n    "thumbnail": "https://img.youtube.com/vi/NQf0pS1cjPE/maxresdefault.jpg",\n    "publishedAt": "2024-11-14",\n    "duration": "PT9M22S",\n    "focusKeyword": "what makes ace hanei the most ",\n    "category": "Real Estate",\n    "views": "10K+ views"'

NEW_HANEI = '"slug": "ace-hanei-noida-3-4-bhk-review",\n    "title": "ACE Hanei HONEST Review | 3 & 4 BHK Noida Extension Price & Verdict 2025",\n    "description": "ACE Hanei, Sector 12 Greater Noida West - 3 & 4 BHK from Rs. 11,000 psqft. Honest review of the corner plot project with full pricing, tower planning and the Gaur Chowk traffic reality.",\n    "content": "Property Saraansh reviews ACE Hanei - a 3 & 4 BHK ultra-luxury project in Sector 12, Greater Noida West (Noida Extension). 6.42 acres, 7 towers, 518 homes on a corner plot open on all 4 sides fronting the 130m road. Configurations: Tower 1 - 4 BHK 4,200 sq ft; Towers 2 & 3 - 4 BHK 3,200 sq ft; Towers 5-7 - 3 BHK 2,290 sq ft. Pre-launch price Rs. 11,000 psqft (12% off launch price of Rs. 12,500). RERA: UPRERAPRJ677887/10/2024, possession October 2028. ACE track record: Ace Parkway Sector 150 (2 Cr pre-possession, 3 Cr+ now) is the benchmark. Key concern: Gaur Chowk traffic - relief expected via 6-lane underpass (late 2026) and metro corridor to Greater Noida West Sector 4. Verdict: Solid end-use option for buyers who cannot compromise on size or builder quality but cannot stretch to Noida Expressway prices. Read our full blog: /blog/ace-hanei-sector-12-honest-review | View project listing: /properties/ace-hanei-sector-12-greater-noida-west | Free consultation: WhatsApp 8076178189 or propertysaraansh.com.",\n    "youtubeId": "NQf0pS1cjPE",\n    "thumbnail": "https://img.youtube.com/vi/NQf0pS1cjPE/maxresdefault.jpg",\n    "publishedAt": "2024-11-14",\n    "duration": "PT9M22S",\n    "focusKeyword": "ace hanei review",\n    "category": "Real Estate",\n    "views": "17K views"'

if OLD_HANEI in clean:
    clean = clean.replace(OLD_HANEI, NEW_HANEI)
    print("ACE Hanei entry: updated OLD -> NEW")
elif NEW_HANEI in clean:
    print("ACE Hanei entry: already correct (no change needed)")
else:
    # Fallback: try to find by slug and print what's there for diagnosis
    slug_match = re.search(r'"slug": "ace-hanei-noida-3-4-bhk-review",(.*?)(?="slug":)', clean, re.DOTALL)
    if slug_match:
        print(f"WARNING: ACE Hanei entry found but pattern didn't match. Existing entry:\n{slug_match.group(0)[:300]}")
    else:
        print("WARNING: ACE Hanei slug not found in extracted content at all!")

# --- Sector 150 ACE New Launch: shorten content to one compact paragraph ---
NEW_150_CONTENT = (
    "ACE's new launch in Sector 150 Noida — the project the market is already calling "
    "ACE Parkway 2.O — gets an honest pre-launch review from Property Saraansh. The project "
    "spans a low-density 14.5-acre parcel in Block B with 11 towers and roughly 800 units "
    "(about 55 units/acre), offering spacious 3 & 4 BHK homes of approximately 1,900 to 4,400 sq ft. "
    "Expected pricing is around ₹16,995 psqft BSP (≈₹18,500 all-inclusive), putting a 3 BHK near "
    "₹3.5 Crore all-in, with RERA and allotment expected around 10 August 2026. With the Sports City "
    "registry ban lifted in January 2026, Sector 150 is Noida's least dense and most-watched Expressway "
    "corridor — and ACE Parkway (launched ~₹5,000 psqft, now ~₹16,000 psqft) is the track record "
    "behind the hype. All figures are tentative until RERA is granted, so verify before booking."
)

m150 = re.search(
    r'("slug": "ace-new-launch-sector-150-noida",.*?"content": ")(.*?)(",\s*\n\s*"youtubeId": "D930NGq_Wk8")',
    clean, re.DOTALL,
)
if m150:
    clean = clean[:m150.start()] + m150.group(1) + NEW_150_CONTENT + m150.group(3) + clean[m150.end():]
    print("Sector 150 content: shortened to compact paragraph")
else:
    print("WARNING: Sector 150 entry (ace-new-launch-sector-150-noida / D930NGq_Wk8) not found for content update")

# Final safety check: no conflict markers remain
for marker in ["<<<<<<< ", "=======\n", ">>>>>>> "]:
    if marker in clean:
        print(f"ERROR: conflict marker '{marker.strip()}' still present after cleanup!")
        sys.exit(1)

# Write back with LF line endings
with open(VIDEOS_PATH, "w", encoding="utf-8", newline="\n") as f:
    f.write(clean)

final_hash = hashlib.md5(clean.encode()).hexdigest()
print(f"Written: {len(clean.splitlines())} lines, md5={final_hash[:8]}")

if original_hash == final_hash:
    print("WARNING: File content unchanged after fix! Git will see no diff.")
    print("  This means either the file was already clean, or the fix patterns didn't match.")
else:
    print(f"File changed successfully (md5 {original_hash[:8]} -> {final_hash[:8]})")
