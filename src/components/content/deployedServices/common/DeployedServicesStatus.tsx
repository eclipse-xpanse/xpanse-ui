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

export function DeployedServicesStatus(serviceDeploymentState: serviceDeploymentState): React.JSX.Element {
    switch (serviceDeploymentState) {
        case 'deploying':
        case 'modifying':
        case 'destroying':
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
        case 'deployment failed':
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
        case 'modification failed':
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
        case 'destroy failed':
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
        case 'destroy successful':
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
        case 'deployment successful':
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
        case 'modification successful':
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
