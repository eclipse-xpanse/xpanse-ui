/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Alert, Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ApiError, BackendSystemStatus, Response, SystemStatus } from '../../../xpanse-api/generated';
import { SyncOutlined } from '@ant-design/icons';
import SystemStatusIcon from './SystemStatusIcon';
import { ColumnFilterItem } from 'antd/es/table/interface';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { useHealthCheckStatusQuery } from './useHealthCheckStatusQuery';
import '../../../styles/health_status.css';

interface DataType {
    key: React.Key;
    backendSystemType: BackendSystemStatus.backendSystemType;
    name: string;
    healthStatus: BackendSystemStatus.healthStatus;
    endpoint: string | undefined;
    details: string | undefined;
}

export const HealthCheckStatus = (): React.JSX.Element => {
    let nameFilters: ColumnFilterItem[] = [];
    let backendSystemTypeFilters: ColumnFilterItem[] = [];
    let healthStatusFilters: ColumnFilterItem[] = [];
    let healthCheckError: React.JSX.Element = <></>;
    let backendSystemStatusFilters: DataType[] = [];

    const updateBackendSystemStatusList = (backendSystemStatusList: BackendSystemStatus[]): void => {
        const currentBackendSystemStatusList: DataType[] = [];
        backendSystemStatusList.forEach(function (item, index) {
            const currentBackendSystemStatus = {
                key: String(index),
                backendSystemType: item.backendSystemType,
                name: item.name,
                healthStatus: item.healthStatus,
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
    const healthCheckQuery = useHealthCheckStatusQuery();

    if (healthCheckQuery.isSuccess) {
        const rsp: SystemStatus | undefined = healthCheckQuery.data;
        updateBackendSystemStatusList(rsp.backendSystemStatuses);
        updateNameFilters(rsp.backendSystemStatuses);
        updateBackendSystemTypeFilters(rsp.backendSystemStatuses);
        updateHealthStatusFilters(rsp.backendSystemStatuses);
    }

    if (healthCheckQuery.isError) {
        backendSystemStatusFilters = [];
        if (
            healthCheckQuery.error instanceof ApiError &&
            healthCheckQuery.error.body &&
            'details' in healthCheckQuery.error.body
        ) {
            const response: Response = healthCheckQuery.error.body as Response;
            healthCheckError = (
                <div className={'health-refresh-alert-tip'}>
                    <Alert
                        message={response.resultType.valueOf()}
                        description={convertStringArrayToUnorderedList(response.details)}
                        type={'error'}
                        closable={true}
                    />
                </div>
            );
        } else {
            healthCheckError = (
                <div className={'health-refresh-alert-tip'}>
                    <Alert
                        message='Fetching Health Check Status Failed'
                        description={healthCheckQuery.error.message}
                        type={'error'}
                        closable={true}
                    />
                </div>
            );
        }
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
                        className={'header-menu-button'}
                        icon={
                            <SystemStatusIcon
                                isSystemUp={record.healthStatus.valueOf() === SystemStatus.healthStatus.OK.valueOf()}
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

    const refreshData = () => {
        healthCheckError = <></>;
        void healthCheckQuery.refetch();
    };

    return (
        <>
            <div className={'generic-table-container'}>
                {healthCheckQuery.isError ? healthCheckError : undefined}
                <div className={'health-status-refresh'}>
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
                <Table columns={columns} dataSource={backendSystemStatusFilters} loading={healthCheckQuery.isLoading} />
            </div>
        </>
    );
};
