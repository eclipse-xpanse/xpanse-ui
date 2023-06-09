/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import OrderSubmitResultDetails from './OrderSubmitResultDetails';

export const OrderSubmitResult = (msg: string | JSX.Element, uuid: string, type: 'success' | 'error'): JSX.Element => {
    return (
        <div className={'submit-alert-tip'}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} uuid={uuid} />}
                showIcon
                closable
                type={type}
            />{' '}
        </div>
    );
};

export const MigrateSubmitResult = (
    msg: string | JSX.Element,
    uuid: string,
    type: 'success' | 'error'
): JSX.Element => {
    return (
        <div className={'submit-alert-tip'}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} uuid={uuid} />}
                showIcon
                type={type}
            />{' '}
        </div>
    );
};
