/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Button, Form, Image, Input, InputNumber, Table, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import styles from '../../../styles/credential.module.css';
import {
    ApiError,
    CreateCredential,
    CredentialVariable,
    CredentialVariables,
    ErrorResponse,
    credentialType,
    csp,
    name,
    updateIsvCloudCredential,
    updateUserCloudCredential,
    type UpdateIsvCloudCredentialData,
    type UpdateUserCloudCredentialData,
} from '../../../xpanse-api/generated';
import { cspMap } from '../common/csp/CspLogo';
import { isErrorResponse } from '../common/error/isErrorResponse';
import { CredentialApiDoc } from './CredentialApiDoc';
import { CredentialTip } from './CredentialTip';
import useCredentialsListQuery from './query/queryCredentialsList';

function UpdateCredential({
    role,
    credentialVariables,
    onUpdateCancel,
}: {
    role: string | undefined;
    credentialVariables: CredentialVariables;
    onUpdateCancel: () => void;
}): React.JSX.Element {
    const [form] = Form.useForm();
    const credentialVariablesCopy: CredentialVariables = credentialVariables;
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);

    // Copy necessary to replace already masked values with empty string to avoid user to misunderstand.
    credentialVariablesCopy.variables.forEach((credentialVariable) => {
        if (credentialVariable.isSensitive) {
            credentialVariable.value = '';
        }
    });
    const credentialsQuery = useCredentialsListQuery();

    // useEffect necessary since the form is updated after the first rendering is completed.
    // Also, necessary to avoid changing state during render
    useEffect(() => {
        form.setFieldsValue({ name: credentialVariablesCopy.name });
        form.setFieldsValue({ site: credentialVariablesCopy.site });
        form.setFieldsValue({ csp: credentialVariablesCopy.csp });
        form.setFieldsValue({ description: credentialVariablesCopy.description });
        form.setFieldsValue({ type: credentialVariablesCopy.type });
        form.setFieldsValue({ variables: credentialVariablesCopy.variables });
        form.setFieldsValue({ timeToLive: (credentialVariablesCopy as CreateCredential).timeToLive });
    }, [form, credentialVariablesCopy]);

    const updateCredentialRequest = useMutation({
        mutationFn: (createCredential: CreateCredential) => updateCredentialByRole(createCredential),
        onSuccess: () => {
            setTipType('success');
            setTipMessage('Updating Credential Successful.');
        },
        onError: (error: Error) => {
            if (error instanceof ApiError && error.body && isErrorResponse(error.body)) {
                const response: ErrorResponse = error.body;
                setTipType('error');
                setTipMessage(response.details.join());
            } else {
                setTipType('error');
                setTipMessage(error.message);
            }
        },
    });

    const updateCredentialByRole = useCallback(
        (createCredential: CreateCredential) => {
            if (role === 'user') {
                const data: UpdateUserCloudCredentialData = {
                    requestBody: createCredential,
                };
                return updateUserCloudCredential(data);
            } else {
                const data: UpdateIsvCloudCredentialData = {
                    requestBody: createCredential,
                };
                return updateIsvCloudCredential(data);
            }
        },
        [role]
    );

    const submit = (createCredential: CreateCredential) => {
        if (!isContainsEmpty(createCredential.variables)) {
            // necessary to create the object again since the values sent from form contains each credential variable also as parent key in JSON.
            // It must be only in the variables map.
            const createCredentialRequest: CreateCredential = {
                csp: createCredential.csp,
                site: createCredential.site,
                description: createCredential.description,
                name: createCredential.name,
                type: createCredential.type,
                timeToLive: createCredential.timeToLive,
                variables: createCredential.variables,
            };
            updateCredentialRequest.mutate(createCredentialRequest);
        }
    };

    const setVariablesValue = (variableName: string, e: ChangeEvent<HTMLInputElement>) => {
        credentialVariablesCopy.variables.forEach((credentialVariable) => {
            if (credentialVariable.name === variableName) {
                credentialVariable.value = e.target.value;
            }
        });
        form.setFieldsValue({ variables: credentialVariablesCopy.variables });
    };

    const onRemove = () => {
        setTipType(undefined);
        setTipMessage('');
        onUpdateCancel();
        void credentialsQuery.refetch();
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
                        <span className={styles.addCredentialFormVariablesValue}>*</span>
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
            render: (value: string, record) =>
                record.isMandatory ? (
                    <Form.Item
                        name={record.name}
                        rules={[
                            {
                                required: !value,
                                message: 'mandatory field',
                            },
                        ]}
                        initialValue={record.value}
                    >
                        {record.isSensitive ? (
                            <Tooltip title='Actual values for sensitive fields are not available'>
                                <div>
                                    <Input.Password
                                        onChange={(e) => {
                                            setVariablesValue(record.name, e);
                                        }}
                                    />
                                </div>
                            </Tooltip>
                        ) : (
                            <Input
                                onChange={(e) => {
                                    setVariablesValue(record.name, e);
                                }}
                            />
                        )}
                    </Form.Item>
                ) : (
                    <Form.Item key={record.name} name='value' initialValue={record.value}>
                        {record.isSensitive ? (
                            <Tooltip title='Actual values for sensitive fields are not available'>
                                {/* Necessary to wrap in div https://stackoverflow.com/questions/70684982/adding-tooltip-to-input-causes-finddomnode-is-deprecated-in-strictmode-error*/}
                                <div>
                                    <Input.Password
                                        onChange={(e) => {
                                            setVariablesValue(record.name, e);
                                        }}
                                    />
                                </div>
                            </Tooltip>
                        ) : (
                            <Input
                                onChange={(e) => {
                                    setVariablesValue(record.name, e);
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
        <div>
            <CredentialApiDoc
                csp={credentialVariables.csp as csp}
                credentialType={credentialVariables.type as credentialType}
                styleClass={styles.updateCredentialApiDoc}
            />
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout='horizontal'
                style={{ maxWidth: 1200 }}
                onFinish={submit}
            >
                <CredentialTip
                    key={v4().toString()}
                    type={tipType}
                    msg={tipMessage}
                    onRemove={onRemove}
                ></CredentialTip>
                <div className={styles.credentialFormInput}>
                    <Form.Item label='Csp' name='csp'>
                        <Image
                            width={100}
                            preview={false}
                            src={cspMap.get(credentialVariables.csp.valueOf() as name)?.logo}
                        />
                    </Form.Item>
                    <Form.Item label='Site' name='site'>
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item label='Type' name='type'>
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item label='Name' name='name'>
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item label='Description' name='description'>
                        <TextArea rows={1} disabled={true} />
                    </Form.Item>
                    <Form.Item label='TimeToLive (In Seconds)' name='timeToLive'>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label='Variables' name='variables'>
                        <Table
                            rowKey={'name'}
                            pagination={false}
                            columns={columns}
                            dataSource={credentialVariablesCopy.variables}
                        ></Table>
                    </Form.Item>
                </div>
                <Form.Item className={styles.credentialFormButton}>
                    <Button
                        type='primary'
                        loading={updateCredentialRequest.isPending}
                        disabled={updateCredentialRequest.isSuccess}
                        htmlType='submit'
                    >
                        Update
                    </Button>
                    <Button
                        htmlType='button'
                        className={styles.updateCredentialFromButtonCancel}
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
