#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REMOTE="${REMOTE:-cyrillbo@bolliger.tech}"
REMOTE_DIR="${REMOTE_DIR:-~/www/calculateur.ch}"
BUILD_DIR="${BUILD_DIR:-dist}"

printf "\n▶ Building project...\n"
npm run build

if [[ ! -d "$BUILD_DIR" ]]; then
  echo "Build directory '$BUILD_DIR' not found; aborting." >&2
  exit 1
fi

printf "\n▶ Deploying to %s:%s ...\n" "$REMOTE" "$REMOTE_DIR"
rsync -avz --delete --progress "${BUILD_DIR}/" "${REMOTE}:${REMOTE_DIR}/"

printf "\n✔ Deployment complete.\n"
