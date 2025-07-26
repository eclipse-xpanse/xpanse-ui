/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { env } from '../../config/config.ts';

export function getCorrectedCustomBaseUrl(): string {
    if (!env.VITE_APP_BASE_URI) {
        return '/';
    }
    if (env.VITE_APP_BASE_URI.endsWith('/')) {
        return env.VITE_APP_BASE_URI;
    } else {
        return env.VITE_APP_BASE_URI + '/';
    }
}
