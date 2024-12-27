/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ApiError, ErrorResponse } from '../../../../xpanse-api/generated';

export function isHandleKnownErrorResponse(error: Error | null): error is ApiError & { body: ErrorResponse } {
    return (
        error != null &&
        error instanceof ApiError &&
        error.body != null &&
        typeof error.body === 'object' &&
        'details' in error.body &&
        'errorType' in error.body
    );
}
