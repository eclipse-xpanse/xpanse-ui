/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeployedService } from '../models/DeployedService';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceResourceService {
    /**
     * Start a task to deploy service using registered service template.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns DeployedService OK
     * @throws ApiError
     */
    public static stopService(id: string): CancelablePromise<DeployedService> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/stop/{id}',
            path: {
                id: id,
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

    /**
     * Start the service by the service id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns DeployedService OK
     * @throws ApiError
     */
    public static startService(id: string): CancelablePromise<DeployedService> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/start/{id}',
            path: {
                id: id,
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

    /**
     * Start a task to deploy service using registered service template.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns DeployedService OK
     * @throws ApiError
     */
    public static restartService(id: string): CancelablePromise<DeployedService> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/restart/{id}',
            path: {
                id: id,
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
