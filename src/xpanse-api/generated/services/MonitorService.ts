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
     * @param monitorResourceType Types of the monitor resource
     * @param from Start UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the five minutes ago.
     * @param to End UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the current time.
     * @param granularity Return metrics collected in provided time interval. This depends on how the source systems have generated/collected metrics.
     * @returns Metric OK
     * @throws ApiError
     */
    public static getMetrics(
        id: string,
        monitorResourceType?: 'cpu' | 'mem' | 'vm_network_incoming' | 'vm_network_outgoing',
        from?: number,
        to?: number,
        granularity?: number
    ): CancelablePromise<Array<Metric>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/monitor/metric/{id}',
            path: {
                id: id,
            },
            query: {
                monitorResourceType: monitorResourceType,
                from: from,
                to: to,
                granularity: granularity,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get metrics of the deployed service.
     * @param id Id of the deployed service
     * @param monitorResourceType Types of the monitor resource.
     * @param from Start UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the five minutes ago.
     * @param to End UNIX timestamp in milliseconds. If no value filled,the default value is the UNIX timestamp in milliseconds of the current time.
     * @param granularity Return metrics collected in provided time interval. This depends on how the source systems have generated/collected metrics.
     * @returns Metric OK
     * @throws ApiError
     */
    public static getMetricsByServiceId(
        id: string,
        monitorResourceType?: 'cpu' | 'mem' | 'vm_network_incoming' | 'vm_network_outgoing',
        from?: number,
        to?: number,
        granularity?: number
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
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
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
     * @returns Metric OK
     * @throws ApiError
     */
    public static getMetricsByResourceId(
        id: string,
        monitorResourceType?: 'cpu' | 'mem' | 'vm_network_incoming' | 'vm_network_outgoing',
        from?: number,
        to?: number,
        granularity?: number
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
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }
}
