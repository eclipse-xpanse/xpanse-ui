/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbstractCredentialInfo } from '../models/AbstractCredentialInfo';
import type { CreateCredential } from '../models/CreateCredential';
import type { CredentialDefinition } from '../models/CredentialDefinition';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CredentialsManagementService {
    /**
     * Update credential for the service.
     * @param id The id of the deployed service.
     * @param requestBody
     * @returns boolean OK
     * @throws ApiError
     */
    public static updateCredentialByServiceId(id: string, requestBody: CreateCredential): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/auth/service/{id}/credential',
            path: {
                id: id,
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
     * Add credential for the service.
     * @param id The id of the deployed service.
     * @param requestBody
     * @returns boolean OK
     * @throws ApiError
     */
    public static addCredentialByServiceId(id: string, requestBody: CreateCredential): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/auth/service/{id}/credential',
            path: {
                id: id,
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
     * Delete credentials of the service.
     * @param id The id of the deployed service.
     * @param type
     * @returns boolean OK
     * @throws ApiError
     */
    public static deleteCredentialByServiceId(
        id: string,
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/auth/service/{id}/credential',
            path: {
                id: id,
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

    /**
     * Update credential of the cloud service provider.
     * @param cspName The cloud service provider
     * @param requestBody
     * @returns boolean OK
     * @throws ApiError
     */
    public static updateCredential(
        cspName: 'aws' | 'azure' | 'alicloud' | 'huawei' | 'openstack' | 'flexibleEngine',
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
        cspName: 'aws' | 'azure' | 'alicloud' | 'huawei' | 'openstack' | 'flexibleEngine',
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
        cspName: 'aws' | 'azure' | 'alicloud' | 'huawei' | 'openstack' | 'flexibleEngine',
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
     * List credentials of the service.
     * @param id The id of the deployed service.
     * @param type The type of credential.
     * @returns CredentialDefinition OK
     * @throws ApiError
     */
    public static getCredentialDefinitionsByServiceId(
        id: string,
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<CredentialDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/service/{id}/credentials',
            path: {
                id: id,
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

    /**
     * List credential types provided by the cloud service provider.
     * @param id The id of the deployed service.
     * @returns string OK
     * @throws ApiError
     */
    public static getCredentialTypesByServiceId(
        id: string
    ): CancelablePromise<Array<'variables' | 'http_authentication' | 'api_key' | 'oauth2'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/service/{id}/credential/types',
            path: {
                id: id,
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
     * List credential capabilities of the service.
     * @param id The id of the deployed service.
     * @param type The type of credential.
     * @returns AbstractCredentialInfo OK
     * @throws ApiError
     */
    public static getCredentialCapabilitiesByServiceId(
        id: string,
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<AbstractCredentialInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/service/{id}/credential/capabilities',
            path: {
                id: id,
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

    /**
     * List credentials of the cloud service provider and the user.
     * @param cspName The cloud service provider.
     * @param userName The name of user who provided the credential.
     * @param type The type of credential.
     * @returns CredentialDefinition OK
     * @throws ApiError
     */
    public static getCredentialDefinitionsByCsp(
        cspName: 'aws' | 'azure' | 'alicloud' | 'huawei' | 'openstack' | 'flexibleEngine',
        userName: string,
        type?: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Array<CredentialDefinition>> {
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
        cspName: 'aws' | 'azure' | 'alicloud' | 'huawei' | 'openstack' | 'flexibleEngine'
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
        cspName: 'aws' | 'azure' | 'alicloud' | 'huawei' | 'openstack' | 'flexibleEngine',
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
