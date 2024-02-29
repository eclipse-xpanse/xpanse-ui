/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { StopwatchResult } from 'react-timer-hook';
import { HourglassOutlined } from '@ant-design/icons';
import React from 'react';

function DeploymentTimerNewOrder({ stopWatch }: { stopWatch: StopwatchResult }): React.JSX.Element {
    return (
        <div className={'timer-block'}>
            <div className={'timer-header'}>Order Duration</div>
            <div className={'timer-value'}>
                <HourglassOutlined /> <span>{stopWatch.hours}h</span>:<span>{stopWatch.minutes}m</span>:
                <span>{stopWatch.seconds}s</span>
            </div>
        </div>
    );
}

export default DeploymentTimerNewOrder;
