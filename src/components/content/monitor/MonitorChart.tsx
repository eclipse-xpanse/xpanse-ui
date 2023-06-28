/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent, Select, Switch } from 'antd';
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
        tippDescription: string,
        isQueryResultAvailable: boolean
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
    const refreshOnlyLastKnownMonitorMetrics = useRef<number | null>(null);
    const refreshMonitorMetrics = useRef<number | null>(null);
    const [onlyLastKnownMonitorMetricsQueue, setOnlyLastKnownMonitorMetricsQueue] = useState<Metric[][] | undefined>(
        undefined
    );
    const [monitorMetricsQueue, setMonitorMetricsQueue] = useState<MetricQueueParams[]>([]);

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
        stopFetchMonitorMetricDataTimer();
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

    useEffect(() => {
        stopFetchOnlyLastKnownMonitorMetricDataTimer();
        stopFetchMonitorMetricDataTimer();
        if (serviceId.length === 0) {
            return;
        }
        if (isAutoRefresh) {
            if (timePeriod === lastMinuteRadioButtonKeyId) {
                stopFetchMonitorMetricDataTimer();
                getOnlyLastKnownMetricResponse(serviceId, true);
                startFetchOnlyLastKnownMonitorMetricDataTimer();
            } else {
                stopFetchOnlyLastKnownMonitorMetricDataTimer();
                getMetricResponse(serviceId, activeMonitorMetricType as Metric.monitorResourceType, false);
                startFetchMonitorMetricDataTimer();
            }
        } else {
            stopFetchOnlyLastKnownMonitorMetricDataTimer();
            stopFetchMonitorMetricDataTimer();
        }
        return () => {
            stopFetchOnlyLastKnownMonitorMetricDataTimer();
            stopFetchMonitorMetricDataTimer();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceId, timePeriod, isAutoRefresh, activeMonitorMetricType]);

    const startFetchOnlyLastKnownMonitorMetricDataTimer = () => {
        try {
            refreshOnlyLastKnownMonitorMetrics.current = window.setInterval(() => {
                getOnlyLastKnownMetricResponse(serviceId, true);
            }, fetchOnlyLastKnownMonitorMetricDataTimeInterval);
        } catch (error) {
            setIsAutoRefresh(false);
            setOnlyLastKnownMonitorMetricsQueue([]);
            stopFetchOnlyLastKnownMonitorMetricDataTimer();
            getTipInfo('', false, 'error', 'An exception occurred in the request metric timer.', '', true);
        }
    };

    const startFetchMonitorMetricDataTimer = () => {
        try {
            refreshMonitorMetrics.current = window.setInterval(() => {
                getMetricResponse(serviceId, activeMonitorMetricType as Metric.monitorResourceType, false);
            }, fetchMonitorMetricDataTimeInterval);
        } catch (error) {
            setIsAutoRefresh(false);
            setMonitorMetricsQueue([]);
            stopFetchMonitorMetricDataTimer();
            getTipInfo('', false, 'error', 'An exception occurred in the request metric timer.', '', true);
        }
    };

    const stopFetchOnlyLastKnownMonitorMetricDataTimer = () => {
        if (refreshOnlyLastKnownMonitorMetrics.current) {
            clearInterval(refreshOnlyLastKnownMonitorMetrics.current);
            refreshOnlyLastKnownMonitorMetrics.current = null;
        }
    };

    const stopFetchMonitorMetricDataTimer = () => {
        if (refreshMonitorMetrics.current) {
            clearInterval(refreshMonitorMetrics.current);
            refreshMonitorMetrics.current = null;
        }
    };

    const getOnlyLastKnownMetricResponse = (selectedServiceId: string, onlyLastKnownMetric: boolean) => {
        void MonitorService.getMetricsByServiceId(
            selectedServiceId,
            undefined,
            undefined,
            undefined,
            undefined,
            onlyLastKnownMetric
        )
            .then((rsp: Metric[]) => {
                if (rsp.length > 0) {
                    getTipInfo(serviceId, false, undefined, '', '', true);
                    setOnlyLastKnownMonitorMetricsQueue((prevQueue: Metric[][] | undefined) => {
                        let newQueue: Metric[][];

                        if (prevQueue) {
                            newQueue = [...prevQueue, rsp];
                            if (newQueue.length > monitorMetricQueueSize) {
                                newQueue.shift();
                            }
                        } else {
                            newQueue = [rsp];
                        }

                        return newQueue;
                    });
                } else {
                    setIsAutoRefresh(false);
                    setOnlyLastKnownMonitorMetricsQueue([]);
                    stopFetchOnlyLastKnownMonitorMetricDataTimer();
                    getTipInfo('', false, 'success', 'No metrics found for the selected service.', '', true);
                }
            })
            .catch((error: Error) => {
                setIsAutoRefresh(false);
                setOnlyLastKnownMonitorMetricsQueue([]);
                stopFetchOnlyLastKnownMonitorMetricDataTimer();
                setTips(error);
            });
    };

    const getMetricResponse = (
        selectedServiceId: string,
        activeMonitorMetricType: Metric.monitorResourceType,
        onlyLastKnownMetric: boolean
    ) => {
        const metricRequestParams: MetricRequestParams = getMetricRequestParams(
            currentTime,
            getTotalSecondsOfTimePeriod(timePeriod)
        );
        void MonitorService.getMetricsByServiceId(
            selectedServiceId,
            activeMonitorMetricType,
            metricRequestParams.from,
            metricRequestParams.to,
            undefined,
            onlyLastKnownMetric
        )
            .then((rsp: Metric[]) => {
                if (rsp.length > 0) {
                    getTipInfo(serviceId, false, undefined, '', '', true);
                    setMonitorMetricsQueue((prevQueue: MetricQueueParams[]) => {
                        let newQueue: MetricQueueParams[];
                        if (metricsIsEmpty(rsp)) {
                            const currentItem: MetricQueueParams | undefined =
                                lastNonEmptyMetricsByTimePeriodAndActiveMonitorMetricType(
                                    timePeriod,
                                    activeMonitorMetricType,
                                    prevQueue
                                );
                            if (currentItem === undefined) {
                                newQueue = [
                                    ...prevQueue,
                                    getNewMetricQueueItem(timePeriod, activeMonitorMetricType, rsp),
                                ];
                            } else {
                                newQueue = [...prevQueue, currentItem];
                            }
                        } else {
                            newQueue = [...prevQueue, getNewMetricQueueItem(timePeriod, activeMonitorMetricType, rsp)];
                        }

                        if (newQueue.length > monitorMetricQueueSize) {
                            newQueue.shift();
                        }

                        return newQueue;
                    });
                } else {
                    setIsAutoRefresh(false);
                    setMonitorMetricsQueue([]);
                    stopFetchMonitorMetricDataTimer();
                    getTipInfo('', false, 'success', 'No metrics found for the selected service.', '', true);
                }
            })
            .catch((error: Error) => {
                setIsAutoRefresh(false);
                setMonitorMetricsQueue([]);
                stopFetchMonitorMetricDataTimer();
                setTips(error);
            });
    };

    const setTips = (error: Error) => {
        if (error instanceof ApiError && 'details' in error.body) {
            const response: Response = error.body as Response;
            tipMessageInfo.current = response.resultType.valueOf();
            tipDescriptionInfo.current = response.details;
        } else {
            tipMessageInfo.current = 'Error while fetching metrics data.';
            tipDescriptionInfo.current = [error.message];
        }
        getTipInfo('', false, 'error', tipMessageInfo.current, tipDescriptionInfo.current.join(), true);
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
    }, [onlyLastKnownMonitorMetricsQueue]);

    useEffect(() => {
        if (monitorMetricsQueue.length === 0) {
            return;
        }
        setCurrentTime(new Date());
        const metrics: Metric[] = [];
        monitorMetricsQueue[monitorMetricsQueue.length - 1].metricList.forEach((metric: Metric) => {
            metrics.push(metric);
        });

        showMonitorMetrics(metrics);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorMetricsQueue]);

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

            <MetricOptionDataByChartsPerRow chartsPerRow={chartsPerRow} options={options} chartsTitle={chartsTitle} />
        </>
    );
};
