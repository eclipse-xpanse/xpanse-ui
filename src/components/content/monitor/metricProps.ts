/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Metric, MetricUnit, MonitorResourceType } from '../../../xpanse-api/generated';

export interface MetricProps {
    id: string;

    name: string;

    value: number;

    vmName: string;

    unit: MetricUnit;

    timeStamp: number;
}

interface MetricRequestParams {
    from: number;

    to: number;
}

export const chartsPerRowCountList: string[] = ['2', '3', '4', '6', '8', '12'];
export const chartsPerRowWithTwo: string = '2';
export const lastMinuteRadioButtonKeyId: number = 1;
const lastHourRadioButtonKeyId: number = 2;
const threeHoursRadioButtonKeyId: number = 3;
const twelveHoursRadioButtonKeyId: number = 4;
const twentyFourHoursRadioButtonKeyId: number = 5;
const sevenDaysRadioButtonKeyId: number = 6;
const thirtyDaysRadioButtonKeyId: number = 7;

export const timePeriodList: string[] = [
    'Last minute',
    'Last hour',
    '3 hours',
    '12 hours',
    '24 hours',
    '7 days',
    '30 days',
];

export const getTotalSecondsOfTimePeriod = (timePeriod: number): number => {
    if (timePeriod === lastMinuteRadioButtonKeyId) {
        return 60;
    } else if (timePeriod === lastHourRadioButtonKeyId) {
        return 60 * 60;
    } else if (timePeriod === threeHoursRadioButtonKeyId) {
        return 3 * 60 * 60;
    } else if (timePeriod === twelveHoursRadioButtonKeyId) {
        return 12 * 60 * 60;
    } else if (timePeriod === twentyFourHoursRadioButtonKeyId) {
        return 24 * 60 * 60;
    } else if (timePeriod === sevenDaysRadioButtonKeyId) {
        return 7 * 24 * 60 * 60;
    } else if (timePeriod === thirtyDaysRadioButtonKeyId) {
        return 30 * 24 * 60 * 60;
    } else {
        return 0;
    }
};
export const groupMetricsByResourceIds = (metricProps: MetricProps[]): Map<string, MetricProps[]> => {
    const currentMetricProps: Map<string, MetricProps[]> = new Map<string, MetricProps[]>();
    for (const metricProp of metricProps) {
        if (metricProp.id) {
            if (!currentMetricProps.has(metricProp.id)) {
                currentMetricProps.set(
                    metricProp.id,
                    metricProps.filter((data: MetricProps) => data.id === metricProp.id)
                );
            }
        }
    }
    return currentMetricProps;
};

export const getOptionData = (metricProps: MetricProps[]) => {
    const dataNew: [string, number][] = [];
    const existingTimestamps: number[] = [];
    metricProps.forEach((metricProp: MetricProps) => {
        // remove duplicates in the received data based on timestamp.
        if (!existingTimestamps.includes(metricProp.timeStamp)) {
            existingTimestamps.push(metricProp.timeStamp);
            dataNew.push([new Date(metricProp.timeStamp).toISOString(), metricProp.value]);
        }
    });
    // sort data based on timestamp - ascending order.
    dataNew.sort((a, b) => new Date(a[0]).valueOf() - new Date(b[0]).valueOf());
    // copy the most recent data also to the current time to show updated graphs. This is needed since not all cloud providers will return data for every second.
    dataNew.push([new Date().toISOString(), dataNew[dataNew.length - 1][1]]);
    return dataNew;
};

export const MonitorTypeList: string[] = [
    MonitorResourceType.CPU.valueOf(),
    MonitorResourceType.MEM.valueOf(),
    MonitorResourceType.VM_NETWORK_INCOMING.valueOf(),
    MonitorResourceType.VM_NETWORK_OUTGOING.valueOf(),
];

export const getMetricRequestParams = (totalSeconds: number): MetricRequestParams => {
    const newCurrentTime = new Date();
    const to = newCurrentTime.getTime();
    newCurrentTime.setSeconds(newCurrentTime.getSeconds() - totalSeconds);
    const from = newCurrentTime.getTime();
    return {
        from: from,
        to: to,
    };
};

export const convertMetricsToMetricProps = (metrics: Metric[]): MetricProps[] => {
    const metricProps: MetricProps[] = [];
    metrics.forEach((metric: Metric) => {
        const labelsMap = new Map<string, string>();
        if (metric.labels) {
            for (const key in metric.labels) {
                labelsMap.set(key, metric.labels[key]);
            }
        }
        if (metric.metrics) {
            metric.metrics.forEach((item) => {
                const metricProp: MetricProps = {
                    id: labelsMap.get('id') ?? '',
                    name: metric.name,
                    vmName: labelsMap.get('name') ?? '',
                    value: item.value,
                    unit: metric.unit,
                    timeStamp: item.timeStamp,
                };
                metricProps.push(metricProp);
            });
        } else {
            const metricProp: MetricProps = {
                id: labelsMap.get('id') ?? '',
                name: metric.name,
                vmName: labelsMap.get('name') ?? '',
                value: 0,
                unit: metric.unit,
                timeStamp: new Date().getTime(),
            };
            metricProps.push(metricProp);
        }
    });
    return metricProps;
};
