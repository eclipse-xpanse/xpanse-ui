#!/usr/bin/env bash
#
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Huawei Inc.
#

set -e

# === 1. CONFIG ===
WWW_ROOT="/usr/share/nginx/html"
SOURCE_DIR="/dist"
ENV_PREFIX="VITE_APP_"

# Default to "/" if not set
BASE_URI="${VITE_APP_BASE_URI:-/}"
BASE_URI="${BASE_URI%/}/"  # Ensure trailing slash

# Calculate subfolder name (e.g., "app" for /app/)
SUBDIR=$(echo "$BASE_URI" | sed 's|^/||; s|/$||')
[[ -z "$SUBDIR" ]] && SUBDIR="."  # For root "/"
echo $SUBDIR
echo "$TARGET_DIR"

TARGET_DIR="${WWW_ROOT}/${SUBDIR}"
echo "🛠 Serving app under base path: $BASE_URI"
echo "📁 Copying static files to: $TARGET_DIR"

# === 2. COPY STATIC FILES ===
mkdir -p "$TARGET_DIR"
cp -r "$SOURCE_DIR"/* "$TARGET_DIR"

INDEX_HTML="${TARGET_DIR}/index.html"

# === 3. REWRITE HTML PATHS ===
echo "🧼 Rewriting paths in index.html"

# favicon.ico and inject.js paths
sed -i "s|href=\"favicon.ico\"|href=\"${BASE_URI}favicon.ico\"|g" "$INDEX_HTML"
sed -i "s|src=\"inject.js\"|src=\"${BASE_URI}inject.js\"|g" "$INDEX_HTML"

# ./assets → /<base>/assets
sed -i "s|src=\"\./assets/|src=\"${BASE_URI}assets/|g" "$INDEX_HTML"
sed -i "s|href=\"\./assets/|href=\"${BASE_URI}assets/|g" "$INDEX_HTML"

# === 4. GENERATE inject.js ===
INJECT_FILE_PATH="${TARGET_DIR}/inject.js"
echo "🧪 Generating injectedEnv at: $INJECT_FILE_PATH"
rm -f "${INJECT_FILE_PATH}"
echo "window.injectedEnv = {" >> "${INJECT_FILE_PATH}"
for envrow in $(printenv); do
  IFS='=' read -r key value <<< "${envrow}"
  if [[ $key == "${ENV_PREFIX}"* ]]; then
    echo "  ${key}: \"${value}\"," >> "${INJECT_FILE_PATH}"
  fi
done
echo "};" >> "${INJECT_FILE_PATH}"

# === 5. OIDC Trusted Domains ===
echo "🔧 Generating OidcTrustedDomains.js"
envsubst < "${TARGET_DIR}/OidcTrustedDomains.js.template" > "${TARGET_DIR}/OidcTrustedDomains.js"

# === 6. START NGINX ===
echo "🚀 Starting NGINX"
if [ "$#" -eq 0 ]; then
  nginx -g 'daemon off;'
else
  exec "$@"
fi
