/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbstractCredentialInfo } from '../models/AbstractCredentialInfo';
import type { CreateCredential } from '../models/CreateCredential';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserCloudCredentialsManagementService {
    /**
     * List all cloud provider credentials added by the user for a cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getUserCloudCredentials(
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/user/credentials',
            query: {
                cspName: cspName,
                type: type,
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
     * Update user's credential for connecting to the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateUserCloudCredential(requestBody: CreateCredential): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/user/credentials',
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
     * Add user's credential for connecting to the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static addUserCloudCredential(requestBody: CreateCredential): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/user/credentials',
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
     * Delete user's credential for connecting to the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @param name The name of of credential.
     * @returns void
     * @throws ApiError
     */
    public static deleteUserCloudCredential(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        type: 'variables' | 'http_authentication' | 'api_key' | 'oauth2',
        name: string
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/user/credentials',
            query: {
                cspName: cspName,
                type: type,
                name: name,
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
