/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import { timePeriodList } from './metricProps';
import React from 'react';

export const MetricTimePeriodRadioButton = ({
    isLoading,
    timePeriod,
    setTimePeriod,
}: {
    isLoading: boolean;
    timePeriod: number;
    setTimePeriod: (currentTimePeriod: number) => void;
}): React.JSX.Element => {
    const onChangeTimePeriod = (e: RadioChangeEvent) => {
        const selectedTimePeriod = Number(e.target.value);
        setTimePeriod(selectedTimePeriod);
    };
    return (
        <div>
            <Radio.Group onChange={onChangeTimePeriod} value={timePeriod} disabled={isLoading}>
                {timePeriodList.map((item, index) => (
                    <Radio key={index} value={index + 1}>
                        {item}
                    </Radio>
                ))}
            </Radio.Group>
        </div>
    );
};
