/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Popover, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React from 'react';
import serviceOperationStyles from '../../../../styles/service-operation.module.css';
import {
    DeployedServiceDetails,
    ErrorResponse,
    OrderStatus,
    ServiceOrderDetails,
    ServiceOrderType,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { ShowId } from '../../order/common/ShowId.tsx';
import { MyServiceHistoryDetails } from './MyServiceHistoryDetails.tsx';
import useListServiceOrdersHistoryQuery from './query/useListServiceModifyHistoryQuery.ts';

export const MyServiceHistory = ({
    deployedService,
}: {
    deployedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    let orderIdFilters: ColumnFilterItem[] = [];
    let taskTypeFilters: ColumnFilterItem[] = [];
    let orderStatusFilters: ColumnFilterItem[] = [];
    let serviceOrdersHistoryList: ServiceOrderDetails[] = [];
    const listServiceOrdersHistoryQuery = useListServiceOrdersHistoryQuery(deployedService.serviceId);

    if (
        listServiceOrdersHistoryQuery.isSuccess &&
        listServiceOrdersHistoryQuery.data &&
        listServiceOrdersHistoryQuery.data.length > 0
    ) {
        serviceOrdersHistoryList = listServiceOrdersHistoryQuery.data;
        updateOrderIdFilters(listServiceOrdersHistoryQuery.data);
        updateTaskTypeFilters();
        updateorderStatusFilters();
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
        Object.values(ServiceOrderType).forEach((taskTypeItem) => {
            const filter = {
                text: taskTypeItem,
                value: taskTypeItem,
            };
            filters.push(filter);
        });
        taskTypeFilters = filters;
    }

    function updateorderStatusFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(OrderStatus).forEach((orderStatusItem) => {
            const filter = {
                text: orderStatusItem,
                value: orderStatusItem,
            };
            filters.push(filter);
        });
        orderStatusFilters = filters;
    }

    const columns: ColumnsType<ServiceOrderDetails> = [
        {
            title: 'OrderId',
            dataIndex: 'orderId',
            align: 'center',
            width: 100,
            filters: orderIdFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.orderId.startsWith(value.toString()),
            render: (value: string) => {
                return <ShowId id={value} />;
            },
        },
        {
            title: 'TaskType',
            dataIndex: 'taskType',
            align: 'center',
            width: 100,
            filters: taskTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.taskType.startsWith(value.toString()),
        },
        {
            title: 'Details',
            dataIndex: 'details',
            width: 100,
            align: 'center',
            render: (_, record) => {
                return (
                    <div>
                        <Popover
                            content={<MyServiceHistoryDetails record={record} />}
                            title={'Details'}
                            trigger='hover'
                        >
                            <Button className={serviceOperationStyles.serviceOrderErrorDataHover} type={'link'}>
                                {'details'}
                            </Button>
                        </Popover>
                    </div>
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
            title: 'orderStatus',
            dataIndex: 'orderStatus',
            align: 'center',
            width: 50,
            filters: orderStatusFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.orderStatus.startsWith(value.toString()),
            render: (value) => {
                if (value === OrderStatus.FAILED) {
                    return (
                        <Tag icon={<CloseCircleOutlined />} color={'error'}>
                            {value}
                        </Tag>
                    );
                } else if (value === OrderStatus.SUCCESSFUL) {
                    return (
                        <Tag icon={<CheckCircleOutlined />} color={'success'}>
                            {value}
                        </Tag>
                    );
                } else if (value === OrderStatus.IN_PROGRESS) {
                    return (
                        <Tag icon={<SyncOutlined />} color={'orange'}>
                            {value}
                        </Tag>
                    );
                } else {
                    return (
                        <Tag icon={<ClockCircleOutlined />} color={'default'}>
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
            width: 100,
            render: (value: ErrorResponse | undefined) => {
                if (value) {
                    return (
                        <Popover
                            content={
                                <pre className={serviceOperationStyles.serviceOrderErrorText}>{value.details}</pre>
                            }
                            title={value.errorType}
                            trigger='hover'
                        >
                            <Button className={serviceOperationStyles.serviceOrderErrorDataHover} type={'link'}>
                                {'failure reason'}
                            </Button>
                        </Popover>
                    );
                }
            },
        },
    ];

    return (
        <div className={serviceOperationStyles.orderOperationContainer}>
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
