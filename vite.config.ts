/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    plugins: [react()],
    css: {
        modules: {
            localsConvention: 'camelCase',
        },
    },
});
