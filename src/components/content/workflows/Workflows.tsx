/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ApiError, Response, WorkflowService, WorkFlowTask } from '../../../xpanse-api/generated';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { WorkflowsTip } from './WorkflowsTip';
import useAllTasksQuery from './query/useAllTasksQuery';
import { useMutation } from '@tanstack/react-query';

function Workflows(): React.JSX.Element {
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [isRefresh, setIsRefresh] = useState(false);
    const [todoTasks, setTodoTasks] = useState<WorkFlowTask[]>([]);

    const tasksQuery = useAllTasksQuery(undefined);

    useEffect(() => {
        const workflowTasks: WorkFlowTask[] | undefined = tasksQuery.data;
        if (workflowTasks !== undefined && workflowTasks.length > 0) {
            setTodoTasks(workflowTasks);
        } else {
            setTodoTasks([]);
        }
    }, [tasksQuery.data, tasksQuery.isSuccess]);

    useEffect(() => {
        if (tasksQuery.error instanceof ApiError && tasksQuery.error.body && 'details' in tasksQuery.error.body) {
            const response: Response = tasksQuery.error.body as Response;
            getTipInfo('error', response.details.join());
        } else if (tasksQuery.error instanceof Error) {
            getTipInfo('error', tasksQuery.error.message);
        }
        setIsRefresh(false);
    }, [tasksQuery.error]);

    const completeFailedTasksQuery = useMutation({
        mutationFn: (taskId: string) => WorkflowService.manageFailedOrder(taskId, true),
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
            if (error instanceof ApiError && error.body && 'details' in error.body) {
                const response: Response = error.body as Response;
                getTipInfo('error', response.details.join());
            } else {
                getTipInfo('error', error.message);
            }
        },
    });

    const closeFailedTasksQuery = useMutation({
        mutationFn: (taskId: string) => WorkflowService.manageFailedOrder(taskId, false),
        onSuccess: () => {
            getTipInfo('success', 'Failed workflow is closed successfully. Please create a new request if necessary.');
            setIsRefresh(false);
            void tasksQuery.refetch();
        },
        onError: (error: Error) => {
            setIsRefresh(false);
            if (error instanceof ApiError && error.body && 'details' in error.body) {
                const response: Response = error.body as Response;
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

    const getTipInfo = (tipType: 'error' | 'success' | undefined, tipMessage: string) => {
        setTipType(tipType);
        setTipMessage(tipMessage);
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
            render: (taskName: string, WorkFlowTask) => {
                return <Tag color='blue'>{taskName}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: WorkFlowTask.status, record: WorkFlowTask) => {
                if (status === WorkFlowTask.status.FAILED) {
                    return (
                        <Tag bordered={false} icon={<CloseCircleOutlined />} color='error'>
                            {status.valueOf()}
                        </Tag>
                    );
                } else {
                    return (
                        <Tag bordered={false} icon={<CheckCircleOutlined />} color='success'>
                            {status.valueOf()}
                        </Tag>
                    );
                }
            },
        },
        {
            title: 'CreateTime',
            dataIndex: 'createTime',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: WorkFlowTask) => {
                if (record.status === WorkFlowTask.status.FAILED) {
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
        <div className={'generic-table-container'}>
            <WorkflowsTip type={tipType} msg={tipMessage} onRemove={onRemove}></WorkflowsTip>
            <div className={'policy-manage-buttons-container'}>
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
