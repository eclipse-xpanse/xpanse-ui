/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OpenTofuResult } from '../models/OpenTofuResult';
import type { TerraformResult } from '../models/TerraformResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhookService {
    /**
     * Process the execution result after openTofu executes the command line to rollback service deployment.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static rollbackCallback(taskId: string, requestBody: OpenTofuResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/tofu-maker/rollback/{task_id}',
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
     * Process the execution result after openTofu executes the command line to purge service.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static purgeCallback(taskId: string, requestBody: OpenTofuResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/tofu-maker/purge/{task_id}',
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
     * Process the execution result after openTofu executes the command line.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static modifyCallback(taskId: string, requestBody: OpenTofuResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/tofu-maker/modify/{task_id}',
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
     * Process the execution result after openTofu executes the command line.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static destroyCallback(taskId: string, requestBody: OpenTofuResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/tofu-maker/destroy/{task_id}',
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
     * Process the execution result after openTofu executes the command line.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deployCallback(taskId: string, requestBody: OpenTofuResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/tofu-maker/deploy/{task_id}',
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
     * Process the execution result after terraform executes the command line to rollback service deployment.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static rollbackCallback1(taskId: string, requestBody: TerraformResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/terraform-boot/rollback/{task_id}',
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
     * Process the execution result after terraform executes the command line to purge service.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static purgeCallback1(taskId: string, requestBody: TerraformResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/terraform-boot/purge/{task_id}',
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
    public static modifyCallback1(taskId: string, requestBody: TerraformResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/terraform-boot/modify/{task_id}',
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
     * Process the execution result after terraform executes the command line to destroy service.
     * @param taskId task id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static destroyCallback1(taskId: string, requestBody: TerraformResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/terraform-boot/destroy/{task_id}',
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
    public static deployCallback1(taskId: string, requestBody: TerraformResult): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhook/terraform-boot/deploy/{task_id}',
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
