/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React from 'react';
import serviceModifyStyles from '../../../../styles/service-modify.module.css';
import {
    DeployedServiceDetails,
    DeployRequest,
    ErrorResponse,
    ServiceOrderDetails,
    taskStatus,
    taskType,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import useListServiceOrdersHistoryQuery from './query/useListServiceModifyHistoryQuery.ts';

const { Text } = Typography;

export const MyServiceHistory = ({
    deployedService,
}: {
    deployedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    let orderIdFilters: ColumnFilterItem[] = [];
    let taskTypeFilters: ColumnFilterItem[] = [];
    let taskStatusFilters: ColumnFilterItem[] = [];
    let serviceOrdersHistoryList: ServiceOrderDetails[] = [];
    const listServiceOrdersHistoryQuery = useListServiceOrdersHistoryQuery(deployedService.serviceId);

    if (listServiceOrdersHistoryQuery.isSuccess && listServiceOrdersHistoryQuery.data.length > 0) {
        serviceOrdersHistoryList = listServiceOrdersHistoryQuery.data;
        updateOrderIdFilters(listServiceOrdersHistoryQuery.data);
        updateTaskTypeFilters();
        updateTaskStatusFilters();
    }

    function updateOrderIdFilters(resp: ServiceOrderDetails[]): void {
        const filters: ColumnFilterItem[] = [];
        resp.forEach((respItem) => {
            const filter = {
                text: respItem.orderId,
                value: respItem.orderId,
            };
            filters.push(filter);
        });
        orderIdFilters = filters;
    }

    function updateTaskTypeFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(taskType).forEach((taskTypeItem) => {
            const filter = {
                text: taskTypeItem,
                value: taskTypeItem,
            };
            filters.push(filter);
        });
        taskTypeFilters = filters;
    }

    function updateTaskStatusFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(taskStatus).forEach((taskStatusItem) => {
            const filter = {
                text: taskStatusItem,
                value: taskStatusItem,
            };
            filters.push(filter);
        });
        taskStatusFilters = filters;
    }

    const columns: ColumnsType<ServiceOrderDetails> = [
        {
            title: 'OrderId',
            dataIndex: 'orderId',
            align: 'center',
            width: 120,
            className: serviceModifyStyles.modifyHistoryValue,
            filters: orderIdFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.orderId.startsWith(value.toString()),
        },
        {
            title: 'TaskType',
            dataIndex: 'taskType',
            align: 'center',
            width: 100,
            className: serviceModifyStyles.modifyHistoryValue,
            filters: taskTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.taskType.startsWith(value.toString()),
            render: (value: taskType) => {
                return <div className={serviceModifyStyles.serviceHistoryValue}>{value}</div>;
            },
        },
        {
            title: 'Previous',
            dataIndex: 'previousDeployRequest',
            width: 300,
            className: serviceModifyStyles.modifyHistoryValue,
            align: 'center',
            render: (value: DeployRequest) => {
                return (
                    <ul className={serviceModifyStyles.modifyHistoryValueLi}>
                        <li>
                            <Text strong>Customer Service Name:</Text>&nbsp;{value.customerServiceName}
                        </li>
                        {value.serviceRequestProperties ? (
                            <li>
                                <Text strong>Service Request Properties:</Text>&nbsp;
                                {JSON.stringify(value.serviceRequestProperties)}
                            </li>
                        ) : (
                            <></>
                        )}
                    </ul>
                );
            },
        },
        {
            title: 'New',
            dataIndex: 'newDeployRequest',
            className: serviceModifyStyles.modifyHistoryValue,
            align: 'center',
            width: 300,
            render: (value: DeployRequest) => {
                return (
                    <ul className={serviceModifyStyles.modifyHistoryValueLi}>
                        <li>
                            <Text strong>Customer Service Name:</Text>&nbsp;{value.customerServiceName}
                        </li>
                        {value.serviceRequestProperties ? (
                            <li>
                                <Text strong>Service Request Properties:</Text>&nbsp;
                                {JSON.stringify(value.serviceRequestProperties)}
                            </li>
                        ) : (
                            <></>
                        )}
                    </ul>
                );
            },
        },
        {
            title: 'StartedTime',
            dataIndex: 'startedTime',
            align: 'center',
            width: 150,
            defaultSortOrder: 'descend',
            sorter: (serviceOrderDetailsA, serviceOrderDetailsB): number => {
                if (serviceOrderDetailsA.startedTime && serviceOrderDetailsB.startedTime) {
                    return (
                        new Date(serviceOrderDetailsA.startedTime).getTime() -
                        new Date(serviceOrderDetailsB.startedTime).getTime()
                    );
                }
                return 0;
            },
        },
        {
            title: 'CompletedTime',
            dataIndex: 'completedTime',
            align: 'center',
            width: 150,
            sorter: (serviceOrderDetailsA, serviceOrderDetailsB): number => {
                if (serviceOrderDetailsA.completedTime && serviceOrderDetailsB.completedTime) {
                    return (
                        new Date(serviceOrderDetailsA.completedTime).getTime() -
                        new Date(serviceOrderDetailsB.completedTime).getTime()
                    );
                }
                return 0;
            },
        },
        {
            title: 'TaskStatus',
            dataIndex: 'taskStatus',
            align: 'center',
            width: 50,
            filters: taskStatusFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.taskStatus.startsWith(value.toString()),
            render: (value) => {
                if (value === taskStatus.FAILED) {
                    return (
                        <Tag icon={<QuestionCircleOutlined />} color={'error'}>
                            {value}
                        </Tag>
                    );
                } else if (value === taskStatus.SUCCESSFUL) {
                    return (
                        <Tag icon={<CheckCircleOutlined />} color={'success'}>
                            {value}
                        </Tag>
                    );
                } else {
                    return (
                        <Tag icon={<MinusCircleOutlined />} color={'default'}>
                            {value}
                        </Tag>
                    );
                }
            },
        },
        {
            title: 'Failure Reason',
            dataIndex: 'errorResponse',
            align: 'center',
            width: 150,
            render: (value: ErrorResponse | undefined) => {
                if (value) {
                    return (
                        <Popover
                            content={<pre className={serviceModifyStyles.serviceOrderErrorText}>{value.details}</pre>}
                            title={value.errorType}
                            trigger='hover'
                        >
                            <Button className={serviceModifyStyles.serviceOrderErrorDataHover} type={'link'}>
                                {'error response'}
                            </Button>
                        </Popover>
                    );
                }
            },
        },
    ];

    return (
        <div className={serviceModifyStyles.modifyContainer}>
            <Table
                columns={columns}
                dataSource={serviceOrdersHistoryList}
                loading={listServiceOrdersHistoryQuery.isPending || listServiceOrdersHistoryQuery.isRefetching}
                rowKey={'id'}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};
