/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';

export const MonitorTip = ({
    type,
    msg,
    onRemove,
}: {
    type: 'error' | 'success' | undefined;
    msg: string;
    onRemove: () => void;
}): JSX.Element => {
    if (!type) {
        return <></>;
    }

    return (
        <div className={'monitor-tip-class'}>
            {' '}
            <Alert
                className={''}
                message='Operating System Monitor:'
                description={msg}
                type={type}
                onClose={onRemove}
                closable={true}
            />{' '}
        </div>
    );
};
