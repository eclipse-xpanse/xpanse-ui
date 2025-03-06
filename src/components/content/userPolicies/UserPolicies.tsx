/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined, EditOutlined, PlusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Image, Modal, Popconfirm, Popover, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React, { useState } from 'react';
import policyStyles from '../../../styles/policies.module.css';
import tableButtonStyles from '../../../styles/table-buttons.module.css';
import tableStyles from '../../../styles/table.module.css';
import { UserPolicy, csp, name } from '../../../xpanse-api/generated';
import { userPoliciesManagementErrorText } from '../../utils/constants.tsx';
import { cspMap } from '../common/csp/CspLogo';
import RetryPrompt from '../common/error/RetryPrompt.tsx';
import { AddOrUpdateUserPolicy } from './AddOrUpdateUserPolicy.tsx';
import UserPolicyDeleteResultStatus from './delete/UserPolicyDeleteResultStatus.tsx';
import { useDeleteUserPolicyRequest } from './delete/useDeleteUserPolicyRequest';
import useListUserPoliciesManagementServiceQuery from './useListUserPoliciesManagementServiceQuery.ts';
import { updateCspFilters, updateEnabledFilters } from './userPoliciesParams.ts';

function UserPolicies(): React.JSX.Element {
    const [id, setId] = useState<string>('');
    const [currentPolicyService, setCurrentPolicyService] = useState<UserPolicy | undefined>(undefined);
    let cspFilters: ColumnFilterItem[] = [];
    let enabledFilters: ColumnFilterItem[] = [];
    let policiesManagementServiceList: UserPolicy[] = [];
    const listPoliciesManagementServiceQuery = useListUserPoliciesManagementServiceQuery();
    const [isOpenAddOrUpdatePolicyModal, setIsOpenAddOrUpdatePolicyModal] = useState<boolean>(false);

    const deletePoliciesManagementServiceRequest = useDeleteUserPolicyRequest();

    if (listPoliciesManagementServiceQuery.isSuccess) {
        cspFilters = updateCspFilters();
        enabledFilters = updateEnabledFilters();
        policiesManagementServiceList = listPoliciesManagementServiceQuery.data;
    }

    const columns: ColumnsType<UserPolicy> = [
        {
            title: 'Policy ID',
            dataIndex: 'userPolicyId',
        },
        {
            title: 'CSP',
            dataIndex: 'csp',
            filters: cspFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.csp.startsWith(value.toString()),
            render: (csp: csp, _) => {
                return (
                    <Space size='middle'>
                        <Image width={100} preview={false} src={cspMap.get(csp.valueOf() as name)?.logo} />
                    </Space>
                );
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
            title: 'Enabled',
            dataIndex: 'enabled',
            filters: enabledFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.enabled === value,
            render: (text, _) => {
                return text ? 'true' : 'false';
            },
        },
        {
            title: 'Content',
            dataIndex: 'policy',
            render: (_text: string, record: UserPolicy) => {
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
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: UserPolicy) => {
                return (
                    <>
                        <Space size='middle'>
                            <Button
                                type='primary'
                                icon={<EditOutlined />}
                                onClick={() => {
                                    updatePoliciesManagementService(record);
                                }}
                                disabled={
                                    id.length > 0 &&
                                    (deletePoliciesManagementServiceRequest.isPending ||
                                        deletePoliciesManagementServiceRequest.isSuccess ||
                                        deletePoliciesManagementServiceRequest.isError)
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
                                    deleteCurrentPolicy(record);
                                }}
                            >
                                <Button
                                    type='primary'
                                    icon={<CloseCircleOutlined />}
                                    loading={
                                        record.userPolicyId === id &&
                                        !deletePoliciesManagementServiceRequest.isSuccess &&
                                        deletePoliciesManagementServiceRequest.isError
                                    }
                                    disabled={
                                        id.length > 0 &&
                                        (deletePoliciesManagementServiceRequest.isPending ||
                                            deletePoliciesManagementServiceRequest.isSuccess ||
                                            deletePoliciesManagementServiceRequest.isError)
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

    const deleteCurrentPolicy = (record: UserPolicy) => {
        setId(record.userPolicyId);
        deletePoliciesManagementServiceRequest.mutate(record.userPolicyId);
    };

    const getDeleteCloseStatus = (isClose: boolean) => {
        if (isClose) {
            setId('');
            refreshPoliciesManagementServiceList();
        }
    };

    const refreshPoliciesManagementServiceList = () => {
        void listPoliciesManagementServiceQuery.refetch();
    };

    const addPoliciesManagementService = () => {
        setId('');
        setCurrentPolicyService(undefined);
        setIsOpenAddOrUpdatePolicyModal(true);
    };
    const closeAddOrUpdatePoliciesManagementServiceModal = () => {
        setIsOpenAddOrUpdatePolicyModal(false);
        refreshPoliciesManagementServiceList();
    };
    const updatePoliciesManagementService = (record: UserPolicy) => {
        setCurrentPolicyService(record);
        setIsOpenAddOrUpdatePolicyModal(true);
    };

    const getCancelUpdateStatus = (isCancelled: boolean) => {
        if (isCancelled) {
            setIsOpenAddOrUpdatePolicyModal(false);
            refreshPoliciesManagementServiceList();
        }
    };

    return (
        <>
            <div className={tableStyles.genericTableContainer}>
                {deletePoliciesManagementServiceRequest.isSuccess && id.length > 0 ? (
                    <UserPolicyDeleteResultStatus
                        id={id}
                        isError={deletePoliciesManagementServiceRequest.isError}
                        isSuccess={deletePoliciesManagementServiceRequest.isSuccess}
                        error={deletePoliciesManagementServiceRequest.error}
                        getDeleteCloseStatus={getDeleteCloseStatus}
                    />
                ) : null}
                <div className={tableButtonStyles.tableManageButtons}>
                    <div className={policyStyles.updatePolicy}>
                        <Button
                            type='primary'
                            onClick={refreshPoliciesManagementServiceList}
                            icon={<SyncOutlined />}
                            disabled={
                                id.length > 0 &&
                                (deletePoliciesManagementServiceRequest.isPending ||
                                    deletePoliciesManagementServiceRequest.isSuccess ||
                                    deletePoliciesManagementServiceRequest.isError)
                            }
                        >
                            refresh
                        </Button>
                    </div>

                    <div className={policyStyles.addPolicy}>
                        <Button
                            onClick={addPoliciesManagementService}
                            type='primary'
                            icon={<PlusCircleOutlined />}
                            disabled={
                                id.length > 0 &&
                                (deletePoliciesManagementServiceRequest.isPending ||
                                    deletePoliciesManagementServiceRequest.isSuccess ||
                                    deletePoliciesManagementServiceRequest.isError)
                            }
                        >
                            Add
                        </Button>
                    </div>
                </div>
                {listPoliciesManagementServiceQuery.isError ? (
                    <RetryPrompt
                        error={listPoliciesManagementServiceQuery.error}
                        retryRequest={refreshPoliciesManagementServiceList}
                        errorMessage={userPoliciesManagementErrorText}
                    />
                ) : (
                    <></>
                )}

                <Modal
                    title={currentPolicyService === undefined ? 'Add policy' : 'Update policy'}
                    width={1000}
                    footer={null}
                    open={isOpenAddOrUpdatePolicyModal}
                    destroyOnClose={true}
                    onCancel={closeAddOrUpdatePoliciesManagementServiceModal}
                >
                    <AddOrUpdateUserPolicy
                        currentPolicyService={currentPolicyService}
                        getCancelUpdateStatus={getCancelUpdateStatus}
                    />
                </Modal>
                <Table
                    columns={columns}
                    dataSource={policiesManagementServiceList}
                    rowKey={'id'}
                    loading={
                        listPoliciesManagementServiceQuery.isPending || listPoliciesManagementServiceQuery.isRefetching
                    }
                />
            </div>
        </>
    );
}

export default UserPolicies;
