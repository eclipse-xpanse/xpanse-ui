/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceTemplateDetailVo } from '../models/ServiceTemplateDetailVo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CloudServiceProviderService {
    /**
     * List all service templates with query params.<br>Required role:<b> admin</b> or <b>csp</b>
     * @param categoryName category of the service
     * @param cspName name of the cloud service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceHostingType who hosts ths cloud resources
     * @returns ServiceTemplateDetailVo OK
     * @throws ApiError
     */
    public static listAllServiceTemplates(
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
    ): CancelablePromise<Array<ServiceTemplateDetailVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/service_templates/all',
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
}
