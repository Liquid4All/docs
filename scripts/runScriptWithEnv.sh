#!/bin/bash
# Minimal tsx-based script runner.
#
# Mirrors the calling convention of
# ~/git/app-monorepo-template/apps/web/scripts/runScriptWithEnv.sh
# (`npm run script scripts/<file>.ts -- --flag`) but without the env-file
# selection, since this repo currently has no runtime env to load. Expand
# toward the template's shape if env-aware scripts get added later.
set -euo pipefail
exec npx tsx "$@"
