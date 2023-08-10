/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { chartsPerRowCountList, chartsPerRowWithTwo } from './metricProps';

export const MetricChartsPerRow = ({
    isLoading,
    optionLength,
    getMetricChartsPerRow,
}: {
    isLoading: boolean;
    optionLength: number;
    getMetricChartsPerRow: (currentMetricChartsPerRow: string) => void;
}): JSX.Element => {
    const [chartsPerRow, setChartsPerRow] = useState<string>(chartsPerRowWithTwo);
    const [chartsPerRowOptions, setChartsPerRowOptions] = useState<{ value: string; label: string }[]>([]);
    const handleChangeChartsPerRow = (value: string) => {
        if (optionLength > 1) {
            setChartsPerRow(value);
            getMetricChartsPerRow(value);
        }
    };

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
    return (
        <>
            &nbsp;&nbsp;Charts per Row:&nbsp;
            <Select
                defaultValue={chartsPerRow}
                style={{ width: 55 }}
                onChange={handleChangeChartsPerRow}
                options={chartsPerRowOptions}
                disabled={isLoading}
            />
        </>
    );
};
