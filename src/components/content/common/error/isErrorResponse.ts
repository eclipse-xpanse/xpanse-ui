/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ErrorResponse } from '../../../../xpanse-api/generated';

export function isErrorResponse(body: unknown): body is ErrorResponse {
    return (
        typeof body === 'object' &&
        body !== null &&
        'details' in body &&
        'errorType' in body &&
        Array.isArray(String(body.details)) &&
        typeof (body as Record<string, unknown>).errorType === 'string'
    );
}
