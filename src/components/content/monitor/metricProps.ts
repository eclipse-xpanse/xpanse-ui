/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Metric } from '../../../xpanse-api/generated';

export interface MetricProps {
    id: string;

    name: string;

    value: number;

    vmName: string;

    unit: Metric.unit;
    timeStamp: number;
}

export interface MetricRequestParams {
    from: number;

    to: number;
}

export interface MetricQueueParams {
    timePeriod: number;
    monitorMetricType: string;
    metricList: Metric[];
}

export const chartsPerRowCountList: string[] = ['2', '3', '4', '6', '8', '12'];
export const chartsPerRowWithTwo: string = '2';
export const lastMinuteRadioButtonKeyId: number = 1;
export const lastHourRadioButtonKeyId: number = 2;
export const threeHoursRadioButtonKeyId: number = 3;
export const twelveHoursRadioButtonKeyId: number = 4;
export const twentyFourHoursRadioButtonKeyId: number = 5;
export const sevenDaysRadioButtonKeyId: number = 6;
export const thirtyDaysRadioButtonKeyId: number = 7;

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
export const getCurrentMetricProps = (metricProps: MetricProps[]): Map<string, MetricProps[]> => {
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

export const getOptionData = (metricProps: MetricProps[], currentTime: Date | undefined, timePeriod: number) => {
    const dataNew: [number, number][] = [];
    if (timePeriod === lastMinuteRadioButtonKeyId) {
        if (currentTime === undefined) {
            currentTime = new Date();
        }
        const totalSeconds: number = getTotalSecondsOfTimePeriod(timePeriod);

        const newCurrentTime = currentTime;

        for (let i = 0; i < totalSeconds / 5; i++) {
            dataNew.push([+newCurrentTime, 0]);
            newCurrentTime.setSeconds(newCurrentTime.getSeconds() + 5);
        }

        metricProps.forEach((metricProp) => {
            const index = metricProps.indexOf(metricProp);
            if (index !== -1 && dataNew[index] && index < metricProps.length) {
                dataNew[index][1] = metricProp.value;
            }
        });

        newCurrentTime.setSeconds(+newCurrentTime.getSeconds() - totalSeconds);
        return dataNew;
    } else {
        metricProps.sort((a, b) => a.timeStamp - b.timeStamp);

        metricProps.forEach((metricProp: MetricProps) => {
            dataNew.push([metricProp.timeStamp, metricProp.value]);
        });

        return dataNew;
    }
};

export const MonitorTypeList: string[] = [
    Metric.monitorResourceType.CPU.valueOf(),
    Metric.monitorResourceType.MEM.valueOf(),
    Metric.monitorResourceType.VM_NETWORK_INCOMING.valueOf(),
    Metric.monitorResourceType.VM_NETWORK_OUTGOING.valueOf(),
];

export const getMetricRequestParams = (currentTime: Date | undefined, totalSeconds: number): MetricRequestParams => {
    const newCurrentTime = currentTime === undefined ? new Date() : currentTime;
    const to = newCurrentTime.getTime();
    newCurrentTime.setSeconds(newCurrentTime.getSeconds() - totalSeconds);
    const from = newCurrentTime.getTime();
    return {
        from: from,
        to: to,
    };
};

export const lastNonEmptyMetricsByTimePeriodAndActiveMonitorMetricType = (
    timePeriod: number,
    activeMonitorMetricType: Metric.monitorResourceType,
    prevQueue: MetricQueueParams[]
): MetricQueueParams | undefined => {
    let lastMetricList: MetricQueueParams;
    if (prevQueue.length === 0) {
        return undefined;
    }
    for (let i = prevQueue.length - 1; i >= 0; i--) {
        const item = prevQueue[i];
        if (
            item.metricList.length > 0 &&
            item.timePeriod === timePeriod &&
            item.monitorMetricType === activeMonitorMetricType.valueOf()
        ) {
            lastMetricList = item;
            return lastMetricList;
        }
    }
    return undefined;
};

export const metricsIsEmpty = (metricList: Metric[]): boolean => {
    return metricList.some((metric: Metric) => metric.metrics?.length === 0);
};

export const getNewMetricQueueItem = (
    timePeriod: number,
    activeMonitorMetricType: Metric.monitorResourceType,
    metrics: Metric[]
): MetricQueueParams => {
    return {
        timePeriod: timePeriod,
        monitorMetricType: activeMonitorMetricType,
        metricList: metrics,
    };
};

export const getCurrentMetrics = (metrics: Metric[]): Map<string, Metric[]> => {
    const currentMetrics: Map<string, Metric[]> = new Map<string, Metric[]>();
    for (const metric of metrics) {
        if (metric.monitorResourceType.valueOf() && !currentMetrics.has(metric.monitorResourceType.valueOf())) {
            currentMetrics.set(
                metric.monitorResourceType.valueOf(),
                metrics.filter(
                    (data: Metric) => data.monitorResourceType.valueOf() === metric.monitorResourceType.valueOf()
                )
            );
        }
    }
    return currentMetrics;
};

export const getMetricProps = (metrics: Metric[]): MetricProps[] => {
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
