#!/usr/bin/env bash
#
# Property Saraansh — remove confirmed-dead code & duplicate artifacts.
# Every path below was verified to have ZERO importers/references.
#
# HOW TO RUN (in a local clone of beekoli/Property-Saraansh-Web):
#   git checkout main && git pull
#   git checkout -b chore/remove-dead-code
#   bash cleanup-dead-code.sh
#   git commit -m "chore: remove dead code, default assets, duplicate plugin zips"
#   git push -u origin chore/remove-dead-code
#   # then open a PR, confirm the Vercel preview build is green, and merge.
#
set -euo pipefail

# 4a. Legacy property section components (superseded by PropertyDetail.tsx)
git rm -f \
  "src/components/property/AboutSection.tsx" \
  "src/components/property/AmenitiesGrid.tsx" \
  "src/components/property/FloorPlans.tsx" \
  "src/components/property/GallerySection.tsx" \
  "src/components/property/HeroSection.tsx" \
  "src/components/property/HighlightsGrid.tsx" \
  "src/components/property/LocationAdvantages.tsx" \
  "src/components/property/PriceList.tsx" \
  "src/components/property/StickyNav.tsx"

# 4b. Other dead components
git rm -f \
  "src/app/properties/[slug]/PropertyClient.tsx" \
  "src/components/VideoCard.tsx"

# 4c. Default create-next-app assets + duplicate favicon
git rm -f \
  "public/file.svg" \
  "public/globe.svg" \
  "public/next.svg" \
  "public/vercel.svg" \
  "public/window.svg" \
  "public/icon.png"

# 4d. Duplicate WordPress-plugin build artifacts (source stays in ps-core-functionality/)
git rm -f \
  "property-saraansh-core-plugin.zip" \
  "ps-core-functionality.zip" \
  "ps-core-plugin-new.zip" \
  "ps-core-plugin.zip" \
  "ps-core-single.zip"

echo "Done. 22 files staged for removal. Review with: git status"
