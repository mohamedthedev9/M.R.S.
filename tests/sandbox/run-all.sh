#!/bin/bash
# Full battery from a clean copy. Usage: bash run-all.sh
set -u
export NODE_PATH=/home/claude/.npm-global/lib/node_modules
TW=/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/tailwindcss
TWP=/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules
cd /home/claude/smoke && rm -rf src && cp -r ../mrs-site src
cat > src/tsconfig.json <<'JSON'
{"compilerOptions":{"jsx":"react-jsx","module":"esnext","moduleResolution":"bundler","target":"es2022","baseUrl":".","paths":{"@/*":["./*"]},"esModuleInterop":true,"skipLibCheck":true}}
JSON
sed -i '/import ".\/globals.css";/d' src/app/layout.tsx
cd /home/claude/mrs-site
NODE_PATH=$TWP node $TW/lib/cli.js -c tailwind.config.ts -i app/globals.css -o /tmp/mrs.css 2>&1 | grep -E "rror"; cp /tmp/mrs.css /home/claude/smoke/browser/site.css
cd /home/claude/smoke/browser
NODE_PATH=$TWP node $TW/lib/cli.js -c tw.p6.config.ts -i /home/claude/mrs-site/app/globals.css -o mrs.css 2>&1 | grep -E "rror"
NODE_PATH=$TWP node $TW/lib/cli.js -c tw.p7.config.ts -i /home/claude/mrs-site/app/globals.css -o mrs7.css 2>&1 | grep -E "rror"
for s in build.cjs build-p6.cjs build-p7.cjs build-site.cjs; do node $s >/dev/null || echo "BUILD FAILED: $s"; done
run() { echo "=== $1 ==="; shift; timeout 175 "$@" 2>&1 | grep -E "FAIL|passed|all rendered|FAILED|rendered|page errors|BLOCKED" ; }
cd /home/claude/smoke/src && cp ../test.tsx smoke.test.tsx
run "SSR smoke (components)" ../../.npm-global/bin/tsx smoke.test.tsx
# Render every route fresh. Old output is deleted first and a failed render aborts the audit (never audit stale HTML).
rm -rf /tmp/pages; cp ../pages.render.tsx pages.render.tsx
if ../../.npm-global/bin/tsx pages.render.tsx 2>&1 | tail -3 | grep -q "rendered 14 pages"; then echo "=== Pages rendered fresh: 14 ==="; else echo "!!! PAGE RENDER FAILED: audit skipped"; fi
[ -f /tmp/pages/_meta.json ] && run "Page audit (14 routes, HTML/a11y/SEO)" node /tmp/audit.cjs
cd /home/claude/smoke/browser
run "Phase 5 interactions" node run.cjs
run "Phase 6 security (real CSS)" node p6-test.cjs
run "Layout across phases (real CSS)" node p7-test.cjs
run "Whole site: flows + 117-case overflow matrix" node site-test.cjs
run "Privacy-policy claims vs real behaviour" node legal-claims.cjs
