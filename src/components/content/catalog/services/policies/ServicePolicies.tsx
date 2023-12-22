/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Modal, Popconfirm, Popover, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ServicePolicy } from '../../../../../xpanse-api/generated';
import { CloseCircleOutlined, EditOutlined, PlusCircleOutlined, SafetyOutlined, SyncOutlined } from '@ant-design/icons';
import { useGetServicePolicyList } from './policyList/useGetServicePolicyList';
import { useDeleteServicePolicy } from './deletePolicy/useDeleteServicePolicy';
import { AddOrUpdateServicePolicy } from './AddOrUpdateServicePolicy';
import ServicePolicyDeleteStatus from './deletePolicy/ServicePolicyDeleteStatus';
import ServicePolicyListError from './ServicePolicyListError';
import { ColumnFilterItem } from 'antd/es/table/interface';
import '../../../../../styles/service_policies.css';

export const ServicePolicies = ({ serviceTemplateId }: { serviceTemplateId: string }) => {
    const [id, setId] = useState<string>('');
    const [currentServicePolicy, setCurrentServicePolicy] = useState<ServicePolicy | undefined>(undefined);
    const [isOpenAddOrUpdatePolicyModal, setIsOpenAddOrUpdatePolicyModal] = useState<boolean>(false);

    const servicePolicyListQuery = useGetServicePolicyList(serviceTemplateId);
    const deleteServicePolicyRequest = useDeleteServicePolicy();

    const refreshServicePoliciesList = () => {
        void servicePolicyListQuery.refetch();
    };

    useEffect(() => {
        setId('');
        refreshServicePoliciesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceTemplateId]);

    if (servicePolicyListQuery.isError) {
        return <ServicePolicyListError error={servicePolicyListQuery.error} />;
    }

    const updateEnabledFilters = (): ColumnFilterItem[] => {
        const filters: ColumnFilterItem[] = [];

        [true, false].forEach((enabled) => {
            const filter = {
                text: String(enabled),
                value: enabled,
            };
            filters.push(filter);
        });

        return filters;
    };

    const columns: ColumnsType<ServicePolicy> = [
        {
            title: 'Policy ID',
            dataIndex: 'id',
        },
        {
            title: 'Content',
            dataIndex: 'policy',
            render: (_text: string, record: ServicePolicy) => {
                return (
                    <Popover
                        content={
                            <pre>
                                {' '}
                                <div className={'policy-content-hover'}>{record.policy.toString()}</div>
                            </pre>
                        }
                        title={'Policy Content'}
                        trigger='hover'
                    >
                        <Button className={'policy-data-hover'} type={'link'}>{`policy`}</Button>
                    </Popover>
                );
            },
        },
        {
            title: 'Enabled',
            dataIndex: 'enabled',
            filters: updateEnabledFilters(),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.enabled === value,
            render: (text, _) => {
                return text ? 'true' : 'false';
            },
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.createTime.length - b.createTime.length,
            sortDirections: ['descend'],
        },
        {
            title: 'LastModifiedAt',
            dataIndex: 'lastModifiedTime',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: ServicePolicy) => {
                return (
                    <>
                        <Space size='middle'>
                            <Button
                                type='primary'
                                icon={<EditOutlined />}
                                onClick={() => {
                                    updateServicePolicies(record);
                                }}
                                disabled={
                                    id.length > 0 &&
                                    (deleteServicePolicyRequest.isPending ||
                                        deleteServicePolicyRequest.isSuccess ||
                                        deleteServicePolicyRequest.isError)
                                }
                            >
                                Update
                            </Button>
                            <Popconfirm
                                title='Delete the policy'
                                description='Are you sure to delete the policy?'
                                cancelText='Yes'
                                okText='No'
                                onCancel={() => {
                                    deleteCurrentServicePolicy(record);
                                }}
                            >
                                <Button
                                    type='primary'
                                    icon={<CloseCircleOutlined />}
                                    loading={
                                        record.id === id &&
                                        !deleteServicePolicyRequest.isSuccess &&
                                        deleteServicePolicyRequest.isError
                                    }
                                    disabled={
                                        id.length > 0 &&
                                        (deleteServicePolicyRequest.isPending ||
                                            deleteServicePolicyRequest.isSuccess ||
                                            deleteServicePolicyRequest.isError)
                                    }
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Space>
                    </>
                );
            },
        },
    ];

    const deleteCurrentServicePolicy = (record: ServicePolicy) => {
        setId(record.id);
        deleteServicePolicyRequest.mutate(record.id);
    };

    const addServicePolicies = () => {
        setId('');
        setCurrentServicePolicy(undefined);
        setIsOpenAddOrUpdatePolicyModal(true);
    };

    const updateServicePolicies = (record: ServicePolicy) => {
        setCurrentServicePolicy(record);
        setIsOpenAddOrUpdatePolicyModal(true);
    };

    const closeAddOrUpdateServicePolicyModal = () => {
        setIsOpenAddOrUpdatePolicyModal(false);
        refreshServicePoliciesList();
    };

    const getCancelUpdateStatus = (isCancelled: boolean) => {
        if (isCancelled) {
            setIsOpenAddOrUpdatePolicyModal(false);
            refreshServicePoliciesList();
        }
    };

    const getDeleteCloseStatus = (isClose: boolean) => {
        if (isClose) {
            setId('');
            refreshServicePoliciesList();
        }
    };

    return (
        <>
            <h3 className={'catalog-service-policies-title-h3'}>
                <SafetyOutlined />
                &nbsp;Service Policies
            </h3>
            {deleteServicePolicyRequest.isSuccess && id.length > 0 ? (
                <ServicePolicyDeleteStatus
                    id={id}
                    isError={deleteServicePolicyRequest.isError}
                    isSuccess={deleteServicePolicyRequest.isSuccess}
                    error={deleteServicePolicyRequest.error}
                    getDeleteCloseStatus={getDeleteCloseStatus}
                />
            ) : null}
            <Modal
                title={currentServicePolicy === undefined ? 'Add service policy' : 'Update service policy'}
                width={1000}
                footer={null}
                open={isOpenAddOrUpdatePolicyModal}
                destroyOnClose={true}
                onCancel={closeAddOrUpdateServicePolicyModal}
            >
                <AddOrUpdateServicePolicy
                    serviceTemplateId={serviceTemplateId}
                    currentServicePolicy={currentServicePolicy}
                    getCancelUpdateStatus={getCancelUpdateStatus}
                />
            </Modal>
            <Table
                columns={columns}
                className={'service-policies-table'}
                dataSource={
                    servicePolicyListQuery.data !== undefined && servicePolicyListQuery.data.length > 0
                        ? servicePolicyListQuery.data
                        : []
                }
                rowKey={'id'}
                loading={servicePolicyListQuery.isPending || servicePolicyListQuery.isRefetching}
            />
            <div className={'service-policies-container'}>
                <Button
                    type='primary'
                    className={'refresh-service-policy'}
                    onClick={refreshServicePoliciesList}
                    icon={<SyncOutlined />}
                    disabled={
                        id.length > 0 &&
                        (deleteServicePolicyRequest.isPending ||
                            deleteServicePolicyRequest.isSuccess ||
                            deleteServicePolicyRequest.isError)
                    }
                >
                    Refresh
                </Button>

                <Button
                    onClick={() => {
                        addServicePolicies();
                    }}
                    type='primary'
                    className={'add-service-policy'}
                    icon={<PlusCircleOutlined />}
                    disabled={
                        id.length > 0 &&
                        (deleteServicePolicyRequest.isPending ||
                            deleteServicePolicyRequest.isSuccess ||
                            deleteServicePolicyRequest.isError)
                    }
                >
                    Add
                </Button>
            </div>
        </>
    );
};
