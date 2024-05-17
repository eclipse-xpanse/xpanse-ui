/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tooltip, Typography } from 'antd';
import React from 'react';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';

export function ShowIcon({ serviceDetails }: { serviceDetails: ServiceTemplateDetailVo }): React.JSX.Element {
    const { Paragraph } = Typography;
    return (
        <div className={'catalog-service-icon'}>
            <img width={20} height={20} src={serviceDetails.icon} alt='Service Icon' referrerPolicy='no-referrer' />
            &nbsp;
            <Tooltip placement='topLeft' title={serviceDetails.name}>
                <Paragraph ellipsis={true} className={'catalog-service-name'}>
                    {serviceDetails.name}
                </Paragraph>
            </Tooltip>
        </div>
    );
}
