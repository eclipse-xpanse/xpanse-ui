/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlayCircleOutlined, PoweroffOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { Row, Tag, Tooltip } from 'antd';
import React from 'react';
import { DeployedService } from '../../../../xpanse-api/generated';

export function DeployedServicesRunningStatus(record: DeployedService): React.JSX.Element {
    if (record.serviceState === DeployedService.serviceState.RUNNING) {
        return (
            <Tooltip
                title={
                    <Row className={'service-instance-list-service-state'}>running since - {record.lastStartedAt}</Row>
                }
            >
                <Tag icon={<PlayCircleOutlined />} color='success'>
                    {record.serviceState}
                </Tag>
            </Tooltip>
        );
    } else if (record.serviceState === DeployedService.serviceState.STOPPED) {
        return (
            <Tooltip
                title={<Row className={'service-instance-list-service-state'}>stopped at - {record.lastStoppedAt}</Row>}
            >
                <Tag icon={<PoweroffOutlined />} color='error'>
                    {record.serviceState}
                </Tag>
            </Tooltip>
        );
    } else if (
        record.serviceState === DeployedService.serviceState.STOPPING ||
        record.serviceState === DeployedService.serviceState.STARTING ||
        record.serviceState === DeployedService.serviceState.RESTARTING
    ) {
        return (
            <Tag icon={<SyncOutlined />} color='processing'>
                {record.serviceState}
            </Tag>
        );
    } else {
        return (
            <Tag icon={<StopOutlined />} color='default'>
                {record.serviceState}
            </Tag>
        );
    }
}
