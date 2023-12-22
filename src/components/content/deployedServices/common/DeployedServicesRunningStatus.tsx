/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { DeployedService } from '../../../../xpanse-api/generated';
import { Tag } from 'antd';
import { PlayCircleOutlined, PoweroffOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';

export function DeployedServicesRunningStatus(serviceState: DeployedService.serviceState): React.JSX.Element {
    if (
        serviceState === DeployedService.serviceState.RUNNING ||
        serviceState === DeployedService.serviceState.STOPPING_FAILED
    ) {
        return (
            <Tag icon={<PlayCircleOutlined />} color='success'>
                {serviceState}
            </Tag>
        );
    } else if (
        serviceState === DeployedService.serviceState.STOPPED ||
        serviceState === DeployedService.serviceState.STARTING_FAILED
    ) {
        return (
            <Tag icon={<PoweroffOutlined />} color='error'>
                {serviceState}
            </Tag>
        );
    } else if (
        serviceState === DeployedService.serviceState.STOPPING ||
        serviceState === DeployedService.serviceState.STARTING
    ) {
        return (
            <Tag icon={<SyncOutlined />} color='processing'>
                {serviceState}
            </Tag>
        );
    } else {
        return (
            <Tag icon={<StopOutlined />} color='default'>
                {serviceState}
            </Tag>
        );
    }
}
