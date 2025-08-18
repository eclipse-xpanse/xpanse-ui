/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag } from 'antd';
import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { BillingMode } from '../../../../xpanse-api/generated';

export function DeployedBillingMode({
    currentBillingMode,
    className,
}: {
    currentBillingMode: BillingMode;
    className?: string | undefined;
}): React.JSX.Element {
    switch (currentBillingMode) {
        case BillingMode.PAY_PER_USE:
            return (
                <div className={className}>
                    <Tag bordered={false} color='volcano' className={myServicesStyle.myServiceStatusSize}>
                        {currentBillingMode.valueOf()}
                    </Tag>
                </div>
            );
        case BillingMode.FIXED:
            return (
                <div className={className}>
                    <Tag bordered={false} color='blue' className={myServicesStyle.myServiceStatusSize}>
                        {currentBillingMode.valueOf()}
                    </Tag>
                </div>
            );
        default:
            return (
                <div className={className}>
                    <Tag color='warning' className={myServicesStyle.myServiceStatusSize}>
                        {currentBillingMode}
                    </Tag>
                </div>
            );
    }
}
