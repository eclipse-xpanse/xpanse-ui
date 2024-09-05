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
import { useMutation } from '@tanstack/react-query';
import { Button, Image, Modal, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { v4 } from 'uuid';
import tableButtonStyles from '../../../styles/table-buttons.module.css';
import tableStyles from '../../../styles/table.module.css';
import {
    AbstractCredentialInfo,
    ApiError,
    CredentialVariables,
    DeleteIsvCloudCredentialData,
    DeleteUserCloudCredentialData,
    Response,
    csp,
    deleteIsvCloudCredential,
    deleteUserCloudCredential,
    name,
} from '../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../layouts/header/useCurrentRoleStore';
import { cspMap } from '../common/csp/CspLogo';
import AddCredential from './AddCredential';
import CredentialDetails from './CredentialDetails';
import { CredentialTip } from './CredentialTip';
import UpdateCredential from './UpdateCredential';
import useCredentialsListQuery from './query/queryCredentialsList';

function Credentials(): React.JSX.Element {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    let tipMessage: string = '';
    let tipType: 'error' | 'success' | undefined = undefined;
    let abstractCredentialInfoList: AbstractCredentialInfo[] = [];
    const [activeCredential, setActiveCredential] = useState<CredentialVariables | undefined>(undefined);
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);

    const credentialsQuery = useCredentialsListQuery();

    if (credentialsQuery.isSuccess) {
        const credentials: AbstractCredentialInfo[] = credentialsQuery.data;
        if (credentials.length > 0) {
            abstractCredentialInfoList = credentials;
        } else {
            abstractCredentialInfoList = [];
        }
    }

    if (credentialsQuery.isError) {
        if (
            credentialsQuery.error instanceof ApiError &&
            credentialsQuery.error.body &&
            typeof credentialsQuery.error.body === 'object' &&
            'details' in credentialsQuery.error.body
        ) {
            const response: Response = credentialsQuery.error.body as Response;
            tipType = 'error';
            tipMessage = response.details.join();
        } else if (credentialsQuery.error instanceof Error) {
            tipType = 'error';
            tipMessage = credentialsQuery.error.message;
        }
    }

    const deleteCredentialRequest = useMutation({
        mutationFn: (credentialVariables: CredentialVariables) => deleteCredentialByRole(credentialVariables),
        onSuccess: () => {
            tipType = 'success';
            tipMessage = 'Deleting Credentials Successful.';
            void credentialsQuery.refetch();
        },
        onError: (error: Error) => {
            if (error instanceof ApiError && error.body && typeof error.body === 'object' && 'details' in error.body) {
                const response: Response = error.body as Response;
                tipType = 'error';
                tipMessage = response.details.join();
            } else {
                tipType = 'error';
                tipMessage = error.message;
            }
        },
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

    const onRemove = () => {
        tipMessage = '';
        tipType = undefined;
    };

    return (
        <div className={tableStyles.genericTableContainer}>
            <CredentialTip key={v4().toString()} type={tipType} msg={tipMessage} onRemove={onRemove}></CredentialTip>
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
