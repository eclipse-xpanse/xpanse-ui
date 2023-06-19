/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbstractCredentialInfo } from '../models/AbstractCredentialInfo';
import type { CreateCredential } from '../models/CreateCredential';
import type { CredentialVariables } from '../models/CredentialVariables';
import type { Link } from '../models/Link';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CredentialsManagementService {
    /**
     * Update credential of the cloud service provider.
     * @param cspName The cloud service provider
     * @param requestBody
     * @returns boolean OK
     * @throws ApiError
     */
    public static updateCredential(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        requestBody: CreateCredential
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/auth/csp/{cspName}/credential',
            path: {
                cspName: cspName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Add credential of the cloud service provider.
     * @param cspName The cloud service provider.
     * @param requestBody
     * @returns boolean OK
     * @throws ApiError
     */
    public static addCredential(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        requestBody: CreateCredential
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/auth/csp/{cspName}/credential',
            path: {
                cspName: cspName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Delete credential of the cloud service provider and the user.
     * @param cspName The cloud service provider.
     * @param userName The name of user who provided credential.
     * @returns boolean OK
     * @throws ApiError
     */
    public static deleteCredential(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        userName: string
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/auth/csp/{cspName}/credential',
            path: {
                cspName: cspName,
            },
            query: {
                userName: userName,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get the API document for adding credential of the Csp.
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
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * List credentials of the cloud service provider and the user.
     * @param cspName The cloud service provider.
     * @param userName The name of user who provided the credential.
     * @param type The type of credential.
     * @returns CredentialVariables OK
     * @throws ApiError
     */
    public static getCredentialDefinitionsByCsp(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        userName: string,
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<CredentialVariables>> {
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
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * List credential types provided by the cloud service provider.
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
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * List credential capabilities provided by the cloud service provider.
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
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }
}
