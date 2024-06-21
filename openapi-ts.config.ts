/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-fetch',
    input: 'src/xpanse-api/api.json',
    output: {
        format: 'prettier',
        path: 'src/xpanse-api/generated',
    },
    types: {
        enums: 'typescript',
    },
});
