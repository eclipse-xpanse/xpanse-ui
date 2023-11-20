/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import { Button, Form, Image, Input, InputNumber, Select, Table, Tooltip } from 'antd';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
    AdminService,
    ApiError,
    CloudServiceProvider,
    CreateCredential,
    CredentialsManagementService,
    CredentialVariable,
    CredentialVariables,
    Response,
} from '../../../xpanse-api/generated';
import { CredentialTip } from './CredentialTip';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { CredentialApiDoc } from './CredentialApiDoc';
import { cspMap } from '../common/csp/CspLogo';

function AddCredential({
    role,
    credentialsQuery,
    onCancel,
}: {
    role: string | undefined;
    credentialsQuery: UseQueryResult<never[] | undefined>;
    onCancel: () => void;
}): React.JSX.Element {
    const active = true;
    const [form] = Form.useForm();
    const [currentCsp, setCurrentCsp] = useState<CredentialVariables.csp | undefined>(undefined);
    const [disable, setDisable] = useState<boolean>(false);
    const [typeDisabled, setTypeDisabled] = useState<boolean>(true);
    const [nameDisable, setNameDisable] = useState<boolean>(true);
    const [currentType, setCurrentType] = useState<CredentialVariables.type | undefined>(undefined);
    const [currentName, setCurrentName] = useState<string | undefined>(undefined);
    const [activeCspList, setActiveCspList] = useState<CredentialVariables.csp[]>([]);
    const [credentialTypeList, setCredentialTypeList] = useState<CredentialVariables.type[]>([]);
    const [nameList, setNameList] = useState<string[]>([]);
    const [credentialVariableList, setCredentialVariableList] = useState<CredentialVariable[]>([]);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [descriptionValue, setDescriptionValue] = useState<string>('');
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [addLoading, setAddLoading] = useState<boolean>(false);

    const getCspsQuery = useQuery({
        queryKey: ['getCspsQuery', active],
        queryFn: () => AdminService.getCsps(active),
        staleTime: 60000,
    });

    const credentialTypesQuery = useQuery({
        queryKey: ['credentialTypesQuery', currentCsp],
        queryFn: () => CredentialsManagementService.getCredentialTypes(currentCsp),
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
        const csps = getCspsQuery.data;
        if (csps !== undefined && csps.length > 0) {
            setActiveCspList(csps as CredentialVariables.csp[]);
        } else {
            setActiveCspList([]);
        }
    }, [getCspsQuery.data, getCspsQuery.isSuccess]);

    const credentialCapabilitiesQuery = useQuery({
        queryKey: ['credentialCapabilitiesQuery', currentCsp, currentType],
        queryFn: () => CredentialsManagementService.getCredentialCapabilities(currentCsp, currentType),
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
        if (currentCsp !== undefined && currentType !== undefined) {
            if (
                credentialCapabilitiesQuery.error instanceof ApiError &&
                'details' in credentialCapabilitiesQuery.error.body
            ) {
                const response: Response = credentialCapabilitiesQuery.error.body as Response;
                getTipInfo('error', response.details.join());
            } else if (credentialCapabilitiesQuery.error instanceof Error) {
                getTipInfo('error', credentialCapabilitiesQuery.error.message);
            }
            setDisable(true);
        } else {
            setNameList([]);
        }
    }, [credentialCapabilitiesQuery.error, currentCsp, currentType]);

    const addCredentialRequest = useMutation({
        mutationFn: (createCredential: CreateCredential) => addCredentialByRole(createCredential),
        onSuccess: () => {
            void credentialsQuery.refetch();
            getTipInfo('success', 'Adding Credential Successful.');
            setDisable(true);
            setAddLoading(false);
        },
        onError: (error: Error) => {
            setAddLoading(false);
            if (error instanceof ApiError && 'details' in error.body) {
                const response: Response = error.body as Response;
                getTipInfo('error', response.details.join());
                setDisable(true);
            } else {
                getTipInfo('error', error.message);
                setDisable(true);
            }
        },
    });

    const addCredentialByRole = (createCredential: CreateCredential) => {
        if (role === 'user') {
            return CredentialsManagementService.addUserCloudCredential(createCredential);
        } else {
            return CredentialsManagementService.addIsvCloudCredential(createCredential);
        }
    };

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
        setAddLoading(true);
        if (!isContainsEmpty(createCredential.variables)) {
            addCredentialRequest.mutate(createCredential);
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
            <CredentialApiDoc
                csp={currentCsp ?? CredentialVariables.csp.HUAWEI}
                credentialType={currentType ?? CredentialVariables.type.VARIABLES}
                styleClass={'add-credential-api-doc'}
            />

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
                        <Select onSelect={handleCspSelect} size={'large'}>
                            {activeCspList.map((csp: CredentialVariables.csp) => {
                                return (
                                    <Select.Option key={csp} value={csp} className={'credential-select-option-csp'}>
                                        <Image
                                            className={'custom-select'}
                                            width={100}
                                            preview={false}
                                            src={cspMap.get(csp.valueOf() as CloudServiceProvider.name)?.logo}
                                        />
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
                        <Select
                            loading={
                                (credentialTypesQuery.isLoading || credentialTypesQuery.isRefetching) &&
                                credentialTypesQuery.fetchStatus !== 'idle'
                            }
                            disabled={typeDisabled}
                            onSelect={handleCredentialTypeSelect}
                        >
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
                            loading={
                                (credentialTypesQuery.isLoading || credentialTypesQuery.isRefetching) &&
                                credentialTypesQuery.fetchStatus !== 'idle'
                            }
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
                        <TextArea rows={1} disabled={true} value={descriptionValue} />
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
                    <Button type='primary' loading={addLoading} disabled={disable} htmlType='submit'>
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
