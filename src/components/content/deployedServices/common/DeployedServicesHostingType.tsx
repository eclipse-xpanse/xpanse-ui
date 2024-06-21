/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag } from 'antd';
import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { serviceHostingType } from '../../../../xpanse-api/generated';

export function DeployedServicesHostingType(serviceHostingType: serviceHostingType): React.JSX.Element {
    switch (serviceHostingType) {
        case 'service-vendor':
            return (
                <Tag bordered={false} color='magenta' className={myServicesStyle.myServiceStatusSize}>
                    {serviceHostingType.valueOf()}
                </Tag>
            );
        case 'self':
            return (
                <Tag bordered={false} color='cyan' className={myServicesStyle.myServiceStatusSize}>
                    {serviceHostingType.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag color='warning' className={myServicesStyle.myServiceStatusSize}>
                    {serviceHostingType as string}
                </Tag>
            );
    }
}
