/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMetrics, GetMetricsData, Metric, MonitorResourceType, Options } from '../../../xpanse-api/generated';
import {
    fetchMonitorMetricDataTimeInterval,
    fetchOnlyLastKnownMonitorMetricDataTimeInterval,
    monitorMetricQueueSize,
} from '../../utils/constants';
import { getMetricRequestParams, getTotalSecondsOfTimePeriod } from './metricProps';

const onlyLastKnownMetricQueryFn = async (serviceId: string, metricType: MonitorResourceType) => {
    const request: Options<GetMetricsData> = {
        query: {
            serviceId: serviceId,
            resourceId: undefined,
            monitorResourceType: metricType,
            from: undefined,
            to: undefined,
            granularity: undefined,
            onlyLastKnownMetric: true,
        },
    };
    const response = await getMetrics(request);
    return response.data;
};

export function useGetLastKnownMetricForASpecificTypeQuery(
    serviceId: string,
    isAutoRefresh: boolean,
    isQueryEnabled: boolean,
    metricType: MonitorResourceType
) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['onlyLastKnownMetric', serviceId, metricType],
        queryFn: async () => {
            const previous = queryClient.getQueryData<Metric[]>(['onlyLastKnownMetric', serviceId, metricType]);
            const metrics = await onlyLastKnownMetricQueryFn(serviceId, metricType);
            // merge previous and current values in to one single list. The client of the query will filter out if any duplicates.
            // it also ensures only the last fifty values are returned.
            return [...(previous ?? []), ...(metrics ?? [])].slice(-monitorMetricQueueSize);
        },
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

const monitorMetricQueryFn = async (serviceId: string, metricType: MonitorResourceType, timePeriod: number) => {
    const request: Options<GetMetricsData> = {
        query: {
            serviceId: serviceId,
            resourceId: undefined,
            monitorResourceType: metricType,
            from: getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).from,
            to: getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).to,
            granularity: undefined,
            onlyLastKnownMetric: false,
        },
    };
    const response = await getMetrics(request);
    return response.data;
};

export function useGetMetricsForSpecificTimePeriodAndSpecificType(
    serviceId: string,
    timePeriod: number,
    isQueryEnabled: boolean,
    metricType: MonitorResourceType,
    isAutoRefresh: boolean
) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['metric', serviceId, metricType, timePeriod],
        queryFn: async () => {
            const previous = queryClient.getQueryData<Metric[]>(['metric', serviceId, metricType, timePeriod]);
            const metrics = await monitorMetricQueryFn(serviceId, metricType, timePeriod);
            // merge previous and current values in to one single list. The client of the query will filter out if any duplicates.
            // it also ensures only the last fifty values are returned.
            return [...(previous ?? []), ...(metrics ?? [])].slice(-monitorMetricQueueSize);
        },
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
