/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ocl } from '../models/Ocl';
import type { RegisteredServiceVo } from '../models/RegisteredServiceVo';
import type { Response } from '../models/Response';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceVendorService {
    /**
     * Get registered service using id.<br>**Required role: admin or csp**
     * @param id id of registered service
     * @returns RegisteredServiceVo OK
     * @throws ApiError
     */
    public static detail(id: string): CancelablePromise<RegisteredServiceVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/register/{id}',
            path: {
                id: id,
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
     * Update registered service using id and ocl model.<br>**Required role: admin or csp**
     * @param id id of registered service
     * @param requestBody
     * @returns RegisteredServiceVo OK
     * @throws ApiError
     */
    public static update(id: string, requestBody: Ocl): CancelablePromise<RegisteredServiceVo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/register/{id}',
            path: {
                id: id,
            },
            body: requestBody,
            mediaType: 'application/x-yaml',
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
     * Unregister registered service using id.<br>**Required role: admin or csp**
     * @param id id of registered service
     * @returns Response OK
     * @throws ApiError
     */
    public static unregister(id: string): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/register/{id}',
            path: {
                id: id,
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
     * Update registered service using id and ocl file url.<br>**Required role: admin or csp**
     * @param id id of registered service
     * @param oclLocation URL of Ocl file
     * @returns RegisteredServiceVo OK
     * @throws ApiError
     */
    public static fetchUpdate(id: string, oclLocation: string): CancelablePromise<RegisteredServiceVo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/services/register/file/{id}',
            path: {
                id: id,
            },
            query: {
                oclLocation: oclLocation,
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
     * List registered service with query params.<br>**Required role: admin or csp**
     * @param categoryName category of the service
     * @param cspName name of the service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @returns RegisteredServiceVo OK
     * @throws ApiError
     */
    public static listRegisteredServices(
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
    ): CancelablePromise<Array<RegisteredServiceVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/register',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
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
     * Register new service using ocl model.<br>**Required role: admin or csp**
     * @param requestBody
     * @returns RegisteredServiceVo OK
     * @throws ApiError
     */
    public static register(requestBody: Ocl): CancelablePromise<RegisteredServiceVo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/services/register',
            body: requestBody,
            mediaType: 'application/x-yaml',
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
     * Register new service with URL of Ocl file.<br>**Required role: admin or csp**
     * @param oclLocation URL of Ocl file
     * @returns RegisteredServiceVo OK
     * @throws ApiError
     */
    public static fetch(oclLocation: string): CancelablePromise<RegisteredServiceVo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/services/register/file',
            query: {
                oclLocation: oclLocation,
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
     * Get category list.<br>**Required role: admin or csp**
     * @returns string OK
     * @throws ApiError
     */
    public static listCategories(): CancelablePromise<
        Array<
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
        >
    > {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/categories',
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
