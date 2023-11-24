/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeployedService } from '../../../../xpanse-api/generated';
import React from 'react';
import { Tag } from 'antd';

export function DeployedServicesHostingType(serviceHostingType: DeployedService.serviceHostingType): React.JSX.Element {
    switch (serviceHostingType) {
        case DeployedService.serviceHostingType.SERVICE_VENDOR:
            return (
                <Tag bordered={false} color='magenta' className={'my-service-status-size'}>
                    {serviceHostingType.valueOf()}
                </Tag>
            );
        case DeployedService.serviceHostingType.SELF:
            return (
                <Tag bordered={false} color='geekblue' className={'my-service-status-size'}>
                    {serviceHostingType.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag color='warning' className={'my-service-status-size'}>
                    {serviceHostingType as string}
                </Tag>
            );
    }
}
