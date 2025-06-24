/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { DeployResource, deployResourceKind } from '../../../../xpanse-api/generated';
import { DeployResourceDataType } from '../myServices/myServiceProps';
import DeployedResourceProperties from './DeployedResourceProperties';

export function DeployedResources({ content, title }: { content: DeployResource[]; title: string }): React.JSX.Element {
    let columns: ColumnsType<DeployResourceDataType> = [];
    const deployResourceList: DeployResourceDataType[] = [];
    if (content.length > 0) {
        columns = [
            {
                title: 'ResourceKind',
                dataIndex: 'resourceKind',
                align: 'center',
            },
            {
                title: 'ResourceId',
                dataIndex: 'resourceId',
                sortDirections: ['descend'],
                align: 'center',
            },
            {
                title: 'ResourceName',
                dataIndex: 'resourceName',
                defaultSortOrder: 'descend',
                align: 'center',
            },
        ];
        content.forEach(function (item, index) {
            const currentDeployResource: DeployResourceDataType = {
                key: String(index),
                resourceKind: item.resourceKind as deployResourceKind,
                resourceId: item.resourceId,
                resourceName: DeployedResourceProperties(item),
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
