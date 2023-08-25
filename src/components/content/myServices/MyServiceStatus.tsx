/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { ServiceVo } from '../../../xpanse-api/generated';
import { Tag } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

export function MyServiceStatus(serviceDeploymentState: ServiceVo.serviceDeploymentState): React.JSX.Element {
    switch (serviceDeploymentState) {
        case ServiceVo.serviceDeploymentState.DEPLOYING:
        case ServiceVo.serviceDeploymentState.DESTROYING:
            return (
                <Tag icon={<SyncOutlined spin />} color='processing' className={'my-service-status-size'}>
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case ServiceVo.serviceDeploymentState.DEPLOYMENT_FAILED:
            return (
                <Tag icon={<CloseCircleOutlined />} color='error' className={'my-service-status-size'}>
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case ServiceVo.serviceDeploymentState.DESTROY_FAILED:
            return (
                <Tag icon={<CloseCircleOutlined />} color='magenta' className={'my-service-status-size'}>
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case ServiceVo.serviceDeploymentState.DESTROY_SUCCESSFUL:
            return (
                <Tag icon={<MinusCircleOutlined />} color='lime' className={'my-service-status-size'}>
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        case ServiceVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL:
            return (
                <Tag icon={<CheckCircleOutlined />} color='success' className={'my-service-status-size'}>
                    {serviceDeploymentState.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined />} color='warning' className={'my-service-status-size'}>
                    {serviceDeploymentState as string}
                </Tag>
            );
    }
}
