/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TerraformResult } from '../models/TerraformResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhookService {
    /**
     * Process the execution result after terraform executes the command line.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static destroyCallback(taskId: string, requestBody: TerraformResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/destroy/{task_id}',
            path: {
                task_id: taskId,
            },
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
    /**
     * Process the execution result after terraform executes the command line.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deployCallback(taskId: string, requestBody: TerraformResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/deploy/{task_id}',
            path: {
                task_id: taskId,
            },
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
