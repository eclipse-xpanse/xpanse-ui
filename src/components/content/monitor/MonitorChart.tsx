/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Spin } from 'antd';
import { EChartsCoreOption } from 'echarts';
import React, { useState } from 'react';
import monitorStyles from '../../../styles/monitor.module.css';
import { Metric, MetricUnit, MonitorResourceType } from '../../../xpanse-api/generated';
import { monitorMetricQueueSize } from '../../utils/constants';
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
    groupMetricsByResourceIds,
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
    const [activeMonitorMetricType, setActiveMonitorMetricType] = useState<MonitorResourceType>(
        MonitorResourceType.CPU
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

    let chartsTitle: { Id: string; metricTitle: string; metricSubTitle: string }[] = [];
    let options: EChartsCoreOption[] = [];
    const convertMetricToEchartOptions = (metricProps: MetricProps[]) => {
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
                            (metricProps[0].unit === MetricUnit.PERCENTAGE ? '%' : metricProps[0].unit.valueOf()) +
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
                                    (metricProps[0].unit === MetricUnit.PERCENTAGE
                                        ? '%'
                                        : metricProps[0].unit.valueOf()) +
                                    ') - '
                            ),
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        areaStyle: { marginBottom: '0px' },
                        data: getOptionData(metricProps),
                    },
                ],
            };
            currentOptions.push(option);
        });
        options = currentOptions;
        chartsTitle = currentChartsTitle;
        setNumberOfChartsAvailable(currentOptions.length);
    };

    if (useGetLastKnownMetric.isSuccess) {
        const data: Metric[] | undefined = useGetLastKnownMetric.data;
        if (data.length > 0) {
            if (data.length > monitorMetricQueueSize) {
                data.shift();
            }
            convertMetricToEchartOptions(convertMetricsToMetricProps(data));
        }
    }

    if (useGetMetricForSpecificTimePeriod.isSuccess) {
        const rsp: Metric[] | undefined = useGetMetricForSpecificTimePeriod.data;
        if (rsp.length > 0) {
            if (rsp.length > monitorMetricQueueSize) {
                rsp.shift();
            }
            convertMetricToEchartOptions(convertMetricsToMetricProps(rsp));
        }
    }

    const hasError = useGetMetricForSpecificTimePeriod.isError || useGetLastKnownMetric.isError;
    const isEmpty =
        (useGetMetricForSpecificTimePeriod.isSuccess || useGetLastKnownMetric.isSuccess) && options.length == 0;

    const onRemove = () => {
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
            {hasError || isEmpty ? (
                <MonitorTip
                    error={useGetLastKnownMetric.error ?? useGetMetricForSpecificTimePeriod.error}
                    isNoMetricsAvailable={isEmpty}
                    onRemove={onRemove}
                    retryRequest={retryRequest}
                />
            ) : null}
            <MonitorMetricsTypeTabs
                activeMonitorMetricType={activeMonitorMetricType}
                setActiveMonitorMetricType={setActiveMonitorMetricType}
            />
            {useGetMetricForSpecificTimePeriod.isLoading || useGetLastKnownMetric.isLoading ? (
                <div className={monitorStyles.monitorSearchLoadingClass}>
                    <Spin
                        size='large'
                        spinning={useGetMetricForSpecificTimePeriod.isLoading || useGetLastKnownMetric.isLoading}
                    />
                </div>
            ) : (
                <BuildMetricGraphs chartsPerRow={chartsPerRow} graphData={options} chartsTitle={chartsTitle} />
            )}
        </>
    );
}
