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
import type { Link } from '../models/Link';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CredentialsManagementService {
    /**
     * Update credential of the cloud service provider.<br>**Required role: admin or user**
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateCredential(requestBody: CreateCredential): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/auth/csp/credential',
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
     * Add credential of the cloud service provider.<br>**Required role: admin or user**
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static addCredential(requestBody: CreateCredential): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/auth/csp/credential',
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
     * List all credentials of the user.<br>**Required role: admin or user**
     * @param userName The name of user who provided the credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getCredentialsByUser(userName: string): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/user/credentials',
            query: {
                userName: userName,
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
     * Get the API document for adding credential of the Csp.<br>**Required role: admin or user**
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @returns Link OK
     * @throws ApiError
     */
    public static getCredentialOpenApi(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        type: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Link> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/csp/{cspName}/openapi/{type}',
            path: {
                cspName: cspName,
                type: type,
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
     * List credentials of the cloud service provider and the user.<br>**Required role: admin or user**
     * @param cspName The cloud service provider.
     * @param userName The name of user who provided the credential.
     * @param type The type of credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getCredentials(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        userName: string,
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/csp/{cspName}/credentials',
            path: {
                cspName: cspName,
            },
            query: {
                userName: userName,
                type: type,
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
     * List credential types provided by the cloud service provider.<br>**Required role: admin or user**
     * @param cspName The cloud service provider.
     * @returns string OK
     * @throws ApiError
     */
    public static getCredentialTypesByCsp(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google'
    ): CancelablePromise<Array<'variables' | 'http_authentication' | 'api_key' | 'oauth2'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/csp/{cspName}/credential/types',
            path: {
                cspName: cspName,
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
     * List credential capabilities provided by the cloud service provider.<br>**Required role: admin or user**
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getCredentialCapabilitiesByCsp(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/csp/{cspName}/credential/capabilities',
            path: {
                cspName: cspName,
            },
            query: {
                type: type,
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
     * Delete credential of the cloud service provider and the user.<br>**Required role: admin or user**
     * @param cspName The cloud service provider.
     * @param userName The name of user who provided credential.
     * @param type The type of credential.
     * @returns void
     * @throws ApiError
     */
    public static deleteCredential(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        userName: string,
        type: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/auth/csp/{cspName}/credential',
            path: {
                cspName: cspName,
            },
            query: {
                userName: userName,
                type: type,
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
}
