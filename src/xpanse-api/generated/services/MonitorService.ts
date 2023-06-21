/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Metric } from '../models/Metric';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MonitorService {
    /**
     * Get metrics of the deployed service.
     * @param id Id of the deployed service
     * @param monitorResourceType Types of the monitor resource.
     * @param from Start UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the five minutes ago.
     * @param to End UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the current time.
     * @param granularity Return metrics collected in provided time interval. This depends on how the source systems have generated/collected metrics.
     * @param onlyLastKnownMetric Returns only the last known metric. When this parameter is set then all other query parameters are ignored.
     * @returns Metric OK
     * @throws ApiError
     */
    public static getMetricsByServiceId(
        id: string,
        monitorResourceType?: 'cpu' | 'mem' | 'vm_network_incoming' | 'vm_network_outgoing',
        from?: number,
        to?: number,
        granularity?: number,
        onlyLastKnownMetric: boolean = false
    ): CancelablePromise<Array<Metric>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/monitor/metric/service/{id}',
            path: {
                id: id,
            },
            query: {
                monitorResourceType: monitorResourceType,
                from: from,
                to: to,
                granularity: granularity,
                onlyLastKnownMetric: onlyLastKnownMetric,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Get metrics of the deployed resource.
     * @param id Id of the deployed resource.
     * @param monitorResourceType Types of the monitor resource.
     * @param from Start UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the five minutes ago.
     * @param to End UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the current time.
     * @param granularity Return metrics collected in provided time interval. This depends on how the source systems have generated/collected metrics.
     * @param onlyLastKnownMetric Returns only the last known metric. When this parameter is set then all other query parameters are ignored.
     * @returns Metric OK
     * @throws ApiError
     */
    public static getMetricsByResourceId(
        id: string,
        monitorResourceType?: 'cpu' | 'mem' | 'vm_network_incoming' | 'vm_network_outgoing',
        from?: number,
        to?: number,
        granularity?: number,
        onlyLastKnownMetric?: boolean
    ): CancelablePromise<Array<Metric>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/monitor/metric/resource/{id}',
            path: {
                id: id,
            },
            query: {
                monitorResourceType: monitorResourceType,
                from: from,
                to: to,
                granularity: granularity,
                onlyLastKnownMetric: onlyLastKnownMetric,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
}
