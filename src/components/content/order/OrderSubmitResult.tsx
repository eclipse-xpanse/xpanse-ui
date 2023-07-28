/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import OrderSubmitResultDetails from './OrderSubmitResultDetails';
import { StopwatchResult } from 'react-timer-hook';
import { ServiceDetailVo } from '../../../xpanse-api/generated';
import DeploymentTimer from './DeploymentTimer';

export const OrderSubmitResult = (
    msg: string | JSX.Element,
    uuid: string,
    type: 'success' | 'error',
    deploymentStatus: ServiceDetailVo.serviceDeploymentState,
    stopWatch: StopwatchResult
): JSX.Element => {
    return (
        <div className={'submit-alert-tip'}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} uuid={uuid} />}
                showIcon
                closable={false}
                type={type}
                action={<DeploymentTimer stopWatch={stopWatch} deploymentStatus={deploymentStatus} />}
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
