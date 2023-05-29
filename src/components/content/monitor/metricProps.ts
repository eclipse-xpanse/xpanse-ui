/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export interface MetricProps {
    id: string;

    name: string;

    value: number;

    vmName: string;
}
export const colColumnList: number[] = [2, 3, 4, 6, 8, 12];

export const getLayOutOptions = () => {
    const layOutOptions: { value: string; label: string }[] = [];
    colColumnList.forEach((item) => {
        const layOutOption: { value: string; label: string } = {
            value: String(item),
            label: String(item),
        };
        layOutOptions.push(layOutOption);
    });
    return layOutOptions;
};

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
    if (timePeriod === 1) {
        return 60;
    } else if (timePeriod === 2) {
        return 60 * 60;
    } else if (timePeriod === 3) {
        return 3 * 60 * 60;
    } else if (timePeriod === 4) {
        return 12 * 60 * 60;
    } else if (timePeriod === 5) {
        return 24 * 60 * 60;
    } else if (timePeriod === 6) {
        return 7 * 24 * 60 * 60;
    } else if (timePeriod === 7) {
        return 30 * 24 * 60 * 60;
    } else {
        return 0;
    }
};
export const getCurrentMetricProps = (metricProps: MetricProps[], monitorType: string): Map<string, MetricProps[]> => {
    const currentMetricProps: Map<string, MetricProps[]> = new Map<string, MetricProps[]>();
    for (const metricProp of metricProps) {
        if (metricProp.id) {
            if (!currentMetricProps.has(metricProp.id)) {
                currentMetricProps.set(
                    metricProp.id,
                    metricProps.filter((data: MetricProps) => data.name === monitorType && data.id === metricProp.id)
                );
            }
        }
    }
    return currentMetricProps;
};

export const getOptionData = (metricProps: MetricProps[], currentTime: Date, totalSeconds: number) => {
    const dataNew: [number, number][] = [];
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

    newCurrentTime.setSeconds(+currentTime.getSeconds() - totalSeconds);
    return dataNew;
};
