/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Form, Input, InputNumber, Table, Tooltip } from 'antd';
import React, { ChangeEvent, useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import {
    ApiError,
    CreateCredential,
    CredentialsManagementService,
    CredentialVariable,
    Response,
} from '../../../xpanse-api/generated';
import { ColumnsType } from 'antd/es/table';
import '../../../styles/credential.css';
import { CredentialTip } from './CredentialTip';

function UpdateCredential({
    createCredential,
    getCredentials,
    onUpdateCancel,
}: {
    createCredential: CreateCredential;
    getCredentials: () => void;
    onUpdateCancel: () => void;
}): JSX.Element {
    const [form] = Form.useForm();
    const [credentialVariableList, setCredentialVariableList] = useState<CredentialVariable[]>([]);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);

    const setFormFields = (createCredential: CreateCredential) => {
        form.setFieldsValue({ name: createCredential.name });
        form.setFieldsValue({ csp: createCredential.csp });
        form.setFieldsValue({ description: createCredential.description });
        form.setFieldsValue({ type: createCredential.type });
        form.setFieldsValue({ variables: createCredential.variables });
        form.setFieldsValue({ timeToLive: createCredential.timeToLive });
    };

    const submit = (createCredential: CreateCredential) => {
        if (!isContainsEmpty(createCredential.variables)) {
            void CredentialsManagementService.updateCredential(createCredential)
                .then(() => {
                    getTipInfo('success', 'Updating Credential Successful.');
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

    const setVariablesValue = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        credentialVariableList[index].value = e.target.value;
        form.setFieldsValue({ variables: credentialVariableList });
        setCredentialVariableList(credentialVariableList);
        createCredential.variables = credentialVariableList;
    };

    useEffect(() => {
        setFormFields(createCredential);
        setCredentialVariableList(createCredential.variables);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCredential]);

    const onRemove = () => {
        getTipInfo(undefined, '');
        onUpdateCancel();
        getCredentials();
    };

    const getTipInfo = (tipType: 'error' | 'success' | undefined, tipMessage: string) => {
        setTipType(tipType);
        setTipMessage(tipMessage);
    };

    const isContainsEmpty = (credentialVariableList: CredentialVariable[]) => {
        return credentialVariableList.some(
            (credentialVariable) => credentialVariable.isMandatory && !credentialVariable.value
        );
    };

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
                            <Tooltip title='Actual value for sensitive fields are not available'>
                                <Input.Password
                                    onChange={(e) => {
                                        setVariablesValue(index, e);
                                    }}
                                />
                            </Tooltip>
                        ) : (
                            <Input
                                defaultValue={record.value}
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
                            <Tooltip title='Actual value for sensitive fields are not available'>
                                <Input.Password
                                    onChange={(e) => {
                                        setVariablesValue(index, e);
                                    }}
                                />
                            </Tooltip>
                        ) : (
                            <Input
                                defaultValue={record.value}
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

    return (
        <div className={'credential-from'}>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout='horizontal'
                style={{ maxWidth: 1200 }}
                onFinish={submit}
            >
                <CredentialTip type={tipType} msg={tipMessage} onRemove={onRemove}></CredentialTip>
                <div className={'credential-from-input'}>
                    <Form.Item label='Csp' name='csp'>
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item label='Type' name='type'>
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item label='Name' name='name'>
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item label='Description' name='description'>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label='TimeToLive (In Seconds)' name='timeToLive'>
                        <InputNumber />
                    </Form.Item>
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
                </div>
                <Form.Item className={'credential-from-button'}>
                    <Button type='primary' htmlType='submit'>
                        Update
                    </Button>
                    <Button
                        htmlType='button'
                        className={'update-credential-from-button-cancel'}
                        onClick={onUpdateCancel}
                    >
                        cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UpdateCredential;
