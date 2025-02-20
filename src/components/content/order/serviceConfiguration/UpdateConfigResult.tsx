/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';

import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import ConfigSubmitResultDetails from './ConfigSubmitResultDetails.tsx';

export const UpdateConfigResult = ({
    msg,
    orderId,
    type,
}: {
    msg: string | React.JSX.Element;
    orderId: string;
    type: 'success' | 'error';
}): React.JSX.Element => {
    return (
        <div className={submitAlertStyles.submitAlertTip}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<ConfigSubmitResultDetails msg={msg} orderId={orderId} />}
                showIcon
                closable={true}
                type={type}
            />{' '}
        </div>
    );
};
