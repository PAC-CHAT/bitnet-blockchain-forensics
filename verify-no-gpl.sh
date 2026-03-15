#!/usr/bin/env bash
set -euo pipefail

needle_part_a="GNU General Public"
needle_part_b=" License"
needle="${needle_part_a}${needle_part_b}"

mapfile -t targets < <(rg --files -g '*.py' -g '*.sh')

if [ "${#targets[@]}" -gt 0 ] && rg -n --fixed-strings "$needle" "${targets[@]}"; then
  echo "❌ GPL code detected!"
  exit 1
elif [ -f LICENSE ] && grep -q --fixed-strings "$needle" LICENSE; then
  echo "❌ GPL text detected in LICENSE!"
  exit 1
fi

echo "✅ No GPL text found in scanned files."
