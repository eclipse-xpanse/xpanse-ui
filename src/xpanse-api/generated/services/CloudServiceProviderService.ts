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
import type { ReviewRegistrationRequest } from '../models/ReviewRegistrationRequest';
import type { ServiceTemplateDetailVo } from '../models/ServiceTemplateDetailVo';
export class CloudServiceProviderService {
    /**
     * Review service template registration.<br>Required role:<b> admin</b> or <b>csp</b>
     * @param id id of service template
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static reviewRegistration(id: string, requestBody: ReviewRegistrationRequest): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/xpanse/service_templates/review/{id}',
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
     * List managed service templates with query params.<br>Required role:<b> admin</b> or <b>csp</b>
     * @param categoryName category of the service
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceHostingType who hosts ths cloud resources
     * @param serviceRegistrationState state of registration
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static listManagedServiceTemplates(
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
        serviceName?: string,
        serviceVersion?: string,
        serviceHostingType?: 'self' | 'service-vendor',
        serviceRegistrationState?: 'unregistered' | 'approval pending' | 'approved' | 'rejected'
    ): CancelablePromise<Array<ServiceTemplateDetailVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/csp/service_templates',
            query: {
                categoryName: categoryName,
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
     * view service template by id.<br>Required role:<b> admin</b> or <b>csp</b>
     * @param id id of service template
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static getRegistrationDetails(id: string): CancelablePromise<ServiceTemplateDetailVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/csp/service_templates/{id}',
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
