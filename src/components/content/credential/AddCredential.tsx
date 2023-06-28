/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import { usernameKey } from '../../utils/constants';
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
    const [credentialTypeList, setCredentialTypeList] = useState<CredentialVariables.type[]>([]);
    const [credentialVariableList, setCredentialVariableList] = useState<CredentialVariable[]>([]);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const handleCspSelect = (cspName: CredentialVariables.csp) => {
        setCurrentCsp(cspName);
    };

    const clear = () => {
        setCurrentCsp(undefined);
        setCurrentType(undefined);
        setCredentialTypeList([]);
        setCredentialVariableList([]);
    };

    const handleCredentialTypeSelect = (type: CredentialVariables.type) => {
        setCurrentType(type);
        form.setFieldsValue({ variables: [] });
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
            .then((resp) => {
                if (resp.length > 0) {
                    const credentialVariables: CredentialVariables = resp[0] as CredentialVariables;
                    const credentialVariableList: CredentialVariable[] = [];
                    credentialVariables.variables.forEach((credentialVariable) => {
                        credentialVariable.value = '';
                        credentialVariableList.push(credentialVariable);
                    });
                    setCredentialVariableList(credentialVariableList);
                    form.setFieldsValue({ variables: credentialVariableList });
                } else {
                    setCredentialVariableList([]);
                    form.setFieldsValue({ variables: [] });
                }
            })
            .catch((error: Error) => {
                setCredentialVariableList([]);
                form.setFieldsValue({ variables: [] });
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCsp, currentType]);

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
            render: (value, record) =>
                record.isMandatory ? (
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    <Tooltip placement='topLeft' title={value}>
                        <span className={'add-credential-from-variables-value'}>*</span>
                        {value}
                    </Tooltip>
                ) : (
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    <Tooltip placement='topLeft' title={value}>
                        {value}
                    </Tooltip>
                ),
        },
        {
            title: 'value',
            dataIndex: 'value',
            render: (value, record, index) =>
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
            render: (description) => (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
            //const createCredential: CreateCredential = credentialVariables as CreateCredential;
            const userName: string | null = localStorage.getItem(usernameKey);
            if (userName === null) {
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
                    <Form.Item label='Name' name='name' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

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
                    <Form.Item label='Description' name='description'>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label='TimeToLive (In Seconds)' name='timeToLive'>
                        <InputNumber />
                    </Form.Item>
                    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                    {credentialVariableList && credentialVariableList.length > 0 ? (
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
