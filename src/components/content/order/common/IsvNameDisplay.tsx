/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag, Tooltip } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export const IsvNameDisplay = ({ serviceVendor }: { serviceVendor: string }): React.JSX.Element => {
    const truncatedServiceVendor = serviceVendor.length > 12 ? serviceVendor.slice(0, 12) + '...' : serviceVendor;
    return (
        <span className={serviceOrderStyles.serviceIsvVendor}>
            <Tag color='blue' bordered={false} className={serviceOrderStyles.serviceIsvVendorTag}>
                <Tooltip placement='bottom' title={serviceVendor} color={'blue'}>
                    Service Vendor: {truncatedServiceVendor}
                </Tooltip>
            </Tag>
        </span>
    );
};
