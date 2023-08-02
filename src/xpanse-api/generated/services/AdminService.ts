/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemStatus } from '../models/SystemStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {
    /**
     * Check health of API service and backend systems.<br>Required role:<b> admin</b> or <b>csp</b> or <b>user</b>
     * @returns SystemStatus OK
     * @throws ApiError
     */
    public static healthCheck(): CancelablePromise<SystemStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/health',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
}
