/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeployResource } from '../../../xpanse-api/generated';
import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { DeployResourceDataType } from './myServiceProps';
import { Table } from 'antd';
import DeployedResourceProperties from './DeployedResourceProperties';

export function DeployedResources(content: DeployResource[], title: string): React.JSX.Element {
    let columns: ColumnsType<DeployResourceDataType> = [];
    const deployResourceList: DeployResourceDataType[] = [];
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
        content.forEach(function (item, index) {
            const currentDeployResource: DeployResourceDataType = {
                key: String(index),
                resourceType: item.kind,
                resourceId: item.resourceId,
                name: DeployedResourceProperties(item),
            };
            deployResourceList.push(currentDeployResource);
        });
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
