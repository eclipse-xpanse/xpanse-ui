/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { GlobalOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { Region } from '../../../../xpanse-api/generated';

export function DeployedRegion({
    currentRegion,
    className,
}: {
    currentRegion: Region;
    className?: string | undefined;
}): React.JSX.Element {
    const content = (
        <div className={`${myServicesStyle.regionDisplayInline} ${myServicesStyle.regionSite}`}>
            site: &nbsp; {currentRegion.site}
        </div>
    );
    return (
        <div className={className}>
            <Tag bordered={false} color='gold' className={myServicesStyle.myServiceStatusSize}>
                {currentRegion.name}
                {'  '}
                <GlobalOutlined />
                {content}
            </Tag>
        </div>
    );
}
