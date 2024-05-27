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
import type { ServicePrice } from '../models/ServicePrice';
export class CloudResourcesService {
    /**
     * List existing cloud resource names with kind<br>Required role:<b> admin</b> or <b>user</b>
     * @param templateId id of the service template
     * @param region region name of the service
     * @param flavorName flavor name of the service
     * @param billingMode mode of billing
     * @returns ServicePrice OK
     * @throws ApiError
     */
    public static getServicePriceByFlavor(
        templateId: string,
        region: string,
        flavorName: string,
        billingMode: 'Fixed' | 'Pay per Use'
    ): CancelablePromise<ServicePrice> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/pricing/{templateId}/{region}/{flavorName}/{billingMode}',
            path: {
                templateId: templateId,
                region: region,
                flavorName: flavorName,
                billingMode: billingMode,
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
     * List existing cloud resource names with kind<br>Required role:<b> admin</b> or <b>user</b>
     * @param csp name of the cloud service provider
     * @param region name of he region
     * @param deployResourceKind kind of the CloudResource
     * @returns string OK
     * @throws ApiError
     */
    public static getExistingResourceNamesWithKind(
        csp: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        region: string,
        deployResourceKind:
            | 'vm'
            | 'container'
            | 'publicIP'
            | 'vpc'
            | 'volume'
            | 'unknown'
            | 'security_group'
            | 'security_group_rule'
            | 'keypair'
            | 'subnet'
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/csp/resources/{deployResourceKind}',
            path: {
                deployResourceKind: deployResourceKind,
            },
            query: {
                csp: csp,
                region: region,
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
