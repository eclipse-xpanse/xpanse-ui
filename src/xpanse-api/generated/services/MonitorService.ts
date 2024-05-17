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
import type { Metric } from '../models/Metric';
export class MonitorService {
    /**
     * Get metrics of a deployed service or a resource.<br>Required role:<b> admin</b> or <b>user</b>
     * @param serviceId Id of the deployed service
     * @param resourceId Id of resource in the deployed service
     * @param monitorResourceType Types of the monitor resource.
     * @param from Start UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the five minutes ago.
     * @param to End UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the current time.
     * @param granularity Return metrics collected in provided time interval. This depends on how the source systems have generated/collected metrics.
     * @param onlyLastKnownMetric Returns only the last known metric. When this parameter is set then all other query parameters are ignored.
     * @returns Metric OK
     * @throws ApiError
     */
    public static getMetrics(
        serviceId: string,
        resourceId?: string,
        monitorResourceType?: 'cpu' | 'mem' | 'vm_network_incoming' | 'vm_network_outgoing',
        from?: number,
        to?: number,
        granularity?: number,
        onlyLastKnownMetric: boolean = false
    ): CancelablePromise<Array<Metric>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/metrics',
            query: {
                serviceId: serviceId,
                resourceId: resourceId,
                monitorResourceType: monitorResourceType,
                from: from,
                to: to,
                granularity: granularity,
                onlyLastKnownMetric: onlyLastKnownMetric,
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
