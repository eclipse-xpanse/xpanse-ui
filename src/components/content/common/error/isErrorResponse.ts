/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ApiError } from '../../../../xpanse-api/generated';

export function isErrorResponse(error: Error) {
    return error instanceof ApiError && error.body && typeof error.body === 'object' && 'details' in error.body;
}
