/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getMetrics, GetMetricsData, monitorResourceType } from '../../../xpanse-api/generated';
import {
    fetchMonitorMetricDataTimeInterval,
    fetchOnlyLastKnownMonitorMetricDataTimeInterval,
} from '../../utils/constants';
import { getMetricRequestParams, getTotalSecondsOfTimePeriod } from './metricProps';

const onlyLastKnownMetricQueryFn = (serviceId: string, metricType: monitorResourceType) => {
    const data: GetMetricsData = {
        serviceId: serviceId,
        resourceId: undefined,
        monitorResourceType: metricType,
        _from: undefined,
        to: undefined,
        granularity: undefined,
        onlyLastKnownMetric: true,
    };
    return getMetrics(data);
};

export function useGetLastKnownMetricForASpecificTypeQuery(
    serviceId: string,
    isAutoRefresh: boolean,
    isQueryEnabled: boolean,
    metricType: monitorResourceType
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
        notifyOnChangeProps: 'all',
    });
}

const monitorMetricQueryFn = (serviceId: string, metricType: monitorResourceType, timePeriod: number) => {
    const data: GetMetricsData = {
        serviceId: serviceId,
        resourceId: undefined,
        monitorResourceType: metricType,
        _from: getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).from,
        to: getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).to,
        granularity: undefined,
        onlyLastKnownMetric: false,
    };
    return getMetrics(data);
};

export function useGetMetricsForSpecificTimePeriodAndSpecificType(
    serviceId: string,
    timePeriod: number,
    isQueryEnabled: boolean,
    metricType: monitorResourceType,
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
        notifyOnChangeProps: 'all',
    });
}
