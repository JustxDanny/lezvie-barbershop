#!/usr/bin/env bash
# Stage the Azerbaijani site into AZ/_site and deploy it.
# AZ/index.html shares css/, js/ and img/ with the Russian site one level up,
# so they have to be copied in before deploying.
#
# Needs its own Netlify site. Run `netlify link` inside AZ/ first.
set -euo pipefail
cd "$(dirname "$0")/.."          # -> AZ/

PUBLISH="_site"
mkdir -p "$PUBLISH"

cp index.html "$PUBLISH/"
cp -r ../css ../img "$PUBLISH/"
cp -r ../js "$PUBLISH/"
cp js/reviews.az.js "$PUBLISH/js/"
[ -f robots.txt ] && cp robots.txt "$PUBLISH/"
[ -f sitemap.xml ] && cp sitemap.xml "$PUBLISH/"

if grep -q '{{' "$PUBLISH/index.html"; then
  echo "REFUSING TO DEPLOY: unfilled {{PLACEHOLDER}} values still in index.html:"
  grep -o '{{[A-Z_0-9]*}}' "$PUBLISH/index.html" | sort -u
  exit 1
fi

echo "Staged $(du -sh "$PUBLISH" | cut -f1) into AZ/$PUBLISH/"
npx netlify deploy --prod --dir="$PUBLISH"
