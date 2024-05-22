/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export const BillingInfo = ({ priceValue }: { priceValue: string }): React.JSX.Element => {
    return (
        <>
            <div className={serviceOrderStyles.orderFormSelectionStyle}>
                <span className={serviceOrderStyles.orderBillingTitleClass}>Price:&nbsp;</span>
                <Tag color={'blue'} className={serviceOrderStyles.orderBillingValueClass}>
                    {priceValue}
                </Tag>
            </div>
        </>
    );
};
