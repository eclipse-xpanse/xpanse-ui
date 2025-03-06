/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import tableButtonStyles from '../../../styles/table-buttons.module.css';
import tableStyles from '../../../styles/table.module.css';
import {
    ErrorResponse,
    manageFailedOrder,
    type ManageFailedOrderData,
    taskStatus,
    WorkFlowTask,
} from '../../../xpanse-api/generated';
import { workflowTasksErrorText } from '../../utils/constants.tsx';
import RetryPrompt from '../common/error/RetryPrompt.tsx';
import { isHandleKnownErrorResponse } from '../common/error/isHandleKnownErrorResponse.ts';
import { WorkflowsTip } from './WorkflowsTip';
import useAllTasksQuery, { getAllTasksQueryKey } from './query/useAllTasksQuery';

function Workflows(): React.JSX.Element {
    const queryClient = useQueryClient();
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [isRefresh, setIsRefresh] = useState(false);
    let todoTasks: WorkFlowTask[] = [];

    const tasksQuery = useAllTasksQuery(undefined);

    const retryRequest = () => {
        void queryClient.refetchQueries({
            queryKey: getAllTasksQueryKey(undefined),
        });
    };

    if (tasksQuery.isSuccess) {
        todoTasks = tasksQuery.data;
    }

    const getTipInfo = (tipType: 'error' | 'success' | undefined, tipMessage: string) => {
        setTipType(tipType);
        setTipMessage(tipMessage);
    };

    const completeFailedTasksQuery = useMutation({
        mutationFn: (taskId: string) => {
            const data: ManageFailedOrderData = {
                taskId: taskId,
                retryOrder: true,
            };
            return manageFailedOrder(data);
        },
        onSuccess: () => {
            getTipInfo(
                'success',
                'Retry request is submitted successfully. Check MyServices page to view the status of the order.'
            );
            setIsRefresh(false);
            void tasksQuery.refetch();
        },
        onError: (error: Error) => {
            setIsRefresh(false);
            if (isHandleKnownErrorResponse(error)) {
                const response: ErrorResponse = error.body;
                getTipInfo('error', response.details.join());
            } else {
                getTipInfo('error', error.message);
            }
        },
    });

    const closeFailedTasksQuery = useMutation({
        mutationFn: (taskId: string) => {
            const data: ManageFailedOrderData = {
                taskId: taskId,
                retryOrder: false,
            };
            return manageFailedOrder(data);
        },
        onSuccess: () => {
            getTipInfo('success', 'Failed workflow is closed successfully. Please create a new request if necessary.');
            setIsRefresh(false);
            void tasksQuery.refetch();
        },
        onError: (error: Error) => {
            setIsRefresh(false);
            if (isHandleKnownErrorResponse(error)) {
                const response: ErrorResponse = error.body;
                getTipInfo('error', response.details.join());
            } else {
                getTipInfo('error', error.message);
            }
        },
    });

    const refresh = () => {
        setIsRefresh(true);
        void tasksQuery.refetch();
        onRemove();
    };

    const onRemove = () => {
        getTipInfo(undefined, '');
    };

    const columns: ColumnsType<WorkFlowTask> = [
        {
            title: 'ProcessInstanceId',
            dataIndex: 'processInstanceId',
        },
        {
            title: 'WorkflowType',
            dataIndex: 'processInstanceName',
        },
        {
            title: 'TaskId',
            dataIndex: 'taskId',
        },
        {
            title: 'TaskName',
            dataIndex: 'taskName',
            render: (taskName: string) => {
                return <Tag color='blue'>{taskName}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'taskStatus',
            render: (workflowStatus: taskStatus) => {
                if (workflowStatus === taskStatus.FAILED) {
                    return (
                        <Tag bordered={false} icon={<CloseCircleOutlined />} color='error'>
                            {workflowStatus.valueOf()}
                        </Tag>
                    );
                } else {
                    return (
                        <Tag bordered={false} icon={<CheckCircleOutlined />} color='success'>
                            {workflowStatus.valueOf()}
                        </Tag>
                    );
                }
            },
        },
        {
            title: 'CreateTime',
            dataIndex: 'createdTime',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: WorkFlowTask) => {
                if (record.taskStatus === 'failed') {
                    return (
                        <>
                            <Space size='middle'>
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        completeFailedTasksQuery.mutate(record.taskId);
                                    }}
                                >
                                    retry
                                </Button>

                                <Button
                                    type='primary'
                                    onClick={() => {
                                        closeFailedTasksQuery.mutate(record.taskId);
                                    }}
                                >
                                    close
                                </Button>
                            </Space>
                        </>
                    );
                }
            },
        },
    ];

    return (
        <div className={tableStyles.genericTableContainer}>
            <div className={tableButtonStyles.tableManageButtons}>
                <Button
                    type='primary'
                    loading={isRefresh && (tasksQuery.isLoading || tasksQuery.isRefetching)}
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refresh();
                    }}
                >
                    refresh
                </Button>
            </div>
            <WorkflowsTip type={tipType} msg={tipMessage} onRemove={onRemove}></WorkflowsTip>
            {tasksQuery.isError ? (
                <RetryPrompt
                    error={tasksQuery.error}
                    retryRequest={retryRequest}
                    errorMessage={workflowTasksErrorText}
                />
            ) : (
                <></>
            )}

            <Table
                columns={columns}
                dataSource={todoTasks}
                loading={tasksQuery.isLoading || tasksQuery.isRefetching}
                rowKey={'processInstanceId'}
            />
        </div>
    );
}

export default Workflows;
