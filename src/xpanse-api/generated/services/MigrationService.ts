/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MigrateRequest } from '../models/MigrateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MigrationService {
    /**
     * Create a job to migrate the deployed service.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns string Accepted
     * @throws ApiError
     */
    public static migrate(requestBody: MigrateRequest): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/services/migration',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
}
