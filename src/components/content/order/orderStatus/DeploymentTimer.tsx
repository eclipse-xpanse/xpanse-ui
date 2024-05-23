/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { HourglassOutlined } from '@ant-design/icons';
import React from 'react';
import { StopwatchResult } from 'react-timer-hook';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

function DeploymentTimer({ stopWatch }: { stopWatch: StopwatchResult }): React.JSX.Element {
    return (
        <div className={serviceOrderStyles.timerBlock}>
            <div className={serviceOrderStyles.timerHeader}>Order Duration</div>
            <div className={serviceOrderStyles.timerValue}>
                <HourglassOutlined /> <span>{stopWatch.hours}h</span>:<span>{stopWatch.minutes}m</span>:
                <span>{stopWatch.seconds}s</span>
            </div>
        </div>
    );
}

export default DeploymentTimer;
