/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent, Select, Spin, Switch } from 'antd';
import {
    chartsPerRowCountList,
    chartsPerRowWithTwo,
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
    MetricRequestParams,
    metricsIsEmpty,
    timePeriodList,
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
    getTipInfo,
}: {
    serviceId: string;
    getTipInfo: (
        serviceId: string,
        isLoading: boolean,
        tipType: 'error' | 'success' | undefined,
        tipMessage: string,
        tipDescription: string,
        isQueryResultDisabled: boolean
    ) => void;
}): JSX.Element => {
    const [currentTime, setCurrentTime] = useState<Date | undefined>(undefined);
    const [timePeriod, setTimePeriod] = useState<number>(lastMinuteRadioButtonKeyId.valueOf());
    const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
    const [chartsPerRow, setChartsPerRow] = useState<string>(chartsPerRowWithTwo);
    const [chartsPerRowOptions, setChartsPerRowOptions] = useState<{ value: string; label: string }[]>([]);

    const [activeMonitorMetricType, setActiveMonitorMetricType] = useState<string>(
        Metric.monitorResourceType.CPU.valueOf()
    );

    const [startTime, setStartTime] = useState<number | undefined>(undefined);
    const [endTime, setEndTime] = useState<number | undefined>(undefined);

    const [onlyLastKnownMonitorMetricsQueue, setOnlyLastKnownMonitorMetricsQueue] = useState<Metric[][] | undefined>(
        undefined
    );
    const [monitorMetricsQueue, setMonitorMetricsQueue] = useState<MetricQueueParams[]>([]);

    const [isRefreshOnlyLastKnownMetric, setIsRefreshOnlyLastKnownMetric] = useState<boolean>(false);
    const [isRefreshMetric, setIsRefreshMetric] = useState<boolean>(false);

    const [chartsTitle, setChartsTitle] = useState<{ Id: string; metricTitle: string; metricSubTitle: string }[]>([]);
    const [options, setOptions] = useState<echarts.EChartsCoreOption[]>([]);

    const tipMessageInfo = useRef<string>('');
    const tipDescriptionInfo = useRef<string[]>([]);

    useEffect(() => {
        const chartsPerRowOptions: { value: string; label: string }[] = [];
        chartsPerRowCountList.forEach((item: string) => {
            const chartPerRowOption: { value: string; label: string } = {
                value: item,
                label: item,
            };
            chartsPerRowOptions.push(chartPerRowOption);
        });
        setChartsPerRowOptions(chartsPerRowOptions);
    }, []);

    const onChangeTimePeriod = (e: RadioChangeEvent) => {
        const selectedTimePeriod = Number(e.target.value);
        setTimePeriod(selectedTimePeriod);
    };

    const onChangeAutoRefresh = (checked: boolean) => {
        setIsAutoRefresh(checked);
    };

    const handleChangeChartsPerRow = (value: string) => {
        if (options.length > 0) {
            setChartsPerRow(value);
        }
    };

    const getActiveMonitorMetricType = (activeMonitorMetricType: string) => {
        setActiveMonitorMetricType(activeMonitorMetricType);
    };

    const onlyLastKnownMetricQueryKey = ['onlyLastKnownMetric', serviceId];
    const onlyLastKnownMetricQueryFn = () =>
        MonitorService.getMetricsByServiceId(serviceId, undefined, undefined, undefined, undefined, true);

    const onlyLastKnownMetricQuery = useQuery(onlyLastKnownMetricQueryKey, onlyLastKnownMetricQueryFn, {
        refetchInterval: () => (isRefreshOnlyLastKnownMetric ? fetchOnlyLastKnownMonitorMetricDataTimeInterval : false),
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        enabled: isRefreshOnlyLastKnownMetric,
    });

    useEffect(() => {
        if (currentTime !== undefined && timePeriod !== lastMinuteRadioButtonKeyId) {
            const metricRequestParams: MetricRequestParams = getMetricRequestParams(
                currentTime,
                getTotalSecondsOfTimePeriod(timePeriod)
            );
            setStartTime(metricRequestParams.from);
            setEndTime(metricRequestParams.to);
        }
    }, [currentTime, timePeriod]);

    const monitorMetricQueryKey = ['metric', serviceId, activeMonitorMetricType, startTime, endTime];
    const monitorMetricQueryFn = () =>
        MonitorService.getMetricsByServiceId(
            serviceId,
            activeMonitorMetricType as Metric.monitorResourceType,
            startTime,
            endTime,
            undefined,
            false
        );

    const monitorMetricQuery = useQuery(monitorMetricQueryKey, monitorMetricQueryFn, {
        refetchInterval: () => (isRefreshMetric ? fetchMonitorMetricDataTimeInterval : false),
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        enabled: isRefreshMetric,
    });

    useEffect(() => {
        setIsRefreshOnlyLastKnownMetric(false);
        setIsRefreshMetric(false);
        if (serviceId.length === 0) {
            return;
        }
        if (isAutoRefresh) {
            if (timePeriod === lastMinuteRadioButtonKeyId) {
                if (activeMonitorMetricType) {
                    setIsRefreshMetric(false);
                    setIsRefreshOnlyLastKnownMetric(true);
                }
            } else {
                if (activeMonitorMetricType) {
                    setIsRefreshOnlyLastKnownMetric(false);
                    setIsRefreshMetric(true);
                }
            }
        } else {
            setIsRefreshOnlyLastKnownMetric(false);
            setIsRefreshMetric(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceId, timePeriod, isAutoRefresh, activeMonitorMetricType]);

    useEffect(() => {
        if (onlyLastKnownMetricQuery.isLoading) {
            getTipInfo(serviceId, false, undefined, '', '', true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyLastKnownMetricQuery.isLoading, serviceId]);

    useEffect(() => {
        if (onlyLastKnownMetricQuery.isSuccess) {
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
                setIsAutoRefresh(false);
                setOnlyLastKnownMonitorMetricsQueue([]);
                getTipInfo('', false, 'success', 'No metrics found for the selected service.', '', false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyLastKnownMetricQuery.isSuccess, onlyLastKnownMetricQuery.data, serviceId]);

    useEffect(() => {
        if (onlyLastKnownMetricQuery.isError) {
            setIsAutoRefresh(false);
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
                setIsAutoRefresh(false);
                setMonitorMetricsQueue([]);
                getTipInfo('', false, 'success', 'No metrics found for the selected service.', '', false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorMetricQuery.isSuccess, monitorMetricQuery.data, serviceId]);

    useEffect(() => {
        if (monitorMetricQuery.isError) {
            setIsAutoRefresh(false);
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
        setCurrentTime(new Date());
        const metrics: Metric[] = [];
        onlyLastKnownMonitorMetricsQueue.forEach((item: Metric[]) => {
            item.forEach((metric: Metric) => {
                metrics.push(metric);
            });
        });
        showMonitorMetrics(metrics);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyLastKnownMonitorMetricsQueue, timePeriod]);

    useEffect(() => {
        if (monitorMetricsQueue.length === 0) {
            return;
        }
        const metrics: Metric[] = [];
        monitorMetricsQueue[monitorMetricsQueue.length - 1].metricList.forEach((metric: Metric) => {
            metrics.push(metric);
        });

        showMonitorMetrics(metrics);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorMetricsQueue, timePeriod]);

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
        let newCurrentTime = new Date();
        if (currentTime !== undefined) {
            newCurrentTime = currentTime;
        }
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
    };

    return (
        <>
            {onlyLastKnownMetricQuery.isLoading ? (
                <div className={'monitor-search-loading-class'}>
                    <Spin size='large' spinning={onlyLastKnownMetricQuery.isLoading} />
                </div>
            ) : (
                <>
                    <div className={'chart-operation-class'}>
                        <div>
                            <Radio.Group onChange={onChangeTimePeriod} value={timePeriod}>
                                {timePeriodList.map((item, index) => (
                                    <Radio key={index} value={index + 1}>
                                        {item}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </div>
                        <br />
                        <br />
                        <br />
                        <div>
                            Auto Refresh:&nbsp;
                            <Switch checked={isAutoRefresh} onChange={onChangeAutoRefresh} />
                            &nbsp;&nbsp;Charts per Row:&nbsp;
                            <Select
                                defaultValue={chartsPerRow}
                                style={{ width: 55 }}
                                onChange={handleChangeChartsPerRow}
                                options={chartsPerRowOptions}
                            />
                        </div>
                    </div>
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
