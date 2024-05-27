/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { Ocl } from '../models/Ocl';
import type { Response } from '../models/Response';
import type { ServiceTemplateDetailVo } from '../models/ServiceTemplateDetailVo';
export class ServiceVendorService {
    /**
     * Get service template using id.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param id id of service template
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static details(id: string): CancelablePromise<ServiceTemplateDetailVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/service_templates/{id}',
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
     * Update service template using id and ocl model.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param id id of service template
     * @param requestBody
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static update(id: string, requestBody: Ocl): CancelablePromise<ServiceTemplateDetailVo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/service_templates/{id}',
            path: {
                id: id,
            },
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
     * Delete service template using id.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param id id of service template
     * @returns Response OK
     * @throws ApiError
     */
    public static unregister(id: string): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/service_templates/{id}',
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
     * Update service template using id and URL of Ocl file.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param id id of service template
     * @param oclLocation URL of Ocl file
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static fetchUpdate(id: string, oclLocation: string): CancelablePromise<ServiceTemplateDetailVo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/service_templates/file/{id}',
            path: {
                id: id,
            },
            query: {
                oclLocation: oclLocation,
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
     * List service templates with query params.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param categoryName category of the service
     * @param cspName name of the cloud service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceHostingType who hosts ths cloud resources
     * @param serviceRegistrationState state of registration
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static listServiceTemplates(
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
        serviceHostingType?: 'self' | 'service-vendor',
        serviceRegistrationState?: 'approval pending' | 'approved' | 'rejected'
    ): CancelablePromise<Array<ServiceTemplateDetailVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/service_templates',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceHostingType: serviceHostingType,
                serviceRegistrationState: serviceRegistrationState,
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
     * Register new service template using ocl model.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param requestBody
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static register(requestBody: Ocl): CancelablePromise<ServiceTemplateDetailVo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/service_templates',
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
     * Register new service template using URL of Ocl file.<br>Required role:<b> admin</b> or <b>isv</b>
     * @param oclLocation URL of Ocl file
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static fetch(oclLocation: string): CancelablePromise<ServiceTemplateDetailVo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/service_templates/file',
            query: {
                oclLocation: oclLocation,
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
