/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Response } from '../models/Response';
import type { WorkFlowTask } from '../models/WorkFlowTask';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WorkFlowService {
    /**
     * Complete tasks by task ID and set global process variables .<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static completeTask(id: string, requestBody: Record<string, Record<string, any>>): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/workflow/task/{id}',
            path: {
                id: id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Manage failed task orders.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @param retryOrder
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
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Query the tasks that need to be done by me<br>Required role:<b> admin</b> or <b>user</b>
     * @returns WorkFlowTask OK
     * @throws ApiError
     */
    public static queryTodoTasks(): CancelablePromise<Array<WorkFlowTask>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/workflow/task/todo',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Query the tasks I have completed<br>Required role:<b> admin</b> or <b>user</b>
     * @returns WorkFlowTask OK
     * @throws ApiError
     */
    public static queryDoneTasks(): CancelablePromise<Array<WorkFlowTask>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/workflow/task/done',
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
