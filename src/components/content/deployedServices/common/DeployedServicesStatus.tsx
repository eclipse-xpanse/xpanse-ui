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
import { serviceDeploymentState } from '../../../../xpanse-api/generated';

export function DeployedServicesStatus(serviceDeploymentStatus: serviceDeploymentState): React.JSX.Element {
    switch (serviceDeploymentStatus) {
        case serviceDeploymentState.DEPLOYING:
        case serviceDeploymentState.MODIFYING:
        case serviceDeploymentState.DESTROYING:
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin />}
                    color='processing'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentStatus.valueOf()}
                </Tag>
            );
        case serviceDeploymentState.DEPLOYMENT_FAILED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='error'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentStatus.valueOf()}
                </Tag>
            );
        case serviceDeploymentState.MODIFICATION_FAILED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='error'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentStatus.valueOf()}
                </Tag>
            );
        case serviceDeploymentState.DESTROY_FAILED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='magenta'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentStatus.valueOf()}
                </Tag>
            );
        case serviceDeploymentState.DESTROY_SUCCESSFUL:
            return (
                <Tag
                    bordered={false}
                    icon={<MinusCircleOutlined />}
                    color='lime'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentStatus.valueOf()}
                </Tag>
            );
        case serviceDeploymentState.DEPLOYMENT_SUCCESSFUL:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentStatus.valueOf()}
                </Tag>
            );
        case serviceDeploymentState.MODIFICATION_SUCCESSFUL:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className={myServiceStyles.myServiceStatusSize}
                >
                    {serviceDeploymentStatus.valueOf()}
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
                    {serviceDeploymentStatus as string}
                </Tag>
            );
    }
}
