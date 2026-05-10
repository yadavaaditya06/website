#!/usr/bin/env zsh
# Background poller: retry https_enforced=true on each subdomain Pages site
# every 60s until all three accept it (i.e. their LE certs have landed).
#
# Usage:
#   nohup ./scripts/wait-https.sh > /tmp/wait-https.log 2>&1 &
#   tail -f /tmp/wait-https.log

export GH_CONFIG_DIR="${GH_CONFIG_DIR:-$HOME/.gh-config}"

repos=(simulaq-web lab-web blog-web)
typeset -A enforced
for r in "${repos[@]}"; do enforced[$r]=0; done

echo "[$(date +%H:%M:%S)] Polling every 60s for cert issuance + HTTPS enforce."

while true; do
  for r in "${repos[@]}"; do
    [[ "${enforced[$r]}" == "1" ]] && continue
    if gh api -X PUT "repos/yadavaaditya06/$r/pages" -F https_enforced=true >/dev/null 2>&1; then
      echo "[$(date +%H:%M:%S)] ✓ $r: HTTPS enforced"
      enforced[$r]=1
    fi
  done

  done_count=0
  for r in "${repos[@]}"; do (( enforced[$r] == 1 )) && ((done_count++)); done
  if (( done_count == ${#repos[@]} )); then
    echo "[$(date +%H:%M:%S)] All sites enforced. Exiting."
    exit 0
  fi

  sleep 60
done
