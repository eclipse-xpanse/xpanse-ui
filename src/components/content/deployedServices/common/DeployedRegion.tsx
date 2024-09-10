/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { GlobalOutlined } from '@ant-design/icons';
import { Popover, Tag } from 'antd';
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
        <div className={myServicesStyle.regionDisplayInline}>
            <div className={myServicesStyle.regionSite}>
                <h5>site: </h5>
                &nbsp;&nbsp; <Tag color='purple'> {currentRegion.site}</Tag>
            </div>
            <div className={myServicesStyle.regionArea}>
                <h5>area: </h5>
                &nbsp;&nbsp; <Tag color='geekblue'>{currentRegion.area}</Tag>
            </div>
        </div>
    );
    return (
        <div className={className}>
            <Tag bordered={false} color='gold' className={myServicesStyle.myServiceStatusSize}>
                {currentRegion.name}
                {'  '}
                <Popover content={content} trigger='hover'>
                    <GlobalOutlined />
                </Popover>
            </Tag>
        </div>
    );
}
