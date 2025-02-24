/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined, EditOutlined, PlusCircleOutlined, SafetyOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React, { useState } from 'react';
import policyStyles from '../../../../../styles/policies.module.css';
import servicePolicyStyles from '../../../../../styles/service-policies.module.css';
import { ServicePolicy, ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { AddOrUpdateServicePolicy } from './AddOrUpdateServicePolicy';
import ServicePolicyListError from './ServicePolicyListError';
import ServicePolicyDeleteStatus from './deletePolicy/ServicePolicyDeleteStatus';
import { useDeleteServicePolicy } from './deletePolicy/useDeleteServicePolicy';
import { useGetServicePolicyList } from './policyList/useGetServicePolicyList';

export const ServicePolicies = ({
    serviceDetails,
    isViewDisabled,
}: {
    serviceDetails: ServiceTemplateDetailVo;
    isViewDisabled: boolean;
}) => {
    const [currentPolicyId, setCurrentPolicyId] = useState<string>('');
    const [currentServicePolicy, setCurrentServicePolicy] = useState<ServicePolicy | undefined>(undefined);
    const [isOpenAddOrUpdatePolicyModal, setIsOpenAddOrUpdatePolicyModal] = useState<boolean>(false);

    const servicePolicyListQuery = useGetServicePolicyList(serviceDetails.serviceTemplateId);
    const deleteServicePolicyRequest = useDeleteServicePolicy();

    const refreshServicePoliciesList = () => {
        void servicePolicyListQuery.refetch();
    };

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
            dataIndex: 'servicePolicyId',
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
                                <div className={policyStyles.policyContentHover}>{record.policy.toString()}</div>
                            </pre>
                        }
                        title={'Policy Content'}
                        trigger='hover'
                    >
                        <Button className={policyStyles.policyDataHover} type={'link'}>{`policy`}</Button>
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
            dataIndex: 'createdTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.createdTime.length - b.createdTime.length,
            sortDirections: ['descend'],
        },
        {
            title: 'LastModifiedAt',
            dataIndex: 'lastModifiedTime',
        },
        {
            title: 'Flavors',
            dataIndex: 'flavors',
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
                                    isViewDisabled ||
                                    (currentPolicyId.length > 0 &&
                                        (deleteServicePolicyRequest.isPending || deleteServicePolicyRequest.isSuccess))
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
                                        record.servicePolicyId === currentPolicyId &&
                                        !deleteServicePolicyRequest.isSuccess &&
                                        deleteServicePolicyRequest.isError
                                    }
                                    disabled={
                                        isViewDisabled ||
                                        (currentPolicyId.length > 0 &&
                                            (deleteServicePolicyRequest.isPending ||
                                                deleteServicePolicyRequest.isSuccess))
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
        setCurrentPolicyId(record.servicePolicyId);
        deleteServicePolicyRequest.mutate(record.servicePolicyId);
    };

    const addServicePolicies = () => {
        setCurrentPolicyId('');
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
            setCurrentPolicyId('');
            refreshServicePoliciesList();
        }
    };

    return (
        <>
            <h3 className={servicePolicyStyles.catalogServicePoliciesTitleH3}>
                <SafetyOutlined />
                &nbsp;Service Policies
            </h3>
            {deleteServicePolicyRequest.isSuccess && currentPolicyId.length > 0 ? (
                <ServicePolicyDeleteStatus
                    id={currentPolicyId}
                    isError={deleteServicePolicyRequest.isError}
                    isSuccess={deleteServicePolicyRequest.isSuccess}
                    error={deleteServicePolicyRequest.error}
                    getDeleteCloseStatus={getDeleteCloseStatus}
                />
            ) : null}
            <div className={servicePolicyStyles.servicePoliciesContainer}>
                <Button
                    type='primary'
                    className={servicePolicyStyles.refreshServicePolicy}
                    onClick={refreshServicePoliciesList}
                    icon={<SyncOutlined />}
                    disabled={
                        isViewDisabled ||
                        (currentPolicyId.length > 0 &&
                            (deleteServicePolicyRequest.isPending ||
                                deleteServicePolicyRequest.isSuccess ||
                                deleteServicePolicyRequest.isError))
                    }
                >
                    Refresh
                </Button>

                <Button
                    onClick={() => {
                        addServicePolicies();
                    }}
                    type='primary'
                    className={servicePolicyStyles.addServicePolicy}
                    icon={<PlusCircleOutlined />}
                    disabled={
                        isViewDisabled ||
                        (currentPolicyId.length > 0 &&
                            (deleteServicePolicyRequest.isPending ||
                                deleteServicePolicyRequest.isSuccess ||
                                deleteServicePolicyRequest.isError))
                    }
                >
                    Add
                </Button>
            </div>
            {servicePolicyListQuery.isError ? <ServicePolicyListError error={servicePolicyListQuery.error} /> : <></>}
            <Modal
                title={currentServicePolicy === undefined ? 'Add service policy' : 'Update service policy'}
                width={1000}
                footer={null}
                open={isOpenAddOrUpdatePolicyModal}
                destroyOnClose={true}
                onCancel={closeAddOrUpdateServicePolicyModal}
            >
                <AddOrUpdateServicePolicy
                    serviceTemplateId={serviceDetails.serviceTemplateId}
                    currentServicePolicy={currentServicePolicy}
                    getCancelUpdateStatus={getCancelUpdateStatus}
                    serviceDetails={serviceDetails}
                />
            </Modal>
            <Table
                columns={columns}
                className={servicePolicyStyles.servicePoliciesTable}
                dataSource={
                    servicePolicyListQuery.data !== undefined && servicePolicyListQuery.data.length > 0
                        ? servicePolicyListQuery.data
                        : []
                }
                rowKey={'id'}
                loading={servicePolicyListQuery.isPending || servicePolicyListQuery.isRefetching}
            />
        </>
    );
};
