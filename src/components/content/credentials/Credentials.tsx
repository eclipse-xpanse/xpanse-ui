/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    FullscreenOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Image, Modal, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import tableButtonStyles from '../../../styles/table-buttons.module.css';
import tableStyles from '../../../styles/table.module.css';
import {
    AbstractCredentialInfo,
    CredentialVariables,
    csp,
    deleteIsvCloudCredential,
    DeleteIsvCloudCredentialData,
    deleteUserCloudCredential,
    DeleteUserCloudCredentialData,
    name,
} from '../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../layouts/header/useCurrentRoleStore';
import { credentialsErrorText } from '../../utils/constants.tsx';
import { cspMap } from '../common/csp/CspLogo';
import RetryPrompt from '../common/error/RetryPrompt.tsx';
import AddCredential from './AddCredential';
import CredentialDetails from './CredentialDetails';
import CredentialProcessStatus from './CredentialProcessStatus.tsx';
import UpdateCredential from './UpdateCredential';
import useCredentialsListQuery, { getCredentialsListQueryKey } from './query/queryCredentialsList';

function Credentials(): React.JSX.Element {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    let abstractCredentialInfoList: AbstractCredentialInfo[] = [];
    const [activeCredential, setActiveCredential] = useState<CredentialVariables | undefined>(undefined);
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);

    const queryClient = useQueryClient();

    const credentialsQuery = useCredentialsListQuery();

    const retryRequest = () => {
        void queryClient.refetchQueries({
            queryKey: getCredentialsListQueryKey(currentRole),
        });
    };

    if (credentialsQuery.isSuccess) {
        const credentials: AbstractCredentialInfo[] = credentialsQuery.data;
        if (credentials.length > 0) {
            abstractCredentialInfoList = credentials;
        } else {
            abstractCredentialInfoList = [];
        }
    }

    const deleteCredentialRequest = useMutation({
        mutationFn: (credentialVariables: CredentialVariables) => deleteCredentialByRole(credentialVariables),
    });

    const deleteCredentialByRole = (credentialVariables: CredentialVariables) => {
        if (currentRole === 'user') {
            const data: DeleteUserCloudCredentialData = {
                cspName: credentialVariables.csp,
                siteName: credentialVariables.site,
                type: credentialVariables.type,
                name: credentialVariables.name,
            };
            return deleteUserCloudCredential(data);
        } else {
            const data: DeleteIsvCloudCredentialData = {
                cspName: credentialVariables.csp,
                siteName: credentialVariables.site,
                type: credentialVariables.type,
                name: credentialVariables.name,
            };
            return deleteIsvCloudCredential(data);
        }
    };

    const columns: ColumnsType<AbstractCredentialInfo> = [
        {
            title: 'Csp',
            dataIndex: 'csp',
            render: (csp: csp, _) => {
                return (
                    <Space size='middle'>
                        <Image width={100} preview={false} src={cspMap.get(csp.valueOf() as name)?.logo} />
                    </Space>
                );
            },
        },
        {
            title: 'Site',
            dataIndex: 'site',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'TimeToLive (In Seconds)',
            dataIndex: 'timeToLive',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: AbstractCredentialInfo) => {
                return (
                    <>
                        <Space size='middle'>
                            <Button
                                type='primary'
                                icon={<FullscreenOutlined />}
                                onClick={() => {
                                    details(record);
                                }}
                            >
                                Details
                            </Button>
                            <Popconfirm
                                title='Delete the Credentials'
                                description='Are you sure to delete the Credentials?'
                                okText='No'
                                cancelText='Yes'
                                onCancel={() => {
                                    deleteCredentialRequest.mutate(record);
                                }}
                            >
                                <Button type='primary' icon={<MinusCircleOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                            <Button
                                type='primary'
                                icon={<InfoCircleOutlined />}
                                onClick={() => {
                                    updateCredential(record);
                                }}
                            >
                                Update
                            </Button>
                        </Space>
                    </>
                );
            },
        },
    ];

    const addCredential = () => {
        setIsAddOpen(true);
    };

    const refresh = () => {
        void credentialsQuery.refetch();
    };

    const updateCredential = (credentialVariables: CredentialVariables) => {
        setActiveCredential(credentialVariables);
        setIsUpdateOpen(true);
    };

    const details = (credentialVariables: CredentialVariables) => {
        setIsDetailsOpen(true);
        setActiveCredential(credentialVariables);
    };

    const onCancel = () => {
        setIsAddOpen(false);
        setActiveCredential(undefined);
        void credentialsQuery.refetch();
    };

    const onUpdateCancel = () => {
        setIsUpdateOpen(false);
        setActiveCredential(undefined);
        void credentialsQuery.refetch();
    };

    const onDetailsCancel = () => {
        setActiveCredential(undefined);
        setIsDetailsOpen(false);
    };

    const getCloseStatus = (isClose: boolean) => {
        if (isClose) {
            void credentialsQuery.refetch();
        }
    };

    return (
        <div className={tableStyles.genericTableContainer}>
            <div>
                {/* this condition will unmount and mount the modal completely. So that the old values are not retained. */}
                {isAddOpen ? (
                    <Modal
                        width={1000}
                        title='Add Credentials'
                        open={isAddOpen}
                        onCancel={onCancel}
                        maskClosable={false}
                        destroyOnClose={true}
                        footer={[]}
                        forceRender={true}
                    >
                        <AddCredential role={currentRole} onCancel={onCancel} />
                    </Modal>
                ) : null}
                <Modal
                    width={1000}
                    title='Update Credentials'
                    open={isUpdateOpen}
                    onCancel={onUpdateCancel}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={[]}
                >
                    {activeCredential ? (
                        <UpdateCredential
                            key={activeCredential.csp}
                            role={currentRole}
                            credentialVariables={activeCredential}
                            onUpdateCancel={onUpdateCancel}
                        />
                    ) : null}
                </Modal>
                <Modal
                    width={1000}
                    title='Credentials Details'
                    open={isDetailsOpen}
                    onCancel={onDetailsCancel}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={[]}
                >
                    {activeCredential ? (
                        <CredentialDetails key={activeCredential.csp} credentialDetails={activeCredential.variables} />
                    ) : null}
                </Modal>
            </div>
            <div>
                <div className={tableButtonStyles.tableManageButtons}>
                    <Button
                        type='primary'
                        loading={credentialsQuery.isLoading || credentialsQuery.isRefetching}
                        icon={<SyncOutlined />}
                        onClick={() => {
                            refresh();
                        }}
                    >
                        refresh
                    </Button>
                    <Button
                        type='primary'
                        icon={<PlusCircleOutlined />}
                        onClick={() => {
                            addCredential();
                        }}
                    >
                        Add
                    </Button>
                </div>
                {credentialsQuery.isError ? (
                    <RetryPrompt
                        error={credentialsQuery.error}
                        retryRequest={retryRequest}
                        errorMessage={credentialsErrorText}
                    />
                ) : (
                    <></>
                )}
                {deleteCredentialRequest.isSuccess || deleteCredentialRequest.isError ? (
                    <CredentialProcessStatus
                        isError={deleteCredentialRequest.isError}
                        isSuccess={deleteCredentialRequest.isSuccess}
                        successMsg={'Credentials Deleted Successfully.'}
                        error={deleteCredentialRequest.error}
                        getCloseStatus={getCloseStatus}
                    />
                ) : null}
                <Table
                    columns={columns}
                    loading={credentialsQuery.isLoading || credentialsQuery.isRefetching}
                    dataSource={abstractCredentialInfoList}
                    rowKey={(record) => `${record.csp}-${record.site}-${record.type}-${record.name}`}
                />
            </div>
        </div>
    );
}

export default Credentials;
