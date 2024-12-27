/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Spin } from 'antd';
import { EChartsCoreOption } from 'echarts';
import React, { useRef, useState } from 'react';
import monitorStyles from '../../../styles/monitor.module.css';
import { ErrorResponse, Metric, monitorResourceType, unit } from '../../../xpanse-api/generated';
import { monitorMetricQueueSize } from '../../utils/constants';
import { isHandleKnownErrorResponse } from '../common/error/isHandleKnownErrorResponse.ts';
import { BuildMetricGraphs } from './BuildMetricGraphs';
import {
    useGetLastKnownMetricForASpecificTypeQuery,
    useGetMetricsForSpecificTimePeriodAndSpecificType,
} from './MetricQueries';
import { MonitorMetricsTypeTabs } from './MonitorMetricsTypeTabs';
import { MonitorTip } from './MonitorTip';
import {
    convertMetricsToMetricProps,
    getOptionData,
    getTotalSecondsOfTimePeriod,
    groupMetricsByResourceIds,
    isMetricEmpty,
    lastMinuteRadioButtonKeyId,
    MetricProps,
} from './metricProps';

export default function MonitorChart({
    serviceId,
    timePeriod,
    isAutoRefresh,
    chartsPerRow,
    setNumberOfChartsAvailable,
    onReset,
}: {
    serviceId: string;
    timePeriod: number;
    isAutoRefresh: boolean;
    chartsPerRow: string;
    setNumberOfChartsAvailable: (chartCount: number) => void;
    onReset: () => void;
}): React.JSX.Element {
    let tipType: 'error' | 'success' | undefined = undefined;
    let tipMessage: string = '';
    let tipDescription: string = '';
    const [activeMonitorMetricType, setActiveMonitorMetricType] = useState<monitorResourceType>(
        monitorResourceType.CPU
    );
    const useGetLastKnownMetric = useGetLastKnownMetricForASpecificTypeQuery(
        serviceId,
        isAutoRefresh,
        timePeriod === lastMinuteRadioButtonKeyId,
        activeMonitorMetricType
    );

    const useGetMetricForSpecificTimePeriod = useGetMetricsForSpecificTimePeriodAndSpecificType(
        serviceId,
        timePeriod,
        timePeriod !== lastMinuteRadioButtonKeyId,
        activeMonitorMetricType,
        isAutoRefresh
    );

    // useRef necessary to store existing data between re-renders
    const onlyLastKnownMetricsQueue = useRef<Map<monitorResourceType, Metric[]>>(
        new Map<monitorResourceType.CPU, []>()
    );
    const metricsForSpecificTimePeriodQueue = useRef<Map<monitorResourceType, Metric[]>>(
        new Map<monitorResourceType.CPU, []>()
    );

    let chartsTitle: { Id: string; metricTitle: string; metricSubTitle: string }[] = [];
    let options: EChartsCoreOption[] = [];
    const convertMetricToEchartOptions = (metricProps: MetricProps[]) => {
        const newCurrentTime = new Date();
        if (timePeriod === lastMinuteRadioButtonKeyId) {
            const totalSeconds: number = getTotalSecondsOfTimePeriod(timePeriod);
            newCurrentTime.setSeconds(newCurrentTime.getSeconds() - totalSeconds);
        }

        const currentMetricProps: Map<string, MetricProps[]> = groupMetricsByResourceIds(metricProps);
        const currentChartsTitle: { Id: string; metricTitle: string; metricSubTitle: string }[] = [];
        const currentOptions: EChartsCoreOption[] = [];
        currentMetricProps.forEach((metricProps, vmId) => {
            currentChartsTitle.push({
                Id: vmId,
                metricTitle: metricProps[0].name
                    .split('_')[0]
                    .concat(
                        ' usage (' +
                            (metricProps[0].unit === unit.PERCENTAGE ? '%' : metricProps[0].unit.valueOf()) +
                            ') - '
                    ),
                metricSubTitle: metricProps[0].vmName,
            });
            const option: EChartsCoreOption = {
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
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    axisLabel: {
                        show: true,
                        fontSize: 10,
                        rotate: 40,
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
                                    (metricProps[0].unit === unit.PERCENTAGE ? '%' : metricProps[0].unit.valueOf()) +
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
        options = currentOptions;
        chartsTitle = currentChartsTitle;
        setNumberOfChartsAvailable(currentOptions.length);
    };

    const setErrorAlertData = (error: Error) => {
        tipType = 'error';
        if (isHandleKnownErrorResponse(error)) {
            const response: ErrorResponse = error.body;
            tipMessage = response.errorType.valueOf();
            tipDescription = response.details.join();
        } else {
            tipMessage = 'Error while fetching metrics data.';
            tipDescription = error.message;
        }
    };

    if (useGetLastKnownMetric.isLoading || useGetMetricForSpecificTimePeriod.isLoading) {
        tipType = undefined;
        tipMessage = '';
        tipDescription = '';
    }
    if (useGetLastKnownMetric.isSuccess) {
        const data: Metric[] | undefined = useGetLastKnownMetric.data;
        if (data.length > 0) {
            tipType = undefined;
            tipMessage = '';
            tipDescription = '';
            let newQueue: Metric[];
            const currentData = onlyLastKnownMetricsQueue.current.get(activeMonitorMetricType);
            if (currentData) {
                newQueue = [...currentData, ...data];
                if (newQueue.length > monitorMetricQueueSize) {
                    newQueue.shift();
                }
            } else {
                newQueue = data;
            }
            onlyLastKnownMetricsQueue.current.set(activeMonitorMetricType, newQueue);
            convertMetricToEchartOptions(convertMetricsToMetricProps(newQueue));
        } else {
            onlyLastKnownMetricsQueue.current.set(activeMonitorMetricType, []);
            tipType = undefined;
            tipMessage = 'No metrics found for the selected service.';
            tipDescription = '';
        }
    }

    if (useGetMetricForSpecificTimePeriod.isSuccess) {
        const rsp: Metric[] | undefined = useGetMetricForSpecificTimePeriod.data;
        if (rsp.length > 0) {
            tipType = undefined;
            tipMessage = '';
            tipDescription = '';
            let newQueue: Metric[] = [];
            const currentItem: Metric[] | null | undefined =
                metricsForSpecificTimePeriodQueue.current.get(activeMonitorMetricType);
            if (isMetricEmpty(rsp)) {
                if (currentItem) {
                    newQueue = [...currentItem, currentItem[0]];
                }
            } else {
                if (currentItem) {
                    newQueue = [...currentItem, ...rsp];
                } else {
                    newQueue = [...rsp];
                }
            }

            if (newQueue.length > monitorMetricQueueSize) {
                newQueue.shift();
            }

            metricsForSpecificTimePeriodQueue.current.set(activeMonitorMetricType, newQueue);
            convertMetricToEchartOptions(convertMetricsToMetricProps(newQueue));
        } else {
            tipType = undefined;
            tipMessage = 'No metrics found for the selected service.';
            tipDescription = '';
        }
    }

    if (useGetMetricForSpecificTimePeriod.isError) {
        setErrorAlertData(useGetMetricForSpecificTimePeriod.error);
    }

    if (useGetLastKnownMetric.isError) {
        onlyLastKnownMetricsQueue.current.set(activeMonitorMetricType, []);
        setErrorAlertData(useGetLastKnownMetric.error);
    }

    const onRemove = () => {
        tipType = undefined;
        tipMessage = '';
        tipDescription = '';
        onReset();
    };

    const retryRequest = () => {
        if (timePeriod === lastMinuteRadioButtonKeyId) {
            void useGetLastKnownMetric.refetch();
        } else {
            void useGetMetricForSpecificTimePeriod.refetch();
        }
    };

    return (
        <>
            <MonitorTip
                type={tipType}
                msg={tipMessage}
                description={tipDescription}
                onRemove={onRemove}
                retryRequest={retryRequest}
            />
            {useGetMetricForSpecificTimePeriod.isLoading || useGetLastKnownMetric.isLoading ? (
                <div className={monitorStyles.monitorSearchLoadingClass}>
                    <Spin
                        size='large'
                        spinning={useGetMetricForSpecificTimePeriod.isLoading || useGetLastKnownMetric.isLoading}
                    />
                </div>
            ) : (
                <>
                    <MonitorMetricsTypeTabs
                        activeMonitorMetricType={activeMonitorMetricType}
                        setActiveMonitorMetricType={setActiveMonitorMetricType}
                    />
                    <BuildMetricGraphs chartsPerRow={chartsPerRow} graphData={options} chartsTitle={chartsTitle} />
                </>
            )}
        </>
    );
}
