/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: 'legacy/fetch',
    input: 'src/xpanse-api/api.json',
    output: {
        format: 'prettier',
        path: 'src/xpanse-api/generated',
    },
    plugins: [
        '@hey-api/services',
        '@hey-api/types',
        {
            name: '@hey-api/types',
            enums: 'typescript',
        },
    ],
});
