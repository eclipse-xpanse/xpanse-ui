/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Select } from 'antd';
import React from 'react';
import { chartsPerRowCountList } from './metricProps';

export const MetricChartsPerRowDropDown = ({
    isLoading,
    optionLength,
    metricChartsPerRow,
    setMetricChartsPerRow,
}: {
    isLoading: boolean;
    optionLength: number;
    metricChartsPerRow: string;
    setMetricChartsPerRow: (currentMetricChartsPerRow: string) => void;
}): React.JSX.Element => {
    const handleChangeChartsPerRow = (value: string) => {
        if (optionLength > 1) {
            setMetricChartsPerRow(value);
        }
    };

    const getChartRowOptions = () => {
        const chartsPerRowOptions: { value: string; label: string }[] = [];
        chartsPerRowCountList.forEach((item: string) => {
            const chartPerRowOption: { value: string; label: string } = {
                value: item,
                label: item,
            };
            chartsPerRowOptions.push(chartPerRowOption);
        });
        return chartsPerRowOptions;
    };

    return (
        <>
            &nbsp;&nbsp;Charts per Row:&nbsp;
            <Select
                defaultValue={metricChartsPerRow}
                style={{ width: 55 }}
                onChange={handleChangeChartsPerRow}
                options={getChartRowOptions()}
                disabled={isLoading}
            />
        </>
    );
};
