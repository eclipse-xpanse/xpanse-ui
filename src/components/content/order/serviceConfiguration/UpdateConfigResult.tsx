/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';

import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

export const UpdateConfigResult = ({
    msg,
    uuid,
    type,
}: {
    msg: string | React.JSX.Element;
    uuid: string;
    type: 'success' | 'error';
}): React.JSX.Element => {
    return (
        <div className={submitAlertStyles.submitAlertTip}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} uuid={uuid} />}
                showIcon
                closable={true}
                type={type}
            />{' '}
        </div>
    );
};
