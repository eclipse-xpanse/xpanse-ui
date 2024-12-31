/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UploadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, Form, Image, Radio, RadioChangeEvent, Select, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useRef, useState } from 'react';
import cspSelectStyles from '../../../styles/csp-select-drop-down.module.css';
import policyStyles from '../../../styles/policies.module.css';
import submitAlertStyles from '../../../styles/submit-alert.module.css';
import {
    UserPolicy,
    UserPolicyCreateRequest,
    UserPolicyUpdateRequest,
    csp,
    getActiveCsps,
    name,
} from '../../../xpanse-api/generated';
import { cspMap } from '../common/csp/CspLogo';
import UserPolicySubmitResultDetails from './UserPolicySubmitResultDetails.tsx';
import UserPolicyCreateResultStatus from './add/UserPolicyCreateResultStatus.tsx';
import { useCreateUserPolicyRequest } from './add/useCreateUserPolicyRequest.ts';
import UpdateSubmitResult from './update/UpdateSubmitResult';
import UserPolicyUpdateResultStatus from './update/UserPolicyUpdateResultStatus.tsx';
import { useUpdateUserPolicyRequest } from './update/useUpdateUserPolicyRequest.ts';
import { PolicyUploadFileStatus, policiesStatuses } from './userPoliciesParams.ts';

