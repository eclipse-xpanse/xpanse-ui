/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag } from 'antd';
import React from 'react';
import serviceModifyStyles from '../../../../styles/service-modify.module.css';

export const FlavorPrice = (): React.JSX.Element => {
    return (
        <>
            <Tag color={'blue'} className={serviceModifyStyles.flavorPriceContent}>
                {/* TODO Will be fixed after #1597 is fixed */}
                {(20).toString().concat(' ').concat('EUR/').concat('hourly')}
            </Tag>
        </>
    );
};
