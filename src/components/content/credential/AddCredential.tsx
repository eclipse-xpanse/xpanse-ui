/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import { Button, Form, Input, InputNumber, Select, Table, Tooltip } from 'antd';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
    ApiError,
    CreateCredential,
    CredentialsManagementService,
    CredentialVariable,
    CredentialVariables,
    Response,
} from '../../../xpanse-api/generated';
import { CredentialTip } from './CredentialTip';
import { useOidcIdToken } from '@axa-fr/react-oidc';
import { getUserName } from '../../oidc/OidcConfig';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';

function AddCredential({
    getCredentials,
    onCancel,
}: {
    getCredentials: () => void;
    onCancel: () => void;
}): JSX.Element {
    const [form] = Form.useForm();
    const [currentCsp, setCurrentCsp] = useState<CredentialVariables.csp | undefined>(undefined);
    const [currentType, setCurrentType] = useState<CredentialVariables.type | undefined>(undefined);
    const [currentName, setCurrentName] = useState<string | undefined>(undefined);
    const [credentialTypeList, setCredentialTypeList] = useState<CredentialVariables.type[]>([]);
    const [nameList, setNameList] = useState<string[]>([]);
    const [credentialVariableList, setCredentialVariableList] = useState<CredentialVariable[]>([]);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const oidcToken: OidcIdToken = useOidcIdToken();
    const handleCspSelect = (cspName: CredentialVariables.csp) => {
        setCurrentCsp(cspName);

        setCurrentType(undefined);
        form.setFieldsValue({ type: undefined });

        setCurrentName(undefined);
        setNameList([]);
        form.setFieldsValue({ name: undefined });

        setCredentialVariableList([]);
        form.setFieldsValue({ variables: [] });
    };

    const clear = () => {
        setCurrentCsp(undefined);
        setCurrentType(undefined);
        setCurrentName(undefined);
        setNameList([]);
        setCredentialTypeList([]);
        setCredentialVariableList([]);
    };

    const handleCredentialTypeSelect = (type: CredentialVariables.type) => {
        setCurrentType(type);

        setCurrentName(undefined);
        form.setFieldsValue({ name: undefined });

        setCredentialVariableList([]);
        form.setFieldsValue({ variables: [] });
    };

    const handleCredentialNameSelect = (name: string) => {
        setCurrentName(name);
        form.setFieldsValue({ name: name });
    };

    useEffect(() => {
        if (currentCsp === undefined) {
            return;
        }
        void CredentialsManagementService.getCredentialTypesByCsp(currentCsp)
            .then((resp) => {
                if (resp.length > 0) {
                    setCredentialTypeList(resp as CredentialVariables.type[]);
                } else {
                    setCredentialTypeList([]);
                }
            })
            .catch((error: Error) => {
                setCredentialTypeList([]);
                console.log(error);
            });

        if (currentType === undefined) {
            return;
        }
        void CredentialsManagementService.getCredentialCapabilitiesByCsp(currentCsp, currentType)
            .then((resp: CredentialVariables[]) => {
                if (resp.length > 0) {
                    resp.forEach((credential: CredentialVariables) => {
                        names.push(credential.name);
                        if (
                            credential.csp === currentCsp &&
                            credential.type === currentType &&
                            credential.name === currentName
                        ) {
                            const credentialVariables: CredentialVariable[] = [];
                            credential.variables.forEach((credentialVariable) => {
                                credentialVariable.value = '';
                                credentialVariables.push(credentialVariable);
                            });
                            setCredentialVariableList(credentialVariables);
                            form.setFieldsValue({ variables: credentialVariables });
                        }
                    });
                    setNameList(names);
                } else {
                    setNameList([]);
                    setCredentialVariableList([]);
                    form.setFieldsValue({ variables: [] });
                }
            })
            .catch((error: Error) => {
                console.log(error);
                return [];
            });
        const names: string[] = [];

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCsp, currentType, currentName]);

    function setVariablesValue(index: number, e: ChangeEvent<HTMLInputElement>) {
        credentialVariableList[index].value = e.target.value;
        form.setFieldsValue({ variables: credentialVariableList });
    }

    const columns: ColumnsType<CredentialVariable> = [
        {
            title: 'name',
            dataIndex: 'name',
            ellipsis: {
                showTitle: false,
            },
            render: (value: string, record) =>
                record.isMandatory ? (
                    <Tooltip placement='topLeft' title={value}>
                        <span className={'add-credential-from-variables-value'}>*</span>
                        {value}
                    </Tooltip>
                ) : (
                    <Tooltip placement='topLeft' title={value}>
                        {value}
                    </Tooltip>
                ),
        },
        {
            title: 'value',
            dataIndex: 'value',
            render: (value: string, record, index) =>
                record.isMandatory ? (
                    <Form.Item
                        name='value'
                        rules={[
                            {
                                required: isContainsEmpty(credentialVariableList),
                                message: 'mandatory field',
                            },
                        ]}
                    >
                        {''}
                        {record.isSensitive ? (
                            <Input.Password
                                onChange={(e) => {
                                    setVariablesValue(index, e);
                                }}
                            />
                        ) : (
                            <Input
                                onChange={(e) => {
                                    setVariablesValue(index, e);
                                }}
                            />
                        )}
                    </Form.Item>
                ) : (
                    <Form.Item name='value'>
                        {''}
                        {record.isSensitive ? (
                            <Input.Password
                                onChange={(e) => {
                                    setVariablesValue(index, e);
                                }}
                            />
                        ) : (
                            <Input
                                onChange={(e) => {
                                    setVariablesValue(index, e);
                                }}
                            />
                        )}
                    </Form.Item>
                ),
        },
        {
            title: 'description',
            dataIndex: 'description',
            ellipsis: {
                showTitle: false,
            },
            render: (description: string) => (
                <Tooltip placement='topLeft' title={description}>
                    {description}
                </Tooltip>
            ),
        },
    ];

    const isContainsEmpty = (credentialVariableList: CredentialVariable[]) => {
        if (credentialVariableList.length === 0) {
            return false;
        }
        return credentialVariableList.some(
            (credentialVariable) => credentialVariable.isMandatory && !credentialVariable.value
        );
    };

    const submit = (createCredential: CreateCredential) => {
        if (!isContainsEmpty(createCredential.variables)) {
            const userName: string | null = getUserName(oidcToken.idTokenPayload as object);
            if (!userName) {
                return;
            }
            createCredential.xpanseUser = userName;
            void CredentialsManagementService.addCredential(createCredential)
                .then(() => {
                    getTipInfo('success', 'Adding Credential Successful.');
                })
                .catch((error: Error) => {
                    if (error instanceof ApiError && 'details' in error.body) {
                        const response: Response = error.body as Response;
                        getTipInfo('error', response.details.join());
                    } else {
                        getTipInfo('error', error.message);
                    }
                });
        }
    };

    const onReset = () => {
        clear();
        form.resetFields();
        getTipInfo(undefined, '');
    };

    const onRemove = () => {
        getTipInfo(undefined, '');
        onReset();
        onCancel();
        getCredentials();
    };

    const getTipInfo = (tipType: 'error' | 'success' | undefined, tipMessage: string) => {
        setTipType(tipType);
        setTipMessage(tipMessage);
    };

    return (
        <div className={'credential-from'}>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout='horizontal'
                style={{ maxWidth: 1000 }}
                onFinish={submit}
            >
                <CredentialTip type={tipType} msg={tipMessage} onRemove={onRemove}></CredentialTip>
                <div className={'credential-from-input'}>
                    <Form.Item label='Csp' name='csp' rules={[{ required: true, message: 'Please Select Csp!' }]}>
                        <Select onSelect={handleCspSelect}>
                            {Object.values(CredentialVariables.csp).map((csp: CredentialVariables.csp) => {
                                return (
                                    <Select.Option key={csp} value={csp}>
                                        {csp}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    {currentCsp && currentCsp.length > 0 ? (
                        <Form.Item
                            label='Type'
                            name='type'
                            rules={[{ required: true, message: 'Please Select The Type of Credential!' }]}
                        >
                            <Select onSelect={handleCredentialTypeSelect}>
                                {credentialTypeList.map((type: CredentialVariables.type) => {
                                    return (
                                        <Select.Option key={type} value={type}>
                                            {type}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                    {nameList.length > 0 ? (
                        <Form.Item
                            label='Name'
                            name='name'
                            rules={[{ required: true, message: 'Please Select The Name of Credential!' }]}
                        >
                            <Select onSelect={handleCredentialNameSelect}>
                                {nameList.map((name: string) => {
                                    return (
                                        <Select.Option key={name} value={name}>
                                            {name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                    <Form.Item label='Description' name='description'>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label='TimeToLive (In Seconds)' name='timeToLive'>
                        <InputNumber />
                    </Form.Item>
                    {credentialVariableList.length > 0 ? (
                        <Form.Item
                            label='Variables'
                            name='variables'
                            rules={[
                                {
                                    required: isContainsEmpty(credentialVariableList),
                                    message: 'Please Input The Variables of Credential!',
                                },
                            ]}
                        >
                            <Table pagination={false} columns={columns} dataSource={credentialVariableList}></Table>
                        </Form.Item>
                    ) : (
                        <></>
                    )}
                </div>
                <Form.Item className={'credential-from-button'}>
                    <Button type='primary' htmlType='submit'>
                        Add
                    </Button>
                    <Button htmlType='button' className={'add-credential-from-button-reset'} onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddCredential;
