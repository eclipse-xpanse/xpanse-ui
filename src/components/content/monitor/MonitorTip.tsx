/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../styles/error-alert.module.css';
import monitorStyles from '../../../styles/monitor.module.css';

export const MonitorTip = ({
    type,
    msg,
    description,
    onRemove,
    retryRequest,
}: {
    type: 'error' | 'success' | undefined;
    msg: string;
    description: string;
    onRemove: () => void;
    retryRequest: () => void;
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
                action={
                    <Button
                        className={errorAlertStyles.tryAgainBtnInAlertClass}
                        size='small'
                        type='primary'
                        onClick={retryRequest}
                        danger={true}
                    >
                        Retry Request
                    </Button>
                }
            />{' '}
        </div>
    );
};
