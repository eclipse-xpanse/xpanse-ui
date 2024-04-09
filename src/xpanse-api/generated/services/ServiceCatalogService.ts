/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Link } from '../models/Link';
import type { UserOrderableServiceVo } from '../models/UserOrderableServiceVo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceCatalogService {
    /**
     * List of all approved services which are available for user to order.<br>Required role:<b> admin</b> or <b>user</b>
     * @param categoryName category of the service
     * @param cspName name of the cloud service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceHostingType who hosts ths cloud resources
     * @returns UserOrderableServiceVo OK
     * @throws ApiError
     */
    public static listOrderableServices(
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
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        serviceName?: string,
        serviceVersion?: string,
        serviceHostingType?: 'self' | 'service-vendor'
    ): CancelablePromise<Array<UserOrderableServiceVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/catalog/services',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceHostingType: serviceHostingType,
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
     * Get deployable service by id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id The id of orderable service.
     * @returns UserOrderableServiceVo OK
     * @throws ApiError
     */
    public static getOrderableServiceDetails(id: string): CancelablePromise<UserOrderableServiceVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/catalog/services/{id}',
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
     * Get the API document of the orderable service.<br>Required role:<b> admin</b> or <b>isv</b> or <b>user</b>
     * @param id
     * @returns Link OK
     * @throws ApiError
     */
    public static openApi(id: string): CancelablePromise<Link> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/catalog/services/{id}/openapi',
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
