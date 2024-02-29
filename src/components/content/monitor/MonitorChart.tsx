/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Spin } from 'antd';
import {
    convertMetricsToMetricProps,
    getOptionData,
    getTotalSecondsOfTimePeriod,
    groupMetricsByResourceIds,
    isMetricEmpty,
    lastMinuteRadioButtonKeyId,
    MetricProps,
} from './metricProps';
import React, { useRef, useState } from 'react';
import { MonitorMetricsTypeTabs } from './MonitorMetricsTypeTabs';
import { ApiError, Metric, Response } from '../../../xpanse-api/generated';
import { monitorMetricQueueSize } from '../../utils/constants';
import { BuildMetricGraphs } from './BuildMetricGraphs';
import { EChartsCoreOption } from 'echarts';
import {
    useGetLastKnownMetricForASpecificTypeQuery,
    useGetMetricsForSpecificTimePeriodAndSpecificType,
} from './MetricQueries';
import { MonitorTip } from './MonitorTip';

export const MonitorChart = ({
    serviceId,
    timePeriod,
    isAutoRefresh,
    chartsPerRow,
    setNumberOfChartsAvailable,
}: {
    serviceId: string;
    timePeriod: number;
    isAutoRefresh: boolean;
    chartsPerRow: string;
    setNumberOfChartsAvailable: (chartCount: number) => void;
}): React.JSX.Element => {
    let tipType: 'error' | 'success' | undefined = undefined;
    let tipMessage: string = '';
    let tipDescription: string = '';
    const [activeMonitorMetricType, setActiveMonitorMetricType] = useState<Metric.monitorResourceType>(
        Metric.monitorResourceType.CPU
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
    const onlyLastKnownMetricsQueue = useRef<Metric[]>([]);
    const metricsForSpecificTimePeriodQueue = useRef<Metric[]>([]);

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
                            (metricProps[0].unit === Metric.unit.PERCENTAGE ? '%' : metricProps[0].unit.valueOf()) +
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
        options = currentOptions;
        chartsTitle = currentChartsTitle;
        setNumberOfChartsAvailable(currentOptions.length);
    };

    const setErrorAlertData = (error: Error) => {
        tipType = 'error';
        if (error instanceof ApiError && 'details' in error.body) {
            const response: Response = error.body as Response;
            tipMessage = response.resultType.valueOf();
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
            if (onlyLastKnownMetricsQueue.current.length > 0) {
                newQueue = [...onlyLastKnownMetricsQueue.current, ...data];
                if (newQueue.length > monitorMetricQueueSize) {
                    newQueue.shift();
                }
            } else {
                newQueue = data;
            }
            onlyLastKnownMetricsQueue.current = newQueue;
            convertMetricToEchartOptions(convertMetricsToMetricProps(onlyLastKnownMetricsQueue.current));
        } else {
            onlyLastKnownMetricsQueue.current = [];
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
            let newQueue: Metric[];
            if (isMetricEmpty(rsp)) {
                const currentItem: Metric | undefined = metricsForSpecificTimePeriodQueue.current[0];
                newQueue = [...metricsForSpecificTimePeriodQueue.current, currentItem];
            } else {
                newQueue = [...metricsForSpecificTimePeriodQueue.current, ...rsp];
            }

            if (newQueue.length > monitorMetricQueueSize) {
                newQueue.shift();
            }

            metricsForSpecificTimePeriodQueue.current = newQueue;
            convertMetricToEchartOptions(convertMetricsToMetricProps(metricsForSpecificTimePeriodQueue.current));
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
        onlyLastKnownMetricsQueue.current = [];
        setErrorAlertData(useGetLastKnownMetric.error);
    }

    const onRemove = () => {
        tipType = undefined;
        tipMessage = '';
        tipDescription = '';
        if (timePeriod === lastMinuteRadioButtonKeyId) {
            void useGetLastKnownMetric.refetch();
        } else {
            void useGetMetricForSpecificTimePeriod.refetch();
        }
    };

    return (
        <>
            <MonitorTip type={tipType} msg={tipMessage} description={tipDescription} onRemove={onRemove} />
            {useGetMetricForSpecificTimePeriod.isLoading || useGetLastKnownMetric.isLoading ? (
                <div className={'monitor-search-loading-class'}>
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
};
