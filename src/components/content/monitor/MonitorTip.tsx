/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';

export const MonitorTip = ({ type, msg }: { type: 'error' | 'success' | undefined; msg: string }): JSX.Element => {
    if (!type) {
        return <></>;
    }
    return (
        <div className={'submit-alert-tip'}>
            {' '}
            <Alert message='Operating System Monitor:' description={msg} showIcon type={type} />{' '}
        </div>
    );
};
