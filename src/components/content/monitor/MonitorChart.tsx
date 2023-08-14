/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Spin } from 'antd';
import {
    getCurrentMetricProps,
    getCurrentMetrics,
    getMetricProps,
    getMetricRequestParams,
    getNewMetricQueueItem,
    getOptionData,
    getTotalSecondsOfTimePeriod,
    lastMinuteRadioButtonKeyId,
    lastNonEmptyMetricsByTimePeriodAndActiveMonitorMetricType,
    MetricProps,
    MetricQueueParams,
    metricsIsEmpty,
} from './metricProps';
import React, { useEffect, useRef, useState } from 'react';
import { MonitorMetricsType } from './MonitorMetricsType';
import { ApiError, Metric, MonitorService, Response } from '../../../xpanse-api/generated';
import * as echarts from 'echarts/core';
import {
    fetchMonitorMetricDataTimeInterval,
    fetchOnlyLastKnownMonitorMetricDataTimeInterval,
    monitorMetricQueueSize,
} from '../../utils/constants';
import moment from 'moment';
import { MetricOptionDataByChartsPerRow } from './MetricOptionDataByChartsPerRow';
import { useQuery } from '@tanstack/react-query';

export const MonitorChart = ({
    serviceId,
    timePeriod,
    isAutoRefresh,
    chartsPerRow,
    getTipInfo,
    getIsLoading,
    getOptionLength,
}: {
    serviceId: string;
    timePeriod: number;
    isAutoRefresh: boolean;
    chartsPerRow: string;
    getTipInfo: (
        serviceId: string,
        isLoading: boolean,
        tipType: 'error' | 'success' | undefined,
        tipMessage: string,
        tipDescription: string,
        isQueryResultDisabled: boolean
    ) => void;
    getIsLoading: (isLoading: boolean) => void;
    getOptionLength: (optionLength: number) => void;
}): JSX.Element => {
    const [activeMonitorMetricType, setActiveMonitorMetricType] = useState<string>(
        Metric.monitorResourceType.CPU.valueOf()
    );

    const [isRefreshOnlyLastKnownMetric, setIsRefreshOnlyLastKnownMetric] = useState<boolean>(false);
    const [isRefreshMonitorMetric, setIsRefreshMonitorMetric] = useState<boolean>(false);

    const [onlyLastKnownMonitorMetricsQueue, setOnlyLastKnownMonitorMetricsQueue] = useState<Metric[][] | undefined>(
        undefined
    );
    const [monitorMetricsQueue, setMonitorMetricsQueue] = useState<MetricQueueParams[]>([]);

    const [chartsTitle, setChartsTitle] = useState<{ Id: string; metricTitle: string; metricSubTitle: string }[]>([]);
    const [options, setOptions] = useState<echarts.EChartsCoreOption[]>([]);

    const tipMessageInfo = useRef<string>('');
    const tipDescriptionInfo = useRef<string[]>([]);

    const getActiveMonitorMetricType = (activeMonitorMetricType: string) => {
        setActiveMonitorMetricType(activeMonitorMetricType);
    };

    useEffect(() => {
        if (serviceId.length > 0 && timePeriod === lastMinuteRadioButtonKeyId && isAutoRefresh) {
            setIsRefreshOnlyLastKnownMetric(true);
            setIsRefreshMonitorMetric(false);
        } else if (
            serviceId.length > 0 &&
            timePeriod !== lastMinuteRadioButtonKeyId &&
            activeMonitorMetricType.length > 0 &&
            isAutoRefresh
        ) {
            setIsRefreshOnlyLastKnownMetric(false);
            setIsRefreshMonitorMetric(true);
        }
    }, [serviceId, timePeriod, activeMonitorMetricType, isAutoRefresh]);

    const onlyLastKnownMetricQueryKey = ['onlyLastKnownMetric', serviceId];
    const onlyLastKnownMetricQueryFn = () =>
        MonitorService.getMetrics(serviceId, undefined, undefined, undefined, undefined, undefined, true);

    const onlyLastKnownMetricQuery = useQuery(onlyLastKnownMetricQueryKey, onlyLastKnownMetricQueryFn, {
        refetchInterval: isRefreshOnlyLastKnownMetric ? fetchOnlyLastKnownMonitorMetricDataTimeInterval : false,
        refetchIntervalInBackground: isRefreshOnlyLastKnownMetric,
        refetchOnWindowFocus: false,
        enabled: isRefreshOnlyLastKnownMetric,
        staleTime: 0,
        cacheTime: 0,
    });

    const monitorMetricQueryKey = ['metric', serviceId, activeMonitorMetricType, timePeriod];
    const monitorMetricQueryFn = () =>
        MonitorService.getMetrics(
            serviceId,
            undefined,
            activeMonitorMetricType as Metric.monitorResourceType,
            getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).from,
            getMetricRequestParams(getTotalSecondsOfTimePeriod(timePeriod)).to,
            undefined,
            false
        );

    const monitorMetricQuery = useQuery(monitorMetricQueryKey, monitorMetricQueryFn, {
        refetchInterval: isRefreshMonitorMetric ? fetchMonitorMetricDataTimeInterval : false,
        refetchIntervalInBackground: isRefreshMonitorMetric,
        refetchOnWindowFocus: false,
        enabled: isRefreshMonitorMetric,
        staleTime: 0,
        cacheTime: 0,
    });

    useEffect(() => {
        if (onlyLastKnownMetricQuery.isLoading) {
            getTipInfo(serviceId, false, undefined, '', '', true);
            getIsLoading(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyLastKnownMetricQuery.isLoading, serviceId]);

    useEffect(() => {
        if (onlyLastKnownMetricQuery.isSuccess) {
            getIsLoading(false);
            const data: Metric[] | undefined = onlyLastKnownMetricQuery.data;
            if (data.length > 0) {
                getTipInfo(serviceId, false, undefined, '', '', false);
                setOnlyLastKnownMonitorMetricsQueue((prevQueue: Metric[][] | undefined) => {
                    let newQueue: Metric[][];

                    if (prevQueue) {
                        newQueue = [...prevQueue, data];
                        if (newQueue.length > monitorMetricQueueSize) {
                            newQueue.shift();
                        }
                    } else {
                        newQueue = [data];
                    }

                    return newQueue;
                });
            } else {
                setOnlyLastKnownMonitorMetricsQueue([]);
                getTipInfo('', false, 'success', 'No metrics found for the selected service.', '', false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyLastKnownMetricQuery.isSuccess, onlyLastKnownMetricQuery.data, serviceId]);

    useEffect(() => {
        if (onlyLastKnownMetricQuery.isError) {
            getIsLoading(false);
            setOnlyLastKnownMonitorMetricsQueue([]);
            setTips(onlyLastKnownMetricQuery.error as Error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyLastKnownMetricQuery.isError, onlyLastKnownMetricQuery.error]);

    useEffect(() => {
        if (monitorMetricQuery.isSuccess) {
            const rsp: Metric[] | undefined = monitorMetricQuery.data;
            if (rsp.length > 0) {
                getTipInfo(serviceId, false, undefined, '', '', false);
                setMonitorMetricsQueue((prevQueue: MetricQueueParams[]) => {
                    let newQueue: MetricQueueParams[];
                    if (metricsIsEmpty(rsp)) {
                        const currentItem: MetricQueueParams | undefined =
                            lastNonEmptyMetricsByTimePeriodAndActiveMonitorMetricType(
                                timePeriod,
                                activeMonitorMetricType as Metric.monitorResourceType,
                                prevQueue
                            );
                        if (currentItem === undefined) {
                            newQueue = [
                                ...prevQueue,
                                getNewMetricQueueItem(
                                    timePeriod,
                                    activeMonitorMetricType as Metric.monitorResourceType,
                                    rsp
                                ),
                            ];
                        } else {
                            newQueue = [...prevQueue, currentItem];
                        }
                    } else {
                        newQueue = [
                            ...prevQueue,
                            getNewMetricQueueItem(
                                timePeriod,
                                activeMonitorMetricType as Metric.monitorResourceType,
                                rsp
                            ),
                        ];
                    }

                    if (newQueue.length > monitorMetricQueueSize) {
                        newQueue.shift();
                    }

                    return newQueue;
                });
            } else {
                setMonitorMetricsQueue([]);
                getTipInfo('', false, 'success', 'No metrics found for the selected service.', '', false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorMetricQuery.isSuccess, monitorMetricQuery.data, serviceId, timePeriod, activeMonitorMetricType]);

    useEffect(() => {
        if (monitorMetricQuery.isError) {
            setMonitorMetricsQueue([]);
            setTips(monitorMetricQuery.error as Error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorMetricQuery.isError, monitorMetricQuery.error]);

    const setTips = (error: Error) => {
        if (error instanceof ApiError && 'details' in error.body) {
            const response: Response = error.body as Response;
            tipMessageInfo.current = response.resultType.valueOf();
            tipDescriptionInfo.current = response.details;
        } else {
            tipMessageInfo.current = 'Error while fetching metrics data.';
            tipDescriptionInfo.current = [error.message];
        }
        getTipInfo('', false, 'error', tipMessageInfo.current, tipDescriptionInfo.current.join(), false);
    };

    useEffect(() => {
        if (onlyLastKnownMonitorMetricsQueue === undefined || onlyLastKnownMonitorMetricsQueue.length === 0) {
            return;
        }
        if (timePeriod === lastMinuteRadioButtonKeyId) {
            const metrics: Metric[] = [];
            onlyLastKnownMonitorMetricsQueue.forEach((item: Metric[]) => {
                item.forEach((metric: Metric) => {
                    metrics.push(metric);
                });
            });
            showMonitorMetrics(metrics);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyLastKnownMonitorMetricsQueue, timePeriod, activeMonitorMetricType]);

    useEffect(() => {
        if (monitorMetricsQueue.length === 0) {
            return;
        }
        if (timePeriod !== lastMinuteRadioButtonKeyId) {
            const metrics: Metric[] = [];
            monitorMetricsQueue[monitorMetricsQueue.length - 1].metricList.forEach((metric: Metric) => {
                metrics.push(metric);
            });

            showMonitorMetrics(metrics);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorMetricsQueue, timePeriod, activeMonitorMetricType]);

    const showMonitorMetrics = (metrics: Metric[]) => {
        const currentMetrics: Map<string, Metric[]> = getCurrentMetrics(metrics);
        new Map([...currentMetrics.entries()].sort()).forEach((v, k) => {
            if (k === activeMonitorMetricType) {
                const metricProps: MetricProps[] = getMetricProps(v);
                getMetricOptions(metricProps);
            }
        });
    };

    const getMetricOptions = (metricProps: MetricProps[]) => {
        const newCurrentTime = new Date();
        if (timePeriod === lastMinuteRadioButtonKeyId) {
            const totalSeconds: number = getTotalSecondsOfTimePeriod(timePeriod);
            newCurrentTime.setSeconds(newCurrentTime.getSeconds() - totalSeconds);
        }

        const currentMetricProps: Map<string, MetricProps[]> = getCurrentMetricProps(metricProps);
        const currentChartsTitle: { Id: string; metricTitle: string; metricSubTitle: string }[] = [];
        const currentOptions: echarts.EChartsCoreOption[] = [];

        currentMetricProps.forEach((metricProps, vmId) => {
            currentChartsTitle.push({
                Id: vmId,
                metricTitle: metricProps[0].name
                    .split('_')[0]
                    .concat(
                        ' usage (' +
                            (metricProps[0].unit === Metric.unit.PERCENTAGE ? '%' : metricProps[0].unit.valueOf()) +
                            ') - '
                    ),
                metricSubTitle: metricProps[0].vmName,
            });
            const option: echarts.EChartsCoreOption = {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt: number[]) {
                        return [pt[0], '10%'];
                    },
                    axisPointer: {
                        type: 'line',
                        handle: {
                            show: true,
                        },
                    },
                    valueFormatter: function (params: number) {
                        return `${params} ${
                            metricProps[0].unit === Metric.unit.PERCENTAGE ? '%' : metricProps[0].unit.valueOf()
                        }`;
                    },
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    axisLabel: {
                        show: true,
                        fontSize: 10,
                        rotate: 40,
                        formatter: function (value: Date) {
                            const date = moment(value).format('YYYY-MM-DD');
                            const time = moment(value).format('HH:mm:ss');
                            return date + '\n' + time;
                        },
                    },
                    axisTick: {
                        show: true,
                    },
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '5%',
                    containLabel: true,
                },
                series: [
                    {
                        name: metricProps[0].name
                            .split('_')[0]
                            .concat(
                                ' usage (' +
                                    (metricProps[0].unit === Metric.unit.PERCENTAGE
                                        ? '%'
                                        : metricProps[0].unit.valueOf()) +
                                    ') - '
                            ),
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        areaStyle: { marginBottom: '0px' },
                        data: getOptionData(metricProps, newCurrentTime, timePeriod),
                    },
                ],
            };
            currentOptions.push(option);
        });
        setOptions(currentOptions);
        setChartsTitle(currentChartsTitle);
        getOptionLength(currentOptions.length);
    };

    return (
        <>
            {onlyLastKnownMetricQuery.isLoading ? (
                <div className={'monitor-search-loading-class'}>
                    <Spin size='large' spinning={onlyLastKnownMetricQuery.isLoading} />
                </div>
            ) : (
                <>
                    <MonitorMetricsType getActiveMonitorMetricType={getActiveMonitorMetricType} />
                    <MetricOptionDataByChartsPerRow
                        chartsPerRow={chartsPerRow}
                        options={options}
                        chartsTitle={chartsTitle}
                    />
                </>
            )}
        </>
    );
};
