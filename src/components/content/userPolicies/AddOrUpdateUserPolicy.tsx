/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Image, Radio, RadioChangeEvent, Select, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import cspSelectStyles from '../../../styles/csp-select-drop-down.module.css';
import policyStyles from '../../../styles/policies.module.css';
import submitAlertStyles from '../../../styles/submit-alert.module.css';
import { Csp, UserPolicy, UserPolicyCreateRequest, UserPolicyUpdateRequest } from '../../../xpanse-api/generated';
import { ServiceProviderSkeleton } from '../catalog/services/details/ServiceProviderSkeleton.tsx';
import { cspMap } from '../common/csp/CspLogo';
import { useActiveCspsQuery } from '../credentials/query/useActiveCspsQuery.ts';
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
    const [policyContent, setPolicyContent] = useState<string>(currentPolicyService?.policy ?? '');
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [files] = useState<UploadFile[]>([]);
    const [regoFileUploadStatus, setRegoFileUploadStatus] = useState<PolicyUploadFileStatus>('notStarted');
    const createPoliciesManagementServiceRequest = useCreateUserPolicyRequest();
    const updatePoliciesManagementServiceRequest = useUpdateUserPolicyRequest();

    const getActiveCspsQuery = useActiveCspsQuery();

    const onFinish = (policyRequest: { csp: Csp; enabled: boolean; policy: string }) => {
        if (currentPolicyService === undefined) {
            const policyCreateRequest: UserPolicyCreateRequest = policyRequest as UserPolicyCreateRequest;
            policyCreateRequest.csp = policyRequest.csp;
            policyCreateRequest.enabled = policyRequest.enabled;
            policyCreateRequest.policy = policyRequest.policy;
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
            updatePoliciesManagementServiceRequest.mutate({
                userPolicyId: currentPolicyService.userPolicyId,
                requestBody: policyUpdateRequest,
            });
        }
    };

    const comparePolicyUpdateRequestResult = (policyRequest: {
        csp: Csp;
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
        files.pop();
        form.resetFields();
        setPolicyContent('');
        setRegoFileUploadStatus('notStarted');
        updatePoliciesManagementServiceRequest.reset();
        createPoliciesManagementServiceRequest.reset();
    };

    const onCancelUploadFile = () => {
        setIsUpdated(false);
        getCancelUpdateStatus(true);
    };

    const handleCspSelect = (cspName: Csp) => {
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
                        setPolicyContent(content);
                        form.setFieldsValue({ policy: content });
                        files[0].status = 'done';
                        setRegoFileUploadStatus('completed');
                    } catch (e: unknown) {
                        files[0].status = 'error';
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
        files.pop();
        files.push(file);
        setIsUpdated(false);
        setRegoFileUploadStatus('notStarted');
        getAndLoadPolicyContentFile([file]);
        return false;
    };

    const onRemovePolicyContentFile = () => {
        files.pop();
        setPolicyContent('');
        setIsUpdated(false);
        setRegoFileUploadStatus('notStarted');
        updatePoliciesManagementServiceRequest.reset();
        createPoliciesManagementServiceRequest.reset();
    };

    if (getActiveCspsQuery.isSuccess && getActiveCspsQuery.data) {
        return (
            <>
                {createPoliciesManagementServiceRequest.isSuccess || createPoliciesManagementServiceRequest.isError ? (
                    <UserPolicyCreateResultStatus
                        isError={createPoliciesManagementServiceRequest.isError}
                        isSuccess={createPoliciesManagementServiceRequest.isSuccess}
                        error={createPoliciesManagementServiceRequest.error}
                        currentPolicyService={createPoliciesManagementServiceRequest.data}
                    />
                ) : null}
                {updatePoliciesManagementServiceRequest.isSuccess || updatePoliciesManagementServiceRequest.isError ? (
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
                        policy: policyContent,
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
                            {getActiveCspsQuery.data.map((csp: Csp) => (
                                <Select.Option key={csp} value={csp} className={cspSelectStyles.cspSelectDropDown}>
                                    <Image
                                        className={policyStyles.customSelectImage}
                                        width={100}
                                        preview={false}
                                        src={cspMap.get(csp)?.logo}
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
                                    fileList={files}
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
                                {policyContent ? (
                                    <Card className={policyStyles.policyContentUploadPreview}>
                                        <pre>
                                            <div className={policyStyles.policyContentReadOnlyPreview}>
                                                {policyContent}
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
    } else {
        return <ServiceProviderSkeleton />;
    }
};
