#!/usr/bin/env bash
# Refresh the Token Burn dashboard snapshot served at /token-burn.
#
# The dashboard parses your LOCAL Claude Code / Codex logs, so it can only be
# rebuilt on your machine — Vercel can't regenerate it. Run this whenever you
# want fresh numbers, then commit + push to redeploy.
#
# Usage:  npm run refresh:burn   (or: bash scripts/refresh-token-burn.sh)
set -euo pipefail

DASH="${TOKEN_BURN_DIR:-$HOME/Developments/token-burn-dashboard}"
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$SITE_DIR/public/token-burn"

if [ ! -d "$DASH" ]; then
  echo "✗ Dashboard repo not found at: $DASH"
  echo "  Set TOKEN_BURN_DIR=/path/to/token-burn-dashboard and retry."
  exit 1
fi

echo "→ Rebuilding dashboard data from local logs (SCRUBBED public build)…"
# IMPORTANT: hudwahab-site is a PUBLIC repo. Always use the scrubbed build
# (SCRUB=1) so real client/internal project names from scrub.json are aliased.
( cd "$DASH" && npm run build:public )

echo "→ Copying build into $DEST"
mkdir -p "$DEST"
cp "$DASH/web/index.html" "$DASH/web/app.js" "$DASH/web/styles.css" "$DASH/web/data.json" "$DEST/"

# Inject <base href="/token-burn/"> so the clean /token-burn URL resolves the
# dashboard's relative assets. The source repo stays portable (no base tag).
if ! grep -q 'base href="/token-burn/"' "$DEST/index.html"; then
  perl -0pi -e 's{(<head>)}{$1\n  <base href="/token-burn/" />}' "$DEST/index.html"
  echo "  injected <base> tag for clean-URL asset resolution"
fi

# ── Privacy gate (HARD fail) ──────────────────────────────────────────────────
# The scrubbed build strips machine prefixes (mac:/ubuntu:) and aliases/redacts
# real project names. If either leaks through, the build was NOT scrubbed —
# abort so a public deploy can never expose client/internal names.
echo "→ Privacy gate: verifying data.json is scrubbed…"
if grep -qE '"(mac|ubuntu):' "$DEST/data.json"; then
  echo "✗ ABORT: machine-prefixed real project names present — scrub did NOT run."
  exit 1
fi
if grep -qiE 'issa|rfp[_-]?monitor|orion-inference|amanah|sovereign-agentic|agent-platform|subagents' "$DEST/data.json"; then
  echo "✗ ABORT: a known-sensitive project name leaked into data.json."
  exit 1
fi
echo "  ✓ scrubbed — no machine prefixes or known sensitive names"

echo
echo "✓ Done. Review the diff, then:"
echo "    git add public/token-burn && git commit -m 'chore: refresh token-burn snapshot' && git push"
