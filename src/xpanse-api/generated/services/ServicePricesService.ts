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
import type { FlavorPriceResult } from '../models/FlavorPriceResult';
export class ServicePricesService {
    /**
     * Get the price of one specific flavor of the service.<br>Required role:<b> admin</b> or <b>user</b>
     * @param templateId id of the service template
     * @param region region name of the service
     * @param billingMode mode of billing
     * @param flavorName flavor name of the service
     * @returns FlavorPriceResult OK
     * @throws ApiError
     */
    public static getServicePriceByFlavor(
        templateId: string,
        region: string,
        billingMode: 'Fixed' | 'Pay per Use',
        flavorName: string
    ): CancelablePromise<FlavorPriceResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/pricing/{templateId}/{region}/{billingMode}/{flavorName}',
            path: {
                templateId: templateId,
                region: region,
                billingMode: billingMode,
                flavorName: flavorName,
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
     * Get the prices of all flavors of the service<br>Required role:<b> admin</b> or <b>user</b>
     * @param templateId id of the service template
     * @param region region name of the service
     * @param billingMode mode of billing
     * @returns FlavorPriceResult OK
     * @throws ApiError
     */
    public static getPricesByService(
        templateId: string,
        region: string,
        billingMode: 'Fixed' | 'Pay per Use'
    ): CancelablePromise<Array<FlavorPriceResult>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/pricing/service/{templateId}/{region}/{billingMode}',
            path: {
                templateId: templateId,
                region: region,
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
}
