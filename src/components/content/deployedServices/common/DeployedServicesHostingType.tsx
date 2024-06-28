/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag } from 'antd';
import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { serviceHostingType } from '../../../../xpanse-api/generated';

export function DeployedServicesHostingType(currentServiceHostingType: string): React.JSX.Element {
    switch (currentServiceHostingType) {
        case serviceHostingType.SERVICE_VENDOR.toString():
            return (
                <Tag bordered={false} color='magenta' className={myServicesStyle.myServiceStatusSize}>
                    {currentServiceHostingType.valueOf()}
                </Tag>
            );
        case serviceHostingType.SELF.toString():
            return (
                <Tag bordered={false} color='cyan' className={myServicesStyle.myServiceStatusSize}>
                    {currentServiceHostingType.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag color='warning' className={myServicesStyle.myServiceStatusSize}>
                    {currentServiceHostingType}
                </Tag>
            );
    }
}
