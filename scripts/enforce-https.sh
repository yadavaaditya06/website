#!/usr/bin/env zsh
# Enforce HTTPS on all four GitHub Pages sites once Let's Encrypt has
# issued each cert. Safe to re-run any time — it skips sites that are
# already enforced or whose cert isn't ready yet.
#
# Usage:  ./scripts/enforce-https.sh

set -e
export GH_CONFIG_DIR="${GH_CONFIG_DIR:-$HOME/.gh-config}"

repos=(yadavaaditya06.github.io simulaq-web lab-web blog-web)

for r in "${repos[@]}"; do
  health=$(gh api "repos/yadavaaditya06/$r/pages/health" 2>/dev/null || echo '{}')
  pages=$(gh api  "repos/yadavaaditya06/$r/pages"        2>/dev/null || echo '{}')

  responds=$(echo "$health" | python3 -c "import sys,json
try: print(json.load(sys.stdin)['domain']['responds_to_https'])
except: print('?')")
  enforced=$(echo "$pages" | python3 -c "import sys,json
try: print(json.load(sys.stdin).get('https_enforced'))
except: print('?')")

  if   [[ "$enforced" == "True" ]]; then
    echo "✓ $r: HTTPS already enforced"
  elif [[ "$responds" == "True" ]]; then
    echo "→ $r: cert ready, enabling enforcement"
    gh api -X PUT "repos/yadavaaditya06/$r/pages" -F https_enforced=true >/dev/null
    echo "✓ $r: HTTPS enforced"
  else
    echo "… $r: cert still pending (responds_to_https=$responds)"
  fi
done
