/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { SyncOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React from 'react';
import appStyles from '../../../styles/app.module.css';
import healthStatusStyles from '../../../styles/health-status.module.css';
import tableStyles from '../../../styles/table.module.css';
import { BackendSystemStatus, backendSystemType, healthStatus, StackStatus } from '../../../xpanse-api/generated';
import { healthCheckStatusErrorText } from '../../utils/constants.tsx';
import RetryPrompt from '../common/error/RetryPrompt.tsx';
import SystemStatusIcon from './SystemStatusIcon';
import { useStackCheckStatusQuery } from './useStackStatusCheckQuery.ts';

interface DataType {
    key: React.Key;
    backendSystemType: backendSystemType;
    name: string;
    healthStatus: healthStatus;
    endpoint: string | undefined;
    details: string | undefined;
}

export default function HealthCheckStatus(): React.JSX.Element {
    let nameFilters: ColumnFilterItem[] = [];
    let backendSystemTypeFilters: ColumnFilterItem[] = [];
    let healthStatusFilters: ColumnFilterItem[] = [];
    let backendSystemStatusFilters: DataType[] = [];

    const updateBackendSystemStatusList = (backendSystemStatusList: BackendSystemStatus[]): void => {
        const currentBackendSystemStatusList: DataType[] = [];
        backendSystemStatusList.forEach(function (item, index) {
            const currentBackendSystemStatus = {
                key: String(index),
                backendSystemType: item.backendSystemType as backendSystemType,
                name: item.name,
                healthStatus: item.healthStatus as healthStatus,
                endpoint: item.endpoint,
                details: item.details,
            };
            currentBackendSystemStatusList.push(currentBackendSystemStatus);
        });
        backendSystemStatusFilters = currentBackendSystemStatusList;
    };

    const updateNameFilters = (backendSystemStatusList: BackendSystemStatus[]): void => {
        const filters: ColumnFilterItem[] = [];
        const nameSet = new Set<string>('');
        backendSystemStatusList.forEach((item: BackendSystemStatus) => {
            nameSet.add(item.name);
        });
        nameSet.forEach((name) => {
            const filter = {
                text: name,
                value: name,
            };
            filters.push(filter);
        });
        nameFilters = filters;
    };

    const updateBackendSystemTypeFilters = (backendSystemStatusList: BackendSystemStatus[]): void => {
        const filters: ColumnFilterItem[] = [];
        const backendSystemTypeSet = new Set<string>('');
        backendSystemStatusList.forEach((item: BackendSystemStatus) => {
            backendSystemTypeSet.add(item.backendSystemType);
        });
        backendSystemTypeSet.forEach((backendSystemType) => {
            const filter = {
                text: backendSystemType,
                value: backendSystemType,
            };
            filters.push(filter);
        });
        backendSystemTypeFilters = filters;
    };

    const updateHealthStatusFilters = (backendSystemStatusList: BackendSystemStatus[]): void => {
        const filters: ColumnFilterItem[] = [];
        const healthStatusSet = new Set<string>('');
        backendSystemStatusList.forEach((item: BackendSystemStatus) => {
            healthStatusSet.add(item.healthStatus);
        });
        healthStatusSet.forEach((healthStatus) => {
            const filter = {
                text: healthStatus,
                value: healthStatus,
            };
            filters.push(filter);
        });
        healthStatusFilters = filters;
    };
    const healthCheckQuery = useStackCheckStatusQuery();
    const refreshData = () => {
        void healthCheckQuery.refetch();
    };

    if (healthCheckQuery.isSuccess) {
        const rsp: StackStatus | undefined = healthCheckQuery.data;
        updateBackendSystemStatusList(rsp.backendSystemStatuses);
        updateNameFilters(rsp.backendSystemStatuses);
        updateBackendSystemTypeFilters(rsp.backendSystemStatuses);
        updateHealthStatusFilters(rsp.backendSystemStatuses);
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '20%',
            defaultSortOrder: 'descend',
            filters: nameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => {
                const name = record.name;
                return name.startsWith(value.toString());
            },
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Backend System Type',
            dataIndex: 'backendSystemType',
            width: '20%',
            filters: backendSystemTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => {
                const backendSystemType = record.backendSystemType;
                return backendSystemType.startsWith(value.toString());
            },
        },

        {
            title: 'Health Status',
            dataIndex: 'healthStatus',
            width: '20%',
            render: (_, record) => (
                <Space size='middle'>
                    <Button
                        className={appStyles.headerMenuButton}
                        icon={
                            <SystemStatusIcon
                                isSystemUp={record.healthStatus.valueOf() === healthStatus.OK.valueOf()}
                                isStatusLoading={healthCheckQuery.isLoading}
                            />
                        }
                    >
                        {record.healthStatus}
                    </Button>
                </Space>
            ),
            filters: healthStatusFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => {
                const healthStatus = record.healthStatus;
                return healthStatus.startsWith(value.toString());
            },
        },
        {
            title: 'Endpoint',
            dataIndex: 'endpoint',
        },
        {
            title: 'Details',
            dataIndex: 'details',
        },
    ];

    return (
        <>
            <div className={tableStyles.genericTableContainer}>
                <div className={healthStatusStyles.healthStatusRefresh}>
                    <Button
                        type='primary'
                        icon={<SyncOutlined />}
                        onClick={() => {
                            refreshData();
                        }}
                    >
                        refresh
                    </Button>
                </div>
                {healthCheckQuery.isError ? (
                    <RetryPrompt
                        error={healthCheckQuery.error}
                        retryRequest={refreshData}
                        errorMessage={healthCheckStatusErrorText}
                    />
                ) : (
                    <></>
                )}
                <Table columns={columns} dataSource={backendSystemStatusFilters} loading={healthCheckQuery.isLoading} />
            </div>
        </>
    );
}
