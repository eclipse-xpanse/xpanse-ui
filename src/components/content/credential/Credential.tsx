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
import { Button, Modal, Popconfirm, Space, Table } from 'antd';
import { FullscreenOutlined, InfoCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
    AbstractCredentialInfo,
    ApiError,
    CreateCredential,
    CredentialsManagementService,
    CredentialVariable,
    CredentialVariables,
    Response,
} from '../../../xpanse-api/generated';
import { useOidcIdToken } from '@axa-fr/react-oidc';
import { getUserName } from '../../oidc/OidcConfig';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';

function Credential(): JSX.Element {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [abstractCredentialInfoList, setAbstractCredentialInfoList] = useState<AbstractCredentialInfo[]>([]);
    const [credentialDetails, setCredentialDetails] = useState<CredentialVariable[]>([]);
    const [createCredential, setCreateCredential] = useState<CreateCredential>({
        csp: '' as CredentialVariables.csp,
        description: '',
        name: '',
        timeToLive: 0,
        type: '' as CredentialVariables.type,
        variables: [],
        xpanseUser: '',
    });
    const oidcIdToken: OidcIdToken = useOidcIdToken();

    const columns: ColumnsType<AbstractCredentialInfo> = [
        {
            title: 'Csp',
            dataIndex: 'csp',
        },
        {
            title: 'User',
            dataIndex: 'xpanseUser',
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
            render: (text: string, record: AbstractCredentialInfo) => {
                return (
                    <>
                        <Space size='middle'>
                            <Button type='primary' icon={<FullscreenOutlined />} onClick={() => details(record)}>
                                Details
                            </Button>
                            <Popconfirm
                                title='Delete the Credential'
                                description='Are you sure to delete the Credential?'
                                okText='Yes'
                                cancelText='No'
                                onConfirm={() => deleteCredential(record)}
                            >
                                <Button type='primary' icon={<MinusCircleOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                            <Button
                                type='primary'
                                icon={<InfoCircleOutlined />}
                                onClick={() => updateCredential(record)}
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

    const deleteCredential = (credentialVariables: CredentialVariables) => {
        void CredentialsManagementService.deleteCredential(
            credentialVariables.csp,
            credentialVariables.xpanseUser,
            credentialVariables.type
        )
            .then(() => {
                getTipInfo('success', 'Deleting Credential Successful.');
                getCredentials();
            })
            .catch((error: Error) => {
                if (error instanceof ApiError && 'details' in error.body) {
                    const response: Response = error.body as Response;
                    getTipInfo('error', response.details.join());
                } else {
                    getTipInfo('error', error.message);
                }
            });
    };

    const updateCredential = (abstractCredentialInfo: AbstractCredentialInfo) => {
        const credentialVariables: CredentialVariables = abstractCredentialInfo;
        const userName: string | null = getUserName(oidcIdToken.idTokenPayload as object);
        if (!userName) {
            return;
        }
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
            xpanseUser: userName,
            description: credentialVariables.description,
            variables: credentialVariableLists,
            timeToLive: (abstractCredentialInfo as CreateCredential).timeToLive,
        };
        setCreateCredential(createCredential);
        setIsUpdateOpen(true);
    };

    const details = (credentialVariables: CredentialVariables) => {
        setIsDetailsOpen(true);
        setCredentialDetails(credentialVariables.variables);
    };

    function getCredentials(): void {
        const userName: string | null = getUserName(oidcIdToken.idTokenPayload as object);
        if (!userName) {
            return;
        }
        void CredentialsManagementService.getCredentialsByUser(userName)
            .then((abstractCredentialInfoList) => {
                if (abstractCredentialInfoList.length > 0) {
                    setAbstractCredentialInfoList(abstractCredentialInfoList);
                } else {
                    setAbstractCredentialInfoList([]);
                }
            })
            .catch((error: Error) => {
                setAbstractCredentialInfoList([]);
                console.log(error);
            });
    }

    useEffect(() => {
        getCredentials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCancel = () => {
        setIsAddOpen(false);
        getCredentials();
    };

    const onUpdateCancel = () => {
        setIsUpdateOpen(false);
        getCredentials();
    };

    const onDetailsCancel = () => {
        setIsDetailsOpen(false);
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
                    <AddCredential onCancel={onCancel} getCredentials={getCredentials} />
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
                        createCredential={createCredential}
                        onUpdateCancel={onUpdateCancel}
                        getCredentials={getCredentials}
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
                    icon={<PlusCircleOutlined />}
                    onClick={() => addCredential()}
                >
                    Add
                </Button>
                <Table columns={columns} dataSource={abstractCredentialInfoList} />
            </div>
        </div>
    );
}

export default Credential;
