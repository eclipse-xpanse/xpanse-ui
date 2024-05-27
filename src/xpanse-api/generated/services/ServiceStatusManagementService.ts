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
import type { ServiceStateManagementTaskDetails } from '../models/ServiceStateManagementTaskDetails';
export class ServiceStatusManagementService {
    /**
     * Start a task to stop the service instance.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId
     * @returns string Accepted
     * @throws ApiError
     */
    public static stopService(serviceId: string): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/stop/{serviceId}',
            path: {
                serviceId: serviceId,
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
     * Start a task to start the service instance.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId
     * @returns string Accepted
     * @throws ApiError
     */
    public static startService(serviceId: string): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/start/{serviceId}',
            path: {
                serviceId: serviceId,
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
     * Start a task to restart the service instance.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId
     * @returns string Accepted
     * @throws ApiError
     */
    public static restartService(serviceId: string): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/restart/{serviceId}',
            path: {
                serviceId: serviceId,
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
     * List state management tasks of the service.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId id of the service
     * @param taskType type of the management task
     * @param taskStatus status of the task
     * @returns ServiceStateManagementTaskDetails OK
     * @throws ApiError
     */
    public static listServiceStateManagementTasks(
        serviceId: string,
        taskType?: 'start' | 'stop' | 'restart',
        taskStatus?: 'created' | 'in progress' | 'successful' | 'failed'
    ): CancelablePromise<Array<ServiceStateManagementTaskDetails>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/{serviceId}/tasks',
            path: {
                serviceId: serviceId,
            },
            query: {
                taskType: taskType,
                taskStatus: taskStatus,
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
     * Delete all state management tasks of the service.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId id of the service
     * @returns void
     * @throws ApiError
     */
    public static deleteManagementTasksByServiceId(serviceId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/{serviceId}/tasks',
            path: {
                serviceId: serviceId,
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
     * Get state management task details by the task id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param taskId id of the task
     * @returns ServiceStateManagementTaskDetails OK
     * @throws ApiError
     */
    public static getManagementTaskDetailsByTaskId(
        taskId: string
    ): CancelablePromise<ServiceStateManagementTaskDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/tasks/{taskId}',
            path: {
                taskId: taskId,
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
     * Delete service state management task by the task id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param taskId id of the task
     * @returns void
     * @throws ApiError
     */
    public static deleteManagementTaskByTaskId(taskId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/tasks/{taskId}',
            path: {
                taskId: taskId,
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
