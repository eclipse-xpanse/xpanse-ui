/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popover, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import deploymentVariablesStyles from '../../../styles/deployment-variables.module.css';
import { deployResourceKind, InputVariable, sensitiveScope } from '../../../xpanse-api/generated';

function DeploymentVariables({ variables }: { variables: InputVariable[] }): React.JSX.Element {
    const columns: ColumnsType<InputVariable> = [
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>Name</div>,
            dataIndex: 'name',
            render: (text: string) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>Kind</div>,
            dataIndex: 'kind',
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
            render: (_text: string, record: InputVariable) => {
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
            title: <div className={deploymentVariablesStyles.variablesColumns}>Default</div>,
            dataIndex: 'value',
            render: (text: string) => {
                return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>Mandatory</div>,
            dataIndex: 'mandatory',
            render: (text: boolean | undefined | null) => {
                if (text === true) {
                    return <div className={deploymentVariablesStyles.variablesColumns}>{`true`}</div>;
                } else if (text === false) {
                    return <div className={deploymentVariablesStyles.variablesColumns}>{`false`}</div>;
                } else {
                    return null;
                }
            },
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>ValueSchema</div>,
            dataIndex: 'valueSchema',
            render: (_text: string, record: InputVariable) => {
                if (!record.valueSchema) {
                    return '';
                }

                const formattedValueSchema = Object.entries(record.valueSchema)
                    .map(([key, value]) => `${key}: ${value as string}`)
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
            title: <div className={deploymentVariablesStyles.variablesColumns}>AutoFill</div>,
            dataIndex: 'autoFill',
            children: [
                {
                    title: (
                        <div className={deploymentVariablesStyles.variablesTableChildrenTitle}>
                            Deploy Resource Kind
                        </div>
                    ),
                    dataIndex: ['autoFill', 'deployResourceKind'],
                    key: 'deployResourceKind',
                    render: (text: deployResourceKind) => {
                        return <div className={deploymentVariablesStyles.variablesColumns}>{text}</div>;
                    },
                },
                {
                    title: <div className={deploymentVariablesStyles.variablesTableChildrenTitle}>Is Allow Create</div>,
                    dataIndex: ['autoFill', 'isAllowCreate'],
                    key: 'isAllowCreate',
                    render: (text: boolean | undefined | null) => {
                        if (text === true) {
                            return <div className={deploymentVariablesStyles.variablesColumns}>{`true`}</div>;
                        } else if (text === false) {
                            return <div className={deploymentVariablesStyles.variablesColumns}>{`false`}</div>;
                        } else {
                            return null;
                        }
                    },
                },
            ],
        },
        {
            title: <div className={deploymentVariablesStyles.variablesColumns}>ModificationImpact</div>,
            dataIndex: 'modificationImpact',
            children: [
                {
                    title: <div className={deploymentVariablesStyles.variablesTableChildrenTitle}>Is Data Lost</div>,
                    dataIndex: ['modificationImpact', 'isDataLost'],
                    key: 'isDataLost',
                    render: (text: boolean | undefined | null) => {
                        if (text === true) {
                            return <div className={deploymentVariablesStyles.variablesColumns}>{`true`}</div>;
                        } else if (text === false) {
                            return <div className={deploymentVariablesStyles.variablesColumns}>{`false`}</div>;
                        } else {
                            return null;
                        }
                    },
                },
                {
                    title: (
                        <div className={deploymentVariablesStyles.variablesTableChildrenTitle}>
                            Is Service Interrupted
                        </div>
                    ),
                    dataIndex: ['modificationImpact', 'isServiceInterrupted'],
                    key: 'isServiceInterrupted',
                    render: (text: boolean | undefined | null) => {
                        if (text === true) {
                            return <div className={deploymentVariablesStyles.variablesColumns}>{`true`}</div>;
                        } else if (text === false) {
                            return <div className={deploymentVariablesStyles.variablesColumns}>{`false`}</div>;
                        } else {
                            return null;
                        }
                    },
                },
            ],
        },
    ];

    return (
        <>
            <div className={`${catalogStyles.catalogDetailsH6} ${catalogStyles.managementVariable}`}>
                &nbsp;Deployment Variables
            </div>
            <div className={deploymentVariablesStyles.variablesTableContainer}>
                <Table columns={columns} dataSource={variables} rowKey={'name'} bordered pagination={false} />
            </div>
        </>
    );
}

export default DeploymentVariables;
