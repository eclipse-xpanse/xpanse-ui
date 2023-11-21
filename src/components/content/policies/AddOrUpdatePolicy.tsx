/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useRef, useState } from 'react';
import {
    CloudServiceProvider,
    CredentialVariables,
    PolicyCreateRequest,
    PolicyUpdateRequest,
    PolicyVo,
} from '../../../xpanse-api/generated';
import '../../../styles/policies.css';
import { Alert, Button, Card, Form, Image, Radio, RadioChangeEvent, Select, Upload, UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { policiesStatuses, PolicyUploadFileStatus } from './policiesParams';
import { RcFile } from 'antd/es/upload';
import { useCreatePolicyRequest } from './add/useCreatePolicyRequest';
import PolicyCreateResultStatus from './add/PolicyCreateResultStatus';
import PolicyUpdateResultStatus from './update/PolicyUpdateResultStatus';
import { useUpdatePolicyRequest } from './update/useUpdatePolicyRequest';
import PolicySubmitResultDetails from './PolicySubmitResultDetails';
import { cspMap } from '../common/csp/CspLogo';
import UpdateSubmitResult from './update/UpdateSubmitResult';

export const AddOrUpdatePolicy = ({
    currentPolicyService,
    getCancelUpdateStatus,
}: {
    currentPolicyService: PolicyVo | undefined;
    getCancelUpdateStatus: (arg: boolean) => void;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const policyContent = useRef<string>(currentPolicyService?.policy ?? '');
    const [createPolicyRequest, setCreatePolicyRequest] = useState<PolicyCreateRequest | undefined>(undefined);
    const [updatePolicyRequest, setUpdatePolicyRequest] = useState<PolicyUpdateRequest | undefined>(undefined);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const files = useRef<UploadFile[]>([]);
    const [regoFileUploadStatus, setRegoFileUploadStatus] = useState<PolicyUploadFileStatus>('notStarted');
    const createPoliciesManagementServiceRequest = useCreatePolicyRequest();
    const updatePoliciesManagementServiceRequest = useUpdatePolicyRequest();

    const onFinish = (policyRequest: { csp: PolicyVo.csp; enabled: boolean; policy: string }) => {
        if (currentPolicyService === undefined) {
            const policyCreateRequest: PolicyCreateRequest = policyRequest as PolicyCreateRequest;
            policyCreateRequest.csp = policyRequest.csp;
            policyCreateRequest.enabled = policyRequest.enabled;
            policyCreateRequest.policy = policyRequest.policy;
            setCreatePolicyRequest(policyCreateRequest);
            createPoliciesManagementServiceRequest.mutate(policyCreateRequest);
        } else if (currentPolicyService.id.length > 0) {
            if (comparePolicyUpdateRequestResult(policyRequest)) {
                setIsUpdated(comparePolicyUpdateRequestResult(policyRequest));
                return;
            }
            const policyUpdateRequest: PolicyUpdateRequest = policyRequest as PolicyUpdateRequest;
            policyUpdateRequest.id = currentPolicyService.id;
            policyUpdateRequest.csp = policyRequest.csp;
            policyUpdateRequest.enabled = policyRequest.enabled;
            policyUpdateRequest.policy = policyRequest.policy;
            setUpdatePolicyRequest(policyUpdateRequest);
            updatePoliciesManagementServiceRequest.mutate(policyUpdateRequest);
        }
    };

    const comparePolicyUpdateRequestResult = (policyRequest: {
        csp: PolicyVo.csp;
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

    const handleCspSelect = (cspName: CredentialVariables.csp) => {
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
                                <div className={'submit-alert-tip'}>
                                    {' '}
                                    <Alert
                                        message={e.message}
                                        description={
                                            <PolicySubmitResultDetails msg={'Policy file upload failed'} uuid={''} />
                                        }
                                        showIcon
                                        closable={true}
                                        type={'error'}
                                    />{' '}
                                </div>
                            );
                        } else {
                            return (
                                <div className={'submit-alert-tip'}>
                                    {' '}
                                    <Alert
                                        message={'unhandled error occurred'}
                                        description={
                                            <PolicySubmitResultDetails msg={'Policy file upload failed'} uuid={''} />
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
                <PolicyCreateResultStatus
                    isError={createPoliciesManagementServiceRequest.isError}
                    isSuccess={createPoliciesManagementServiceRequest.isSuccess}
                    error={createPoliciesManagementServiceRequest.error}
                    currentPolicyService={createPoliciesManagementServiceRequest.data}
                />
            ) : null}
            {updatePolicyRequest !== undefined && updatePolicyRequest.id.length > 0 ? (
                <PolicyUpdateResultStatus
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
                className={'edit-form-class'}
                initialValues={{
                    remember: true,
                    csp:
                        currentPolicyService !== undefined && currentPolicyService.id.length > 0
                            ? currentPolicyService.csp
                            : undefined,
                    enabled:
                        currentPolicyService !== undefined && currentPolicyService.id.length > 0
                            ? currentPolicyService.enabled
                            : false,
                    policy: policyContent.current,
                }}
                onFinish={onFinish}
                autoComplete='off'
            >
                <Form.Item label='Csp' name='csp' rules={[{ required: true, message: 'Please select csp!' }]}>
                    <Select onSelect={handleCspSelect} size={'large'} className={'policy-form-select'}>
                        {Object.values(CredentialVariables.csp).map((csp: CredentialVariables.csp) => (
                            <Select.Option key={csp} value={csp} className={'credential-select-option-csp'}>
                                <Image
                                    className={'custom-select-image'}
                                    width={100}
                                    preview={false}
                                    src={cspMap.get(csp.valueOf() as CloudServiceProvider.name)?.logo}
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
                        <div className={'policy-upload-file-remove-buttons'}>
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
                                <Card className={'policy-content-upload-preview'}>
                                    <pre>
                                        <div className={'policy-content-read-only-preview'}>
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
                    <div className={'submit-reset-container'}>
                        <div className={'submit-class'}>
                            <Button type='primary' htmlType='submit' className={'submit-policy-class'}>
                                Submit
                            </Button>
                        </div>
                        {currentPolicyService === undefined ? (
                            <div className={'reset-class'}>
                                {' '}
                                <Button htmlType='button' onClick={onReset}>
                                    Reset
                                </Button>
                            </div>
                        ) : (
                            <div className={'reset-class'}>
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
