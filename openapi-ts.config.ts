/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'src/xpanse-api/api.json',
    output: {
        format: 'prettier',
        path: 'src/xpanse-api/generated',
    },
    parser: {
        transforms: {
            enums: 'root',
        },
    },
    plugins: [
        {
            name: '@hey-api/sdk',
        },
        {
            name: '@hey-api/client-fetch',
        },
        {
            name: '@hey-api/typescript',
            enums: 'typescript',
        },
    ],
});
