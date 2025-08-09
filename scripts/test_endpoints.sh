#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-http://localhost:8787}"

echo "GET / (health)"
curl -fsS -i "$BASE/"

echo -e "\nPOST /tarot/read"
curl -fsS -i -H "content-type: application/json" \
  -X POST "$BASE/tarot/read" \
  -d '{"allowReversals":true}'

echo -e "\nGET /tarot/last"
curl -fsS -i "$BASE/tarot/last"
