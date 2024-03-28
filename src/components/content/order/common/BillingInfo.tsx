/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Tag } from 'antd';
import '../../../../styles/service_order.css';
import { Billing } from '../../../../xpanse-api/generated';

export const BillingInfo = ({ priceValue, billing }: { priceValue: string; billing: Billing }): React.JSX.Element => {
    return (
        <>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <span className={'order-billing-title-class'}>Price:&nbsp;</span>
                <Tag color={'blue'} className={'order-billing-value-class'}>
                    {priceValue}
                </Tag>
                <span className={'order-billing-model-title-class'}>Model:&nbsp;</span>
                <Tag color={'blue'} className={'order-billing-model-value-class'}>
                    {billing.billingModel}
                </Tag>
            </div>
        </>
    );
};
