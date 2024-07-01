/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlayCircleOutlined, PoweroffOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { Row, Tag, Tooltip } from 'antd';
import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { DeployedService, serviceState } from '../../../../xpanse-api/generated';

export function DeployedServicesRunningStatus(record: DeployedService): React.JSX.Element {
    if (record.serviceState === serviceState.RUNNING) {
        return (
            <Tooltip
                title={
                    <Row className={myServicesStyle.serviceInstanceListServiceState}>
                        running since - {record.lastStartedAt}
                    </Row>
                }
            >
                <Tag icon={<PlayCircleOutlined />} color='success'>
                    {record.serviceState}
                </Tag>
            </Tooltip>
        );
    } else if (record.serviceState === serviceState.STOPPED) {
        return (
            <Tooltip
                title={
                    <Row className={myServicesStyle.serviceInstanceListServiceState}>
                        stopped at - {record.lastStoppedAt}
                    </Row>
                }
            >
                <Tag icon={<PoweroffOutlined />} color='error'>
                    {record.serviceState}
                </Tag>
            </Tooltip>
        );
    } else if (
        record.serviceState === serviceState.STOPPING ||
        record.serviceState === serviceState.STARTING ||
        record.serviceState === serviceState.RESTARTING
    ) {
        return (
            <Tag
                bordered={false}
                icon={<SyncOutlined spin />}
                color='processing'
                className={myServicesStyle.myServiceStatusSize}
            >
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
