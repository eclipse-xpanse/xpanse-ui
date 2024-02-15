/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import { lastMinuteRadioButtonKeyId, timePeriodList } from './metricProps';
import React, { useState } from 'react';

export const MetricTimePeriod = ({
    isLoading,
    getTimePeriod,
}: {
    isLoading: boolean;
    getTimePeriod: (currentTimePeriod: number) => void;
}): React.JSX.Element => {
    const [timePeriod, setTimePeriod] = useState<number>(lastMinuteRadioButtonKeyId.valueOf());

    const onChangeTimePeriod = (e: RadioChangeEvent) => {
        const selectedTimePeriod = Number(e.target.value);
        setTimePeriod(selectedTimePeriod);
        getTimePeriod(selectedTimePeriod);
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
