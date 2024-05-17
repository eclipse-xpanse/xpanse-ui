/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag } from 'antd';
import React from 'react';
import '../../../../styles/service_order.css';

export const BillingInfo = ({ priceValue }: { priceValue: string }): React.JSX.Element => {
    return (
        <>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <span className={'order-billing-title-class'}>Price:&nbsp;</span>
                <Tag color={'blue'} className={'order-billing-value-class'}>
                    {priceValue}
                </Tag>
            </div>
        </>
    );
};
