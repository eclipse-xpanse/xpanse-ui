/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag } from 'antd';
import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { serviceHostingType } from '../../../../xpanse-api/generated';

export function DeployedServicesHostingType({
    currentServiceHostingType,
    className,
}: {
    currentServiceHostingType: serviceHostingType;
    className?: string | undefined;
}): React.JSX.Element {
    switch (currentServiceHostingType) {
        case serviceHostingType.SERVICE_VENDOR:
            return (
                <div className={className}>
                    <Tag bordered={false} color='magenta' className={myServicesStyle.myServiceStatusSize}>
                        {currentServiceHostingType.valueOf()}
                    </Tag>
                </div>
            );
        case serviceHostingType.SELF:
            return (
                <div className={className}>
                    <Tag bordered={false} color='cyan' className={myServicesStyle.myServiceStatusSize}>
                        {currentServiceHostingType.valueOf()}
                    </Tag>
                </div>
            );
        default:
            return (
                <div className={className}>
                    <Tag color='warning' className={myServicesStyle.myServiceStatusSize}>
                        {currentServiceHostingType}
                    </Tag>
                </div>
            );
    }
}
