/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeployResource } from '../../../xpanse-api/generated';
import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { DeployResourceDataType } from './myServiceProps';
import { Table } from 'antd';

export function DeployedResources(content: DeployResource[], title: string): React.JSX.Element {
    let columns: ColumnsType<DeployResourceDataType> = [];
    let deployResourceList: DeployResourceDataType[] = [];
    if (content.length > 0) {
        columns = [
            {
                title: 'ResourceType',
                dataIndex: 'resourceType',
                align: 'center',
            },
            {
                title: 'ResourceId',
                dataIndex: 'resourceId',
                sortDirections: ['descend'],
                align: 'center',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                defaultSortOrder: 'descend',
                align: 'center',
            },
        ];
        const currentDeployResourceList: DeployResourceDataType[] = [];
        content.forEach(function (item, index) {
            const currentDeployResource = {
                key: String(index),
                resourceType: item.kind,
                resourceId: item.resourceId,
                name: item.name,
            };
            currentDeployResourceList.push(currentDeployResource);
        });
        deployResourceList = currentDeployResourceList;
    }
    return (
        <div>
            {content.length > 0 && deployResourceList.length > 0 ? (
                <>
                    <h4>{title}</h4>
                    <Table columns={columns} dataSource={deployResourceList} />
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
