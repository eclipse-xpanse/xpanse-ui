/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { DeployedService } from '../../../../xpanse-api/generated';
import { Tag } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

export function DeployedServicesStatus(
    serviceDeploymentState: DeployedService.serviceDeploymentState
): React.JSX.Element {
    switch (serviceDeploymentState) {
        case DeployedService.serviceDeploymentState.DEPLOYING:
        case DeployedService.serviceDeploymentState.DESTROYING:
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin />}
                    color='processing'
                    className={'my-service-status-size'}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED:
            return (
                <Tag bordered={false} icon={<CloseCircleOutlined />} color='error' className={'my-service-status-size'}>
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DESTROY_FAILED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='magenta'
                    className={'my-service-status-size'}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL:
            return (
                <Tag bordered={false} icon={<MinusCircleOutlined />} color='lime' className={'my-service-status-size'}>
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className={'my-service-status-size'}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag
                    bordered={false}
                    icon={<ExclamationCircleOutlined />}
                    color='warning'
                    className={'my-service-status-size'}
                >
                    {serviceDeploymentState as string}
                </Tag>
            );
    }
}
