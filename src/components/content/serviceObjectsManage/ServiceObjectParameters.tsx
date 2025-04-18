/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popover, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import deploymentVariablesStyles from '../../../styles/deployment-variables.module.css';
import { ObjectParameter, sensitiveScope } from '../../../xpanse-api/generated';

function ServiceObjectParameters({
    parameters,
    tableName,
}: {
    parameters: ObjectParameter[];
    tableName: string;
}): React.JSX.Element {
    const columns: ColumnsType<ObjectParameter> = [
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>Name</div>,
            dataIndex: 'name',
            render: (text: string) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>DataType</div>,
            dataIndex: 'dataType',
            render: (text: string) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>Example</div>,
            dataIndex: 'example',
            render: (text: string) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>Description</div>,
            dataIndex: 'description',
            render: (_text: string, record: ObjectParameter) => {
                return (
                    <Popover
                        content={
                            <pre>
                                {' '}
                                <div className={deploymentVariablesStyles.variablesContentHover}>
                                    {record.description}
                                </div>
                            </pre>
                        }
                        title={'Description'}
                        trigger='hover'
                    >
                        <Button
                            className={deploymentVariablesStyles.variablesDataHover}
                            type={'link'}
                        >{`description`}</Button>
                    </Popover>
                );
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>ValueSchema</div>,
            dataIndex: 'valueSchema',
            render: (_text: string, record: ObjectParameter) => {
                if (!record.valueSchema) {
                    return '';
                }

                const formattedValueSchema = Object.entries(record.valueSchema)
                    .map(([key, value]) => `${key}: ${value as unknown as string}`)
                    .join('\n');

                return (
                    <Popover
                        content={
                            <pre>
                                {' '}
                                <div className={deploymentVariablesStyles.variablesContentHover}>
                                    {formattedValueSchema}
                                </div>
                            </pre>
                        }
                        title={'Value Schema'}
                        trigger='hover'
                    >
                        <Button
                            className={deploymentVariablesStyles.variablesDataHover}
                            type={'link'}
                        >{`valueSchema`}</Button>
                    </Popover>
                );
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>SensitiveScope</div>,
            dataIndex: 'sensitiveScope',
            render: (text: sensitiveScope) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>IsMandatory</div>,
            dataIndex: 'isMandatory',
            render: (text: string) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>LinkedObjectType</div>,
            dataIndex: 'linkedObjectType',
            render: (text: string) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
    ];

    return (
        <>
            <div className={`${catalogStyles.catalogDetailsH6} ${catalogStyles.managementVariable}`}>
                &nbsp;{tableName}
            </div>
            <div className={deploymentVariablesStyles.variablesTableContainer}>
                <Table bordered columns={columns} dataSource={parameters} rowKey={'name'} pagination={false} />
            </div>
        </>
    );
}

export default ServiceObjectParameters;
