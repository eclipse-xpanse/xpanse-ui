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
import type { ModifyRequest } from '../models/ModifyRequest';
import type { ServiceModificationAuditDetails } from '../models/ServiceModificationAuditDetails';
export class ServiceModificationService {
    /**
     * Start a modification to modify the deployed service instance.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId id of deployed service
     * @param requestBody
     * @returns string Accepted
     * @throws ApiError
     */
    public static modify(serviceId: string, requestBody: ModifyRequest): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/modify/{serviceId}',
            path: {
                serviceId: serviceId,
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
     * List modification audits of the service instance<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId id of the service
     * @param taskStatus status of the modification
     * @returns ServiceModificationAuditDetails OK
     * @throws ApiError
     */
    public static listServiceModificationAudits(
        serviceId: string,
        taskStatus?: 'created' | 'in progress' | 'successful' | 'failed'
    ): CancelablePromise<Array<ServiceModificationAuditDetails>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/{serviceId}/modifications',
            path: {
                serviceId: serviceId,
            },
            query: {
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
     * Delete all state management modifications of the service.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId id of the service
     * @returns void
     * @throws ApiError
     */
    public static deleteAuditsByServiceId(serviceId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/{serviceId}/modifications',
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
     * Get modification audit details by the modification id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param modificationId id of the modification audit
     * @returns ServiceModificationAuditDetails OK
     * @throws ApiError
     */
    public static getAuditDetailsByModificationId(
        modificationId: string
    ): CancelablePromise<ServiceModificationAuditDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/modifications/{modificationId}',
            path: {
                modificationId: modificationId,
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
     * Delete service modification audit by the modification id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param modificationId id of the modification audit
     * @returns void
     * @throws ApiError
     */
    public static deleteAuditByModificationId(modificationId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/modifications/{modificationId}',
            path: {
                modificationId: modificationId,
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
