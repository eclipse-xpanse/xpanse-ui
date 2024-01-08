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

export class IsvCloudCredentialsManagementService {
    /**
     * Users in the ISV role get all cloud provider credentials added by the user for a cloud service provider.<br>Required role:<b> isv</b>
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getIsvCloudCredentials(
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/isv/credentials',
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
     * Update the user credentials used for ISV to connect to the cloud service provider.<br>Required role:<b> isv</b>
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateIsvCloudCredential(requestBody: CreateCredential): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/isv/credentials',
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
     * Add the user credentials for the ISV role used to connect to the cloud service provider.<br>Required role:<b> isv</b>
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static addIsvCloudCredential(requestBody: CreateCredential): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/isv/credentials',
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
     * Delete the credentials of the user in the USER role to connect to the cloud service provider.<br>Required role:<b> isv</b>
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @param name The name of of credential.
     * @returns void
     * @throws ApiError
     */
    public static deleteIsvCloudCredential(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        type: 'variables' | 'http_authentication' | 'api_key' | 'oauth2',
        name: string
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/isv/credentials',
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
