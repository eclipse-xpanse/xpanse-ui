/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRequest } from '../models/CreateRequest';
import type { Response } from '../models/Response';
import type { ServiceDetailVo } from '../models/ServiceDetailVo';
import type { ServiceVo } from '../models/ServiceVo';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceService {
    /**
     * List all deployed services by a user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param categoryName category of the service
     * @param cspName name of the cloud service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceState deployment state of the service
     * @returns ServiceVo OK
     * @throws ApiError
     */
    public static listDeployedServices(
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
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'alicloud' | 'aws' | 'azure' | 'google',
        serviceName?: string,
        serviceVersion?: string,
        serviceState?:
            | 'DEPLOYING'
            | 'DEPLOY_SUCCESS'
            | 'DEPLOY_FAILED'
            | 'DESTROYING'
            | 'DESTROY_SUCCESS'
            | 'DESTROY_FAILED'
    ): CancelablePromise<Array<ServiceVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceState: serviceState,
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
     * Start a task to deploy service using registered service template.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns string Accepted
     * @throws ApiError
     */
    public static deploy(requestBody: CreateRequest): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/services',
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
     * Get deployed service details by id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id Task id of deployed service
     * @returns ServiceDetailVo OK
     * @throws ApiError
     */
    public static getServiceDetailsById(id: string): CancelablePromise<ServiceDetailVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/{id}',
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
     * Start a task to destroy the deployed service using id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns Response Accepted
     * @throws ApiError
     */
    public static destroy(id: string): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/{id}',
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
}
