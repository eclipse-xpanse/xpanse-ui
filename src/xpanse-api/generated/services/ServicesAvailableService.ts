/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryOclVo } from '../models/CategoryOclVo';
import type { Link } from '../models/Link';
import type { UserAvailableServiceVo } from '../models/UserAvailableServiceVo';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServicesAvailableService {
    /**
     * List the available services.
     * @param categoryName category of the service
     * @param cspName name of the service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @returns UserAvailableServiceVo OK
     * @throws ApiError
     */
    public static listAvailableServices(
        categoryName?:
            | 'ai'
            | 'compute'
            | 'container'
            | 'storage'
            | 'network'
            | 'database'
            | 'mediaService'
            | 'security'
            | 'middleware'
            | 'others',
        cspName?: string,
        serviceName?: string,
        serviceVersion?: string
    ): CancelablePromise<Array<UserAvailableServiceVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/available',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
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
     * Get available service by id.
     * @param id The id of available service.
     * @returns UserAvailableServiceVo OK
     * @throws ApiError
     */
    public static availableServiceDetails(id: string): CancelablePromise<UserAvailableServiceVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/available/{id}',
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
     * Get the API document of the available service.
     * @param id
     * @returns Link OK
     * @throws ApiError
     */
    public static openApi(id: string): CancelablePromise<Link> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/available/{id}/openapi',
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
     * Get the available services by tree.
     * @param categoryName category of the service
     * @returns CategoryOclVo OK
     * @throws ApiError
     */
    public static getAvailableServicesTree(
        categoryName:
            | 'ai'
            | 'compute'
            | 'container'
            | 'storage'
            | 'network'
            | 'database'
            | 'mediaService'
            | 'security'
            | 'middleware'
            | 'others'
    ): CancelablePromise<Array<CategoryOclVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/available/category/{categoryName}',
            path: {
                categoryName: categoryName,
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
     * @param id The id of the deployed service.
     * @param type The type of credential.
     * @returns Link OK
     * @throws ApiError
     */
    public static getCredentialOpenApiByServiceId(
        id: string,
        type: 'variables' | 'http_authentication' | 'api_key' | 'oauth2'
    ): CancelablePromise<Link> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/auth/service/{id}/openapi/{type}',
            path: {
                id: id,
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
     * Get the API document for adding credential of the Csp.
     * @param cspName The cloud service provider.
     * @param type The type of credential.
     * @returns Link OK
     * @throws ApiError
     */
    public static getCredentialOpenApi(
        cspName: 'aws' | 'azure' | 'alicloud' | 'huawei' | 'openstack' | 'flexibleEngine',
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
}
