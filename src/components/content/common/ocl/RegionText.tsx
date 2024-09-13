/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Table, TableProps, Tag } from 'antd';
import React from 'react';
import regionStyle from '../../../../styles/region-text.module.css';
import { Region } from '../../../../xpanse-api/generated';
import { GroupedRegionItem, groupedRegions } from '../../../utils/groupedRegions.tsx';

const columns: TableProps<GroupedRegionItem>['columns'] = [
    {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        render: (text) => <Tag color={'green'}>{text}</Tag>,
    },
    {
        title: 'Region',
        dataIndex: 'name',
        key: 'region',
        render: (_, { name }) => (
            <>
                {name.map((item) => {
                    return (
                        <Tag color={'blue'} key={item}>
                            {item}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Site',
        dataIndex: 'site',
        key: 'site',
        render: (_, { site }) => (
            <>
                {site.map((item) => {
                    return (
                        <Tag color={'orange'} key={item}>
                            {item}
                        </Tag>
                    );
                })}
            </>
        ),
    },
];

export function RegionText({ regions }: { regions: Region[] }): React.JSX.Element {
    if (regions.length > 0) {
        const groupedByAreaRegions = groupedRegions(regions);
        return (
            <div className={regionStyle.regionList}>
                <Table
                    columns={columns}
                    dataSource={groupedByAreaRegions}
                    rowKey={'id'}
                    pagination={false}
                    bordered={true}
                />
            </div>
        );
    }

    return <></>;
}
