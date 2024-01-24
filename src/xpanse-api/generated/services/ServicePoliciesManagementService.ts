/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServicePolicy } from '../models/ServicePolicy';
import type { ServicePolicyCreateRequest } from '../models/ServicePolicyCreateRequest';
import type { ServicePolicyUpdateRequest } from '../models/ServicePolicyUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServicePoliciesManagementService {
    /**
     * List the policies belongs to the service.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param serviceTemplateId The id of registered service template which the policy belongs to.
     * @returns ServicePolicy OK
     * @throws ApiError
     */
    public static listServicePolicies(serviceTemplateId: string): CancelablePromise<Array<ServicePolicy>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/service/policies',
            query: {
                serviceTemplateId: serviceTemplateId,
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
     * Update the policy belongs to the registered service template.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param requestBody
     * @returns ServicePolicy OK
     * @throws ApiError
     */
    public static updateServicePolicy(requestBody: ServicePolicyUpdateRequest): CancelablePromise<ServicePolicy> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/service/policies',
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
     * Add policy for the registered service template.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param requestBody
     * @returns ServicePolicy OK
     * @throws ApiError
     */
    public static addServicePolicy(requestBody: ServicePolicyCreateRequest): CancelablePromise<ServicePolicy> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/service/policies',
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
     * Get details of policy belongs to the registered service template.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param id
     * @returns ServicePolicy OK
     * @throws ApiError
     */
    public static getServicePolicyDetails(id: string): CancelablePromise<ServicePolicy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/service/policies/{id}',
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
     * Delete the policy belongs to the registered service template.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteServicePolicy(id: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/service/policies/{id}',
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
