/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import OrderSubmitResultDetails from './OrderSubmitResultDetails';

function OrderSubmitResult(msg: string | JSX.Element, uuid: string, type: 'success' | 'error'): JSX.Element {
    return (
        <div className={'submit-alert-tip'}>
            {' '}
            <Alert
                message={`Deployment Status`}
                description={<OrderSubmitResultDetails msg={msg} uuid={uuid} />}
                showIcon
                type={type}
            />{' '}
        </div>
    );
}

export default OrderSubmitResult;
