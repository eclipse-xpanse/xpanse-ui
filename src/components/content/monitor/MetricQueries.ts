/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { Metric, MonitorService } from '../../../xpanse-api/generated';
import {
    fetchMonitorMetricDataTimeInterval,
    fetchOnlyLastKnownMonitorMetricDataTimeInterval,
} from '../../utils/constants';
import { getMetricRequestParams, getTotalSecondsOfTimePeriod } from './metricProps';

const onlyLastKnownMetricQueryFn = (serviceId: string, metricType: Metric.monitorResourceType) =>
    MonitorService.getMetrics(serviceId, undefined, metricType, undefined, undefined, undefined, true);

export function useGetLastKnownMetricForASpecificTypeQuery(
    serviceId: string,
    isAutoRefresh: boolean,
    isQueryEnabled: boolean,
    metricType: Metric.monitorResourceType
) {
    return useQuery({
        queryKey: ['onlyLastKnownMetric', serviceId, metricType],
        queryFn: () => onlyLastKnownMetricQueryFn(serviceId, metricType),
        refetchInterval: (query) =>
            query.state.error ? false : isAutoRefresh ? fetchOnlyLastKnownMonitorMetricDataTimeInterval : false,
        refetchIntervalInBackground: isQueryEnabled,
        refetchOnWindowFocus: false,
        enabled: isQueryEnabled,
        staleTime: 0,
        gcTime: 0,
    });
}

const monitorMetricQueryFn = (serviceId: string, metricType: Metric.monitorResourceType, timePeriod: number) =>
    MonitorService.getMetrics(
        serviceId,
        undefined,
        metricType,
        getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).from,
        getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).to,
        undefined,
        false
    );

export function useGetMetricsForSpecificTimePeriodAndSpecificType(
    serviceId: string,
    timePeriod: number,
    isQueryEnabled: boolean,
    metricType: Metric.monitorResourceType,
    isAutoRefresh: boolean
) {
    return useQuery({
        queryKey: ['metric', serviceId, metricType, timePeriod],
        queryFn: () => monitorMetricQueryFn(serviceId, metricType, timePeriod),
        refetchInterval: (query) =>
            query.state.error ? false : isAutoRefresh ? fetchMonitorMetricDataTimeInterval : false,
        refetchIntervalInBackground: isQueryEnabled,
        refetchOnWindowFocus: false,
        enabled: isQueryEnabled,
        staleTime: 0,
        gcTime: 0,
    });
}
