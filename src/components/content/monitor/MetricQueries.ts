/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getMetrics, GetMetricsData, MonitorResourceType, Options } from '../../../xpanse-api/generated';
import {
    fetchMonitorMetricDataTimeInterval,
    fetchOnlyLastKnownMonitorMetricDataTimeInterval,
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
