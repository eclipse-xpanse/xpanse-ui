#!/bin/sh

echo ""
echo "Please make sure that you have already updated the src/xpanse-api/api.json."
echo ""
echo -n "Press any key to continue..."
read -r answer

SCRIPT_DIR="$(cd "$(dirname "$0")" && 
API_DIR="${SCRIPT_DIR}/../src/xpanse-api/"

npx @hey-api/openapi-ts

(
cd "${API_DIR}" || exit 1

FILE_NEED_ADD_LICENSE=$(grep -L "SPDX-License-Identifier" ./ --exclude='*.json' -R)

for FILE in $FILE_NEED_ADD_LICENSE; do
    echo "Updating license header in: $FILE"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' '1s#^#/*\n * SPDX-License-Identifier: Apache-2.0\n * SPDX-FileCopyrightText: Huawei Inc.\n */\n\n#' "$FILE"
    else
        # Linux
        sed -i '1s#^#/*\n * SPDX-License-Identifier: Apache-2.0\n * SPDX-FileCopyrightText: Huawei Inc.\n */\n\n#' "$FILE"
    fi
done
)

npx prettier --config .prettierrc --write .
