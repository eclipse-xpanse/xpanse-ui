/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { WorkFlowTask } from '../models/WorkFlowTask';
export class WorkflowService {
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
            url: '/xpanse/workflow/task/{id}',
            path: {
                id: id,
            },
            query: {
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
    /**
     * Complete tasks by task ID and set global process variables .<br>Required role:<b> admin</b> or <b>user</b>
     * @param id ID of the workflow task that needs to be handled
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static completeTask(id: string, requestBody: Record<string, Record<string, any>>): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/workflow/complete/task/{id}',
            path: {
                id: id,
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
     * Query all tasks of the given user<br>Required role:<b> admin</b> or <b>user</b>
     * @param status the status of task
     * @returns WorkFlowTask OK
     * @throws ApiError
     */
    public static queryTasks(status?: 'done' | 'failed'): CancelablePromise<Array<WorkFlowTask>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/workflow/tasks',
            query: {
                status: status,
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
