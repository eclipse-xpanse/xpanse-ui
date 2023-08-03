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
     * Update user's credential for connecting to the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
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
     * Add user's credential for connecting to the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
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
     * Get all cloud provider credentials added by the user.<br>Required role:<b> admin</b> or <b>user</b>
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getCredentialsByUser(): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/user/credentials',
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
     * Returns the OpenAPI document for adding a credential.<br>Required role:<b> admin</b> or <b>user</b>
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
     * Get all cloud provider credentials added by the user for a cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getCredentials(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/csp/{cspName}/credentials',
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
     * Get the credential types supported by the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
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
     * Get the credential capabilities defined by the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
     * @param cspName name of the cloud service provider.
     * @param type The type of credential.
     * @param name The name of credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getCredentialCapabilitiesByCsp(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2',
        name?: string
    ): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/csp/{cspName}/credential/capabilities',
            path: {
                cspName: cspName,
            },
            query: {
                type: type,
                name: name,
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
     * Delete user's credential for connecting to the cloud service provider.<br>Required role:<b> admin</b> or <b>user</b>
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @param name The name of of credential.
     * @returns void
     * @throws ApiError
     */
    public static deleteCredential(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        type: 'variables' | 'http_authentication' | 'api_key' | 'oauth2',
        name: string
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/auth/csp/{cspName}/credential',
            path: {
                cspName: cspName,
            },
            query: {
                type: type,
                name: name,
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
