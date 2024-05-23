/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import monitorStyles from '../../../styles/monitor.module.css';

export const MonitorTip = ({
    type,
    msg,
    description,
    onRemove,
}: {
    type: 'error' | 'success' | undefined;
    msg: string;
    description: string;
    onRemove: () => void;
}): React.JSX.Element => {
    if (!type) {
        return <></>;
    }

    return (
        <div className={monitorStyles.monitorTipClass}>
            {' '}
            <Alert
                showIcon={true}
                message={msg}
                description={description}
                type={type}
                onClose={onRemove}
                closable={true}
            />{' '}
        </div>
    );
};
