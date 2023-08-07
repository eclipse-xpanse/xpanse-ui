#!/usr/bin/bash
# the script reads all available environment vars with names starting with REACT_APP_ and adds them to the
# inject.js file as a JS object.
WWW_DIR=/usr/share/nginx/html
ENV_PREFIX=REACT_APP_
INJECT_FILE_PATH="${WWW_DIR}/inject.js"
echo "window.injectedEnv = {" >> "${INJECT_FILE_PATH}"
for envrow in $(printenv); do
  IFS='=' read -r key value <<< "${envrow}"
  if [[ $key == "${ENV_PREFIX}"* ]]; then
    echo "  ${key}: \"${value}\"," >> "${INJECT_FILE_PATH}"
  fi
done
echo "};" >> "${INJECT_FILE_PATH}"
if [ "$#" -eq 0 ]
  then nginx -g 'daemon off;'
else
  "$@"
fi