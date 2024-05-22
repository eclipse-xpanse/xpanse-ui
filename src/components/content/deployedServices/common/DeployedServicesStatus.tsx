/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import myServiceStyles from '../../../../styles/my-services.module.css';
import { DeployedService } from '../../../../xpanse-api/generated';

export function DeployedServicesStatus(
    serviceDeploymentState: DeployedService.serviceDeploymentState
): React.JSX.Element {
    switch (serviceDeploymentState) {
        case DeployedService.serviceDeploymentState.DEPLOYING:
        case DeployedService.serviceDeploymentState.MODIFYING:
        case DeployedService.serviceDeploymentState.DESTROYING:
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin />}
                    color='processing'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='error'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.MODIFICATION_FAILED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='error'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DESTROY_FAILED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='magenta'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL:
            return (
                <Tag
                    bordered={false}
                    icon={<MinusCircleOutlined />}
                    color='lime'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className={myServiceStyles.myServiceStatusSize}
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
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentState as string}
                </Tag>
            );
    }
}
