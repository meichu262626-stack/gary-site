#!/bin/bash
# 把網站輸出成靜態檔，推到 GitHub 的 gh-pages 分支（GitHub Pages 會自動上線）
# 用法：bash scripts/deploy_pages.sh
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/node/bin:$PATH"

rm -rf out
GITHUB_PAGES=1 SITE_URL=https://meichu262626-stack.github.io NEXT_TELEMETRY_DISABLED=1 npx next build
touch out/.nojekyll   # 不加的話 GitHub 會忽略 _next 資料夾

REMOTE=$(git remote get-url origin)
cd out
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -q -m "更新網站 $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTE" gh-pages
echo "已推上 gh-pages"