export const AddOrUpdateUserPolicy = ({
    currentPolicyService,
    getCancelUpdateStatus,
}: {
    currentPolicyService: UserPolicy | undefined;
    getCancelUpdateStatus: (arg: boolean) => void;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const policyContent = useRef<string>(currentPolicyService?.policy ?? '');
    const [createPolicyRequest, setCreatePolicyRequest] = useState<UserPolicyCreateRequest | undefined>(undefined);
    const [updatePolicyRequest, setUpdatePolicyRequest] = useState<UserPolicyUpdateRequest | undefined>(undefined);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const files = useRef<UploadFile[]>([]);
    const [regoFileUploadStatus, setRegoFileUploadStatus] = useState<PolicyUploadFileStatus>('notStarted');
    const activeCspList = useRef<csp[]>([]);
    const createPoliciesManagementServiceRequest = useCreateUserPolicyRequest();
    const updatePoliciesManagementServiceRequest = useUpdateUserPolicyRequest();

    const getActiveCspsQuery = useQuery({
        queryKey: ['getActiveCspsQuery'],
        queryFn: () => {
            return getActiveCsps();
        },
        staleTime: 60000,
    });

    if (getActiveCspsQuery.isSuccess) {
        activeCspList.current = getActiveCspsQuery.data as csp[];
    }

    const onFinish = (policyRequest: { csp: csp; enabled: boolean; policy: string }) => {
        if (currentPolicyService === undefined) {
            const policyCreateRequest: UserPolicyCreateRequest = policyRequest as UserPolicyCreateRequest;
            policyCreateRequest.csp = policyRequest.csp;
            policyCreateRequest.enabled = policyRequest.enabled;
            policyCreateRequest.policy = policyRequest.policy;
            setCreatePolicyRequest(policyCreateRequest);
            createPoliciesManagementServiceRequest.mutate(policyCreateRequest);
        } else if (currentPolicyService.userPolicyId.length > 0) {
            if (comparePolicyUpdateRequestResult(policyRequest)) {
                setIsUpdated(comparePolicyUpdateRequestResult(policyRequest));
                return;
            }
            const policyUpdateRequest: UserPolicyUpdateRequest = policyRequest as UserPolicyUpdateRequest;
            policyUpdateRequest.csp = policyRequest.csp;
            policyUpdateRequest.enabled = policyRequest.enabled;
            policyUpdateRequest.policy = policyRequest.policy;
            setUpdatePolicyRequest(policyUpdateRequest);
            updatePoliciesManagementServiceRequest.mutate({
                userPolicyId: currentPolicyService.userPolicyId,
                requestBody: policyUpdateRequest,
            });
        }
    };

    const comparePolicyUpdateRequestResult = (policyRequest: {
        csp: csp;
        enabled: boolean;
        policy: string;
    }): boolean => {
        return (
            currentPolicyService !== undefined &&
            currentPolicyService.csp === policyRequest.csp &&
            currentPolicyService.enabled === policyRequest.enabled &&
            currentPolicyService.policy === policyRequest.policy
        );
    };

    const onReset = () => {
        files.current.pop();
        form.resetFields();
        policyContent.current = '';
        setRegoFileUploadStatus('notStarted');
        setCreatePolicyRequest(undefined);
        setUpdatePolicyRequest(undefined);
        updatePoliciesManagementServiceRequest.reset();
        createPoliciesManagementServiceRequest.reset();
    };

    const onCancelUploadFile = () => {
        setIsUpdated(false);
        getCancelUpdateStatus(true);
    };

    const handleCspSelect = (cspName: csp) => {
        setIsUpdated(false);
        form.setFieldsValue({ csp: cspName });
    };

    const OnPolicyStatusChanged = (e: RadioChangeEvent) => {
        setIsEnabled(e.target.value as boolean);
        setIsUpdated(false);
        form.setFieldsValue({ enabled: e.target.value as boolean });
    };

    function getAndLoadPolicyContentFile(uploadedFiles: UploadFile[]) {
        if (uploadedFiles.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    try {
                        const content = (e.target.result as string).replace(/\\n/g, '\n').replace(/\\"/g, '"');
                        policyContent.current = content;
                        form.setFieldsValue({ policy: content });
                        files.current[0].status = 'done';
                        setRegoFileUploadStatus('completed');
                    } catch (e: unknown) {
                        files.current[0].status = 'error';
                        setRegoFileUploadStatus('error');
                        if (e instanceof Error) {
                            return (
                                <div className={submitAlertStyles.submitAlertTip}>
                                    {' '}
                                    <Alert
                                        message={e.message}
                                        description={
                                            <UserPolicySubmitResultDetails
                                                msg={'Policy file upload failed'}
                                                uuid={''}
                                            />
                                        }
                                        showIcon
                                        closable={true}
                                        type={'error'}
                                    />{' '}
                                </div>
                            );
                        } else {
                            return (
                                <div className={submitAlertStyles.submitAlertTip}>
                                    {' '}
                                    <Alert
                                        message={'unhandled error occurred'}
                                        description={
                                            <UserPolicySubmitResultDetails
                                                msg={'Policy file upload failed'}
                                                uuid={''}
                                            />
                                        }
                                        showIcon
                                        closable={true}
                                        type={'error'}
                                    />{' '}
                                </div>
                            );
                        }
                    }
                }
            };
            reader.readAsText(uploadedFiles[0] as RcFile);
        }
    }

    const setPolicyContentFileData = (file: RcFile): boolean => {
        files.current.pop();
        files.current.push(file);
        setIsUpdated(false);
        setRegoFileUploadStatus('notStarted');
        getAndLoadPolicyContentFile([file]);
        return false;
    };

    const onRemovePolicyContentFile = () => {
        files.current.pop();
        policyContent.current = '';
        setIsUpdated(false);
        setRegoFileUploadStatus('notStarted');
        setCreatePolicyRequest(undefined);
        setUpdatePolicyRequest(undefined);
        updatePoliciesManagementServiceRequest.reset();
        createPoliciesManagementServiceRequest.reset();
    };

    return (
        <>
            {createPolicyRequest !== undefined && createPolicyRequest.policy.length > 0 ? (
                <UserPolicyCreateResultStatus
                    isError={createPoliciesManagementServiceRequest.isError}
                    isSuccess={createPoliciesManagementServiceRequest.isSuccess}
                    error={createPoliciesManagementServiceRequest.error}
                    currentPolicyService={createPoliciesManagementServiceRequest.data}
                />
            ) : null}
            {updatePolicyRequest !== undefined ? (
                <UserPolicyUpdateResultStatus
                    isError={updatePoliciesManagementServiceRequest.isError}
                    isSuccess={updatePoliciesManagementServiceRequest.isSuccess}
                    error={updatePoliciesManagementServiceRequest.error}
                    currentPolicyService={updatePoliciesManagementServiceRequest.data}
                />
            ) : null}
            <UpdateSubmitResult isUpdated={isUpdated} />
            <Form
                form={form}
                name='basic'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                className={policyStyles.editFormClass}
                initialValues={{
                    remember: true,
                    csp:
                        currentPolicyService !== undefined && currentPolicyService.userPolicyId.length > 0
                            ? currentPolicyService.csp
                            : undefined,
                    enabled:
                        currentPolicyService !== undefined && currentPolicyService.userPolicyId.length > 0
                            ? currentPolicyService.enabled
                            : false,
                    policy: policyContent.current,
                }}
                onFinish={onFinish}
                autoComplete='off'
            >
                <Form.Item label='Csp' name='csp' rules={[{ required: true, message: 'Please select csp!' }]}>
                    <Select
                        loading={getActiveCspsQuery.isLoading}
                        onSelect={handleCspSelect}
                        size={'large'}
                        className={policyStyles.policyFormSelect}
                    >
                        {activeCspList.current.map((csp: csp) => (
                            <Select.Option key={csp} value={csp} className={cspSelectStyles.cspSelectDropDown}>
                                <Image
                                    className={policyStyles.customSelectImage}
                                    width={100}
                                    preview={false}
                                    src={cspMap.get(csp.valueOf() as name)?.logo}
                                />
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label='Enabled' name='enabled'>
                    <Radio.Group onChange={OnPolicyStatusChanged} value={isEnabled}>
                        {policiesStatuses.map((item, index) => {
                            return (
                                <Radio key={index} value={item}>
                                    {item ? 'true' : 'false'}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label='Policy'
                    name='policy'
                    rules={[{ required: true, message: 'Please upload policy file!' }]}
                >
                    <div>
                        <div className={policyStyles.policyUploadFileRemoveButtons}>
                            <Upload
                                name={'Policy Content File'}
                                multiple={false}
                                beforeUpload={setPolicyContentFileData}
                                maxCount={1}
                                fileList={files.current}
                                onRemove={onRemovePolicyContentFile}
                                accept={'.rego'}
                                showUploadList={true}
                            >
                                <Button
                                    size={'large'}
                                    disabled={regoFileUploadStatus === 'completed'}
                                    loading={regoFileUploadStatus === 'inProgress'}
                                    type={'primary'}
                                    icon={<UploadOutlined />}
                                >
                                    Upload File
                                </Button>
                            </Upload>
                        </div>
                        <br />
                        <div>
                            {policyContent.current ? (
                                <Card className={policyStyles.policyContentUploadPreview}>
                                    <pre>
                                        <div className={policyStyles.policyContentReadOnlyPreview}>
                                            {policyContent.current}
                                        </div>
                                    </pre>
                                </Card>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <div className={policyStyles.submitResetContainer}>
                        <div className={policyStyles.submitClass}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                disabled={
                                    createPoliciesManagementServiceRequest.isSuccess ||
                                    updatePoliciesManagementServiceRequest.isSuccess
                                }
                            >
                                Submit
                            </Button>
                        </div>
                        {currentPolicyService === undefined ? (
                            <div className={policyStyles.resetClass}>
                                {' '}
                                <Button htmlType='button' onClick={onReset}>
                                    Reset
                                </Button>
                            </div>
                        ) : (
                            <div className={policyStyles.resetClass}>
                                {' '}
                                <Button htmlType='button' onClick={onCancelUploadFile}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};
