/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag, Tooltip } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export const IsvNameDisplay = ({ namespace }: { namespace: string }): React.JSX.Element => {
    const truncatedNamespace = namespace.length > 12 ? namespace.slice(0, 12) + '...' : namespace;
    return (
        <span className={serviceOrderStyles.serviceIsvVendor}>
            <Tag color='blue' bordered={false}>
                <Tooltip placement='bottom' title={namespace} color={'blue'}>
                    Service Vendor: {truncatedNamespace}
                </Tooltip>
            </Tag>
        </span>
    );
};
