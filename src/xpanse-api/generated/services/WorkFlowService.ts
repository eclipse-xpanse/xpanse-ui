/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WorkFlowService {
    /**
     * Manage failed task orders.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id ID of the workflow task that needs to be handled
     * @param retryOrder Controls if the order must be retried again or simply closed.
     * @returns any OK
     * @throws ApiError
     */
    public static manageFailedOrder(id: string, retryOrder: boolean): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/workflow/task/{id}/{retryOrder}',
            path: {
                id: id,
                retryOrder: retryOrder,
            },
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
