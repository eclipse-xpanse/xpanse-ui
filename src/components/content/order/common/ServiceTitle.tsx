/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tooltip, Typography } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export const ServiceTitle = ({
    title,
    version,
    icon,
}: {
    title: string;
    version?: string;
    icon: string | undefined;
}): React.JSX.Element => {
    const { Paragraph } = Typography;
    return (
        <>
            <Tooltip placement='topLeft' title={title}>
                <Paragraph ellipsis={true} className={serviceOrderStyles.serviceTitleClass}>
                    <img src={icon ?? undefined} className={serviceOrderStyles.serviceTitleIconClass} alt='icon' />
                    <div className={serviceOrderStyles.serviceTitleTextContainer}>
                        <span className={serviceOrderStyles.serviceTitleText}>{title}</span>
                        {version ? <span className={serviceOrderStyles.serviceTitleVersionClass}>{version}</span> : ''}
                    </div>
                </Paragraph>
            </Tooltip>
        </>
    );
};
