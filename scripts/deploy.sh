#!/usr/bin/env bash
# Stage only the public site into _site/, then deploy that to Netlify.
# Deploying --dir=. publishes tasks/, v2/, Videos/, Barbers/ to the open internet.
# Site id comes from .netlify/state.json (gitignored) — run `netlify link` if missing.
set -euo pipefail
cd "$(dirname "$0")/.."

PUBLISH="_site"

mkdir -p "$PUBLISH"
cp index.html robots.txt sitemap.xml "$PUBLISH/"
cp -r css js img "$PUBLISH/"

echo "Staged $(du -sh "$PUBLISH" | cut -f1) into $PUBLISH/"
npx netlify deploy --prod --dir="$PUBLISH"
