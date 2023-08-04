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
import { useQuery, UseQueryResult } from '@tanstack/react-query';

function AddCredential({
    credentialsQuery,
    onCancel,
}: {
    credentialsQuery: UseQueryResult<never[]>;
    onCancel: () => void;
}): JSX.Element {
    const [form] = Form.useForm();
    const [currentCsp, setCurrentCsp] = useState<CredentialVariables.csp | undefined>(undefined);
    const [disable, setDisable] = useState<boolean>(false);
    const [typeDisabled, setTypeDisabled] = useState<boolean>(true);
    const [nameDisable, setNameDisable] = useState<boolean>(true);
    const [currentType, setCurrentType] = useState<CredentialVariables.type | undefined>(undefined);
    const [currentName, setCurrentName] = useState<string | undefined>(undefined);
    const [credentialTypeList, setCredentialTypeList] = useState<CredentialVariables.type[]>([]);
    const [nameList, setNameList] = useState<string[]>([]);
    const [credentialVariableList, setCredentialVariableList] = useState<CredentialVariable[]>([]);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [descriptionValue, setDescriptionValue] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);

    const credentialTypesQuery = useQuery({
        queryKey: ['credentialTypesQuery', currentCsp],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queryFn: () => CredentialsManagementService.getCredentialTypesByCsp(currentCsp!),
        staleTime: 60000,
        enabled: currentCsp !== undefined,
    });

    useEffect(() => {
        const types = credentialTypesQuery.data;
        if (types !== undefined && types.length > 0) {
            setCredentialTypeList(types as CredentialVariables.type[]);
        } else {
            setCredentialTypeList([]);
        }
    }, [credentialTypesQuery.data, credentialTypesQuery.isSuccess]);

    useEffect(() => {
        setCredentialTypeList([]);
    }, [credentialTypesQuery.error]);

    const credentialCapabilitiesQuery = useQuery({
        queryKey: ['credentialCapabilitiesQuery', currentCsp, currentType],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queryFn: () => CredentialsManagementService.getCredentialCapabilitiesByCsp(currentCsp!, currentType),
        staleTime: 60000,
        enabled: currentCsp !== undefined && currentType !== undefined,
    });

    useEffect(() => {
        const credentials = credentialCapabilitiesQuery.data;
        const names: string[] = [];
        if (credentials !== undefined && credentials.length > 0) {
            credentials.forEach((credential: CredentialVariables) => {
                names.push(credential.name);
            });
        }
        setNameList(names);
    }, [credentialCapabilitiesQuery.data, credentialCapabilitiesQuery.isSuccess]);

    useEffect(() => {
        setNameList([]);
    }, [credentialCapabilitiesQuery.error]);

    useEffect(() => {
        const credentials = credentialCapabilitiesQuery.data;
        const names: string[] = [];
        if (credentials !== undefined && credentials.length > 0) {
            credentials.forEach((credential: CredentialVariables) => {
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
                    setDescriptionValue(credential.description);
                    form.setFieldsValue({ variables: credentialVariables });
                    form.setFieldsValue({ description: credential.description });
                }
            });
        }
        setNameList(names);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCsp, currentType, currentName]);

    const handleCspSelect = (cspName: CredentialVariables.csp) => {
        setCurrentCsp(cspName);

        setTypeDisabled(false);
        setCurrentType(undefined);
        form.setFieldsValue({ type: undefined });

        setNameDisable(true);
        setCurrentName(undefined);
        form.setFieldsValue({ name: undefined });

        setCredentialVariableList([]);
        form.setFieldsValue({ variables: [] });
        setDescriptionValue('');
        form.setFieldsValue({ description: '' });

        getTipInfo(undefined, '');
        setDisable(false);
    };

    const handleCredentialTypeSelect = (type: CredentialVariables.type) => {
        setCurrentType(type);

        setNameDisable(false);
        setCurrentName(undefined);
        form.setFieldsValue({ name: undefined });

        setCredentialVariableList([]);
        form.setFieldsValue({ variables: [] });
        setDescriptionValue('');
        form.setFieldsValue({ description: '' });

        getTipInfo(undefined, '');
        setDisable(false);
    };

    const handleCredentialNameSelect = (name: string) => {
        setCurrentName(name);
        form.setFieldsValue({ name: name });

        setCredentialVariableList([]);

        getTipInfo(undefined, '');
        setDisable(false);
    };

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
            void CredentialsManagementService.addCredential(createCredential)
                .then(() => {
                    void credentialsQuery.refetch();
                    getTipInfo('success', 'Adding Credential Successful.');
                    setDisable(true);
                })
                .catch((error: Error) => {
                    if (error instanceof ApiError && 'details' in error.body) {
                        const response: Response = error.body as Response;
                        getTipInfo('error', response.details.join());
                        setDisable(true);
                    } else {
                        getTipInfo('error', error.message);
                        setDisable(true);
                    }
                });
        }
    };

    const clear = () => {
        setCurrentCsp(undefined);
        setCurrentType(undefined);
        setCurrentName(undefined);
        setNameList([]);
        setCredentialTypeList([]);
        setCredentialVariableList([]);
        setDescriptionValue('');
        form.setFieldsValue({ description: '' });
    };

    const onReset = () => {
        clear();
        form.resetFields();
        getTipInfo(undefined, '');
        setTypeDisabled(true);
        setNameDisable(true);
        setDisable(false);
    };

    const onRemove = () => {
        onReset();
        onCancel();
        void credentialsQuery.refetch();
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
                    <Form.Item
                        label='Type'
                        name='type'
                        rules={[{ required: true, message: 'Please Select The Type of Credential!' }]}
                    >
                        <Select disabled={typeDisabled} onSelect={handleCredentialTypeSelect}>
                            {credentialTypeList.map((type: CredentialVariables.type) => {
                                return (
                                    <Select.Option key={type} value={type}>
                                        {type}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label='Name'
                        name='name'
                        rules={[{ required: true, message: 'Please Select The Name of Credential!' }]}
                    >
                        <Select
                            loading={credentialCapabilitiesQuery.isLoading || credentialCapabilitiesQuery.isRefetching}
                            disabled={nameDisable}
                            onSelect={handleCredentialNameSelect}
                        >
                            {nameList.map((name: string) => {
                                return (
                                    <Select.Option key={name} value={name}>
                                        {name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Description' name='description'>
                        <TextArea rows={4} disabled={true} value={descriptionValue} />
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
                    <Button type='primary' disabled={disable} htmlType='submit'>
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
