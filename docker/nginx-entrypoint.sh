#!/usr/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Huawei Inc.
#

# the script reads all available environment vars with names starting with REACT_APP_ and adds them to the
# inject.js file as a JS object.
WWW_DIR=/usr/share/nginx/html
ENV_PREFIX=VITE_APP_
INJECT_FILE_PATH="${WWW_DIR}/inject.js"
rm -f ${INJECT_FILE_PATH}
echo "window.injectedEnv = {" >> "${INJECT_FILE_PATH}"
for envrow in $(printenv); do
  # This breaks if the value contains spaces. Ensure the values are without spaces.
  IFS='=' read -r key value <<< "${envrow}"
  if [[ $key == "${ENV_PREFIX}"* ]]; then
    echo "  ${key}: \"${value}\"," >> "${INJECT_FILE_PATH}"
  fi
done
echo "};" >> "${INJECT_FILE_PATH}"

# OidcTrustedDomains file will be updated from the template and values from environment variables.
envsubst < ${WWW_DIR}/OidcTrustedDomains.js.template > ${WWW_DIR}/OidcTrustedDomains.js

if [ "$#" -eq 0 ]
  then nginx -g 'daemon off;'
else
  "$@"
fi