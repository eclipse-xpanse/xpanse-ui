/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import AddCredential from './AddCredential';
import UpdateCredential from './UpdateCredential';
import { CredentialTip } from './CredentialTip';
import CredentialDetails from './CredentialDetails';
import { Button, Image, Modal, Popconfirm, Space, Table } from 'antd';
import {
    FullscreenOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import {
    AbstractCredentialInfo,
    ApiError,
    CloudServiceProvider,
    CreateCredential,
    CredentialsManagementService,
    CredentialVariable,
    CredentialVariables,
    Response,
} from '../../../xpanse-api/generated';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCurrentUserRoleStore } from '../../layouts/header/useCurrentRoleStore';
import { cspMap } from '../common/csp/CspLogo';

function Credential(): React.JSX.Element {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [abstractCredentialInfoList, setAbstractCredentialInfoList] = useState<AbstractCredentialInfo[]>([]);
    const [credentialDetails, setCredentialDetails] = useState<CredentialVariable[]>([]);
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    const [createCredential, setCreateCredential] = useState<CreateCredential>({
        csp: '' as CredentialVariables.csp,
        description: '',
        name: '',
        timeToLive: 0,
        type: '' as CredentialVariables.type,
        variables: [],
    });

    const credentialsQuery = useQuery({
        queryKey: ['credentialsQuery', currentRole],
        queryFn: () => getCredentialsByRole(),
        staleTime: 60000,
    });
    const getCredentialsByRole = () => {
        if (currentRole === 'user') {
            return CredentialsManagementService.getUserCloudCredentials();
        } else if (currentRole === 'isv') {
            return CredentialsManagementService.getIsvCloudCredentials();
        } else {
            return [];
        }
    };

    useEffect(() => {
        const credentials: AbstractCredentialInfo[] | undefined = credentialsQuery.data;
        if (credentials !== undefined && credentials.length > 0) {
            setAbstractCredentialInfoList(credentials);
        } else {
            setAbstractCredentialInfoList([]);
        }
        getTipInfo(undefined, '');
    }, [credentialsQuery.data, credentialsQuery.isSuccess]);

    useEffect(() => {
        if (credentialsQuery.error instanceof ApiError && 'details' in credentialsQuery.error.body) {
            const response: Response = credentialsQuery.error.body as Response;
            getTipInfo('error', response.details.join());
        } else if (credentialsQuery.error instanceof Error) {
            getTipInfo('error', credentialsQuery.error.message);
        }
    }, [credentialsQuery.error]);

    const deleteCredentialRequest = useMutation({
        mutationFn: (credentialVariables: CredentialVariables) => deleteCredentialByRole(credentialVariables),
        onSuccess: () => {
            getTipInfo('success', 'Deleting Credential Successful.');
            setIsRefresh(false);
            void credentialsQuery.refetch();
        },
        onError: (error: Error) => {
            if (error instanceof ApiError && 'details' in error.body) {
                const response: Response = error.body as Response;
                getTipInfo('error', response.details.join());
            } else {
                getTipInfo('error', error.message);
            }
        },
    });

    const deleteCredentialByRole = (credentialVariables: CredentialVariables) => {
        if (currentRole === 'user') {
            return CredentialsManagementService.deleteUserCloudCredential(
                credentialVariables.csp,
                credentialVariables.type,
                credentialVariables.name
            );
        } else {
            return CredentialsManagementService.deleteIsvCloudCredential(
                credentialVariables.csp,
                credentialVariables.type,
                credentialVariables.name
            );
        }
    };

    const columns: ColumnsType<AbstractCredentialInfo> = [
        {
            title: 'Csp',
            dataIndex: 'csp',
            render: (csp: AbstractCredentialInfo.csp, _) => {
                return (
                    <Space size='middle'>
                        <Image
                            width={100}
                            preview={false}
                            src={cspMap.get(csp.valueOf() as CloudServiceProvider.name)?.logo}
                        />
                    </Space>
                );
            },
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
                                title='Delete the Credential'
                                description='Are you sure to delete the Credential?'
                                okText='Yes'
                                cancelText='No'
                                onConfirm={() => {
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
        setIsRefresh(false);
        getTipInfo(undefined, '');
    };

    const refresh = () => {
        setIsRefresh(true);
        void credentialsQuery.refetch();
    };

    const updateCredential = (abstractCredentialInfo: AbstractCredentialInfo) => {
        const credentialVariables: CredentialVariables = abstractCredentialInfo;
        const credentialVariableList: CredentialVariable[] = credentialVariables.variables;
        const credentialVariableLists: CredentialVariable[] = [];
        credentialVariableList.forEach((credentialVariable) => {
            if (credentialVariable.isSensitive) {
                credentialVariable.value = '';
            }
            credentialVariableLists.push(credentialVariable);
        });
        const createCredential: CreateCredential = {
            name: credentialVariables.name,
            type: credentialVariables.type,
            csp: credentialVariables.csp,
            description: credentialVariables.description,
            variables: credentialVariableLists,
            timeToLive: (abstractCredentialInfo as CreateCredential).timeToLive,
        };
        setCreateCredential(createCredential);
        setIsRefresh(false);
        setIsUpdateOpen(true);
        getTipInfo(undefined, '');
    };

    const details = (credentialVariables: CredentialVariables) => {
        setIsDetailsOpen(true);
        getTipInfo(undefined, '');
        setCredentialDetails(credentialVariables.variables);
    };

    const onCancel = () => {
        setIsAddOpen(false);
        setIsRefresh(false);
        onRemove();
        void credentialsQuery.refetch();
    };

    const onUpdateCancel = () => {
        setIsUpdateOpen(false);
        setIsRefresh(false);
        onRemove();
        void credentialsQuery.refetch();
    };

    const onDetailsCancel = () => {
        setIsDetailsOpen(false);
        onRemove();
    };

    const onRemove = () => {
        getTipInfo(undefined, '');
    };

    const getTipInfo = (tipType: 'error' | 'success' | undefined, tipMessage: string) => {
        setTipType(tipType);
        setTipMessage(tipMessage);
    };

    return (
        <div>
            <CredentialTip type={tipType} msg={tipMessage} onRemove={onRemove}></CredentialTip>
            <div>
                <Modal
                    width={1000}
                    title='Add Credential'
                    open={isAddOpen}
                    onCancel={onCancel}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={[]}
                >
                    <AddCredential role={currentRole} onCancel={onCancel} credentialsQuery={credentialsQuery} />
                </Modal>
                <Modal
                    width={1000}
                    title='Update Credential'
                    open={isUpdateOpen}
                    onCancel={onUpdateCancel}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={[]}
                >
                    <UpdateCredential
                        role={currentRole}
                        createCredential={createCredential}
                        onUpdateCancel={onUpdateCancel}
                        credentialsQuery={credentialsQuery}
                    />
                </Modal>
                <Modal
                    width={1000}
                    title='Credential Details'
                    open={isDetailsOpen}
                    onCancel={onDetailsCancel}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={[]}
                >
                    <CredentialDetails credentialDetails={credentialDetails} />
                </Modal>
            </div>
            <div>
                <Button
                    className={'add-credential-from-button'}
                    type='primary'
                    loading={isRefresh && (credentialsQuery.isLoading || credentialsQuery.isRefetching)}
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refresh();
                    }}
                >
                    refresh
                </Button>
                <Button
                    className={'add-credential-from-button'}
                    type='primary'
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                        addCredential();
                    }}
                >
                    Add
                </Button>
                <Table
                    columns={columns}
                    loading={credentialsQuery.isLoading || credentialsQuery.isRefetching}
                    dataSource={abstractCredentialInfoList}
                />
            </div>
        </div>
    );
}

export default Credential;
