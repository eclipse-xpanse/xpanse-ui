/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserPolicy } from '../models/UserPolicy';
import type { UserPolicyCreateRequest } from '../models/UserPolicyCreateRequest';
import type { UserPolicyUpdateRequest } from '../models/UserPolicyUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserPoliciesManagementService {
    /**
     * List the policies defined by the user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param cspName Name of csp which the policy belongs to.
     * @param enabled Is the policy enabled.
     * @returns UserPolicy OK
     * @throws ApiError
     */
    public static listUserPolicies(
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        enabled?: boolean
    ): CancelablePromise<Array<UserPolicy>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/policies',
            query: {
                cspName: cspName,
                enabled: enabled,
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
     * Update the policy created by the user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns UserPolicy OK
     * @throws ApiError
     */
    public static updateUserPolicy(requestBody: UserPolicyUpdateRequest): CancelablePromise<UserPolicy> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/policies',
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
     * Add policy created by the user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns UserPolicy OK
     * @throws ApiError
     */
    public static addUserPolicy(requestBody: UserPolicyCreateRequest): CancelablePromise<UserPolicy> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/policies',
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
     * Get the details of the policy created by the user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns UserPolicy OK
     * @throws ApiError
     */
    public static getPolicyDetails(id: string): CancelablePromise<UserPolicy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/policies/{id}',
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
     * Delete the policy created by the user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteUserPolicy(id: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/policies/{id}',
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
