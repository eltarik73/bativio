#!/bin/bash
# Fetch suggestions from Bing, DuckDuckGo, Yahoo for a single query.
# Args: $1 = query string
# Output: writes 3 files in raw-suggest/ : bing-<slug>.json, ddg-<slug>.json, yahoo-<slug>.json

set -u
DIR="/Users/macbook/Desktop/bativio/.claude/worktrees/jolly-northcutt-afea33/frontend/seo/research/raw-suggest"

q="$1"
# slug = lowercase, spaces -> _, strip everything not alnum/underscore
slug=$(echo -n "$q" | tr '[:upper:]' '[:lower:]' | sed -e "s/'/_/g" -e 's/[^a-z0-9]/_/g' -e 's/__*/_/g' -e 's/^_//' -e 's/_$//')
# URL encode (replace spaces with %20, ' with %27)
enc=$(python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))" "$q")

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

curl -s --max-time 15 -A "$UA" \
  "https://api.bing.com/osjson.aspx?query=${enc}&mkt=fr-FR" \
  > "$DIR/bing-${slug}.json" 2>/dev/null

curl -s --max-time 15 -A "$UA" \
  "https://duckduckgo.com/ac/?q=${enc}&kl=fr-fr" \
  > "$DIR/ddg-${slug}.json" 2>/dev/null

curl -s --max-time 15 -A "$UA" \
  "https://fr.search.yahoo.com/sugg/gossip/gossip-fr-fr?command=${enc}&output=fxjson" \
  > "$DIR/yahoo-${slug}.json" 2>/dev/null

echo "OK $q -> $slug"
