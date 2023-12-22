/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useRef, useState } from 'react';
import '../../../../../styles/service_policies.css';
import { Alert, Button, Card, Form, Radio, RadioChangeEvent, Upload, UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import {
    ServicePolicy,
    ServicePolicyCreateRequest,
    ServicePolicyUpdateRequest,
} from '../../../../../xpanse-api/generated';
import { servicePoliciesStatuses, ServicePolicyUploadFileStatus } from './servicePoliciesParams';
import { useAddServicePolicy } from './addPolicy/useAddServicePolicy';
import { useUpdateServicePolicy } from './updatePolicy/useUpdateServicePolicy';
import ServicePolicySubmitResult from './ServicePolicySubmitResult';
import ServicePolicyCreateResultStatus from './addPolicy/ServicePolicyCreateResultStatus';
import ServicePolicyUpdateResultStatus from './updatePolicy/ServicePolicyUpdateResultStatus';
import ServicePolicyUpdateSubmitResult from './updatePolicy/ServicePolicyUpdateSubmitResult';

export const AddOrUpdateServicePolicy = ({
    serviceTemplateId,
    currentServicePolicy,
    getCancelUpdateStatus,
}: {
    serviceTemplateId: string;
    currentServicePolicy: ServicePolicy | undefined;
    getCancelUpdateStatus: (arg: boolean) => void;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const policyContent = useRef<string>(currentServicePolicy?.policy ?? '');
    const [createPolicyRequest, setCreatePolicyRequest] = useState<ServicePolicyCreateRequest | undefined>(undefined);
    const [updatePolicyRequest, setUpdatePolicyRequest] = useState<ServicePolicyUpdateRequest | undefined>(undefined);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const files = useRef<UploadFile[]>([]);
    const [regoFileUploadStatus, setRegoFileUploadStatus] = useState<ServicePolicyUploadFileStatus>('notStarted');
    const createServicePoliciesRequest = useAddServicePolicy();
    const updatePoliciesManagementServiceRequest = useUpdateServicePolicy();

    const onFinish = (policyRequest: { enabled: boolean; policy: string }) => {
        if (currentServicePolicy === undefined) {
            const policyCreateRequest: ServicePolicyCreateRequest = policyRequest as ServicePolicyCreateRequest;
            policyCreateRequest.enabled = policyRequest.enabled;
            policyCreateRequest.policy = policyRequest.policy;
            policyCreateRequest.serviceTemplateId = serviceTemplateId;
            setCreatePolicyRequest(policyCreateRequest);
            createServicePoliciesRequest.mutate(policyCreateRequest);
        } else if (currentServicePolicy.id.length > 0) {
            if (comparePolicyUpdateRequestResult(policyRequest)) {
                setIsUpdated(comparePolicyUpdateRequestResult(policyRequest));
                return;
            }
            const policyUpdateRequest: ServicePolicyUpdateRequest = policyRequest as ServicePolicyUpdateRequest;
            policyUpdateRequest.id = currentServicePolicy.id;
            policyUpdateRequest.enabled = policyRequest.enabled;
            policyUpdateRequest.policy = policyRequest.policy;
            setUpdatePolicyRequest(policyUpdateRequest);
            updatePoliciesManagementServiceRequest.mutate(policyUpdateRequest);
        }
    };

    const comparePolicyUpdateRequestResult = (policyRequest: { enabled: boolean; policy: string }): boolean => {
        return (
            currentServicePolicy !== undefined &&
            currentServicePolicy.enabled === policyRequest.enabled &&
            currentServicePolicy.policy === policyRequest.policy
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
        createServicePoliciesRequest.reset();
    };

    const onCancelUploadFile = () => {
        setIsUpdated(false);
        getCancelUpdateStatus(true);
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
                                <div className={'service-policy-submit-alert-tip'}>
                                    {' '}
                                    <Alert
                                        message={e.message}
                                        description={
                                            <ServicePolicySubmitResult msg={'Policy file upload failed'} uuid={''} />
                                        }
                                        showIcon
                                        closable={true}
                                        type={'error'}
                                    />{' '}
                                </div>
                            );
                        } else {
                            return (
                                <div className={'service-policy-submit-alert-tip'}>
                                    {' '}
                                    <Alert
                                        message={'unhandled error occurred'}
                                        description={
                                            <ServicePolicySubmitResult msg={'Policy file upload failed'} uuid={''} />
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
        createServicePoliciesRequest.reset();
    };

    return (
        <>
            {createPolicyRequest !== undefined && createPolicyRequest.policy.length > 0 ? (
                <ServicePolicyCreateResultStatus
                    isError={createServicePoliciesRequest.isError}
                    isSuccess={createServicePoliciesRequest.isSuccess}
                    error={createServicePoliciesRequest.error}
                    currentServicePolicy={createServicePoliciesRequest.data}
                />
            ) : null}
            {updatePolicyRequest !== undefined && updatePolicyRequest.id.length > 0 ? (
                <ServicePolicyUpdateResultStatus
                    isError={updatePoliciesManagementServiceRequest.isError}
                    isSuccess={updatePoliciesManagementServiceRequest.isSuccess}
                    error={updatePoliciesManagementServiceRequest.error}
                    currentServicePolicy={updatePoliciesManagementServiceRequest.data}
                />
            ) : null}
            <ServicePolicyUpdateSubmitResult isUpdated={isUpdated} />
            <Form
                form={form}
                name='basic'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                className={'service-policy-edit-form-class'}
                initialValues={{
                    remember: true,
                    enabled:
                        currentServicePolicy !== undefined && currentServicePolicy.id.length > 0
                            ? currentServicePolicy.enabled
                            : false,
                    policy: policyContent.current,
                }}
                onFinish={onFinish}
                autoComplete='off'
            >
                <Form.Item label='Enabled' name='enabled'>
                    <Radio.Group onChange={OnPolicyStatusChanged} value={isEnabled}>
                        {servicePoliciesStatuses.map((item, index) => {
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
                        <div className={'service-policy-upload-file-remove-buttons'}>
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
                                <Card className={'service-policy-content-upload-preview'}>
                                    <pre>
                                        <div className={'service-policy-content-read-only-preview'}>
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
                    <div className={'service-policy-submit-reset-container'}>
                        <div className={'service-policy-submit-class'}>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </div>
                        {currentServicePolicy === undefined ? (
                            <div className={'service-policy-reset-class'}>
                                {' '}
                                <Button htmlType='button' onClick={onReset}>
                                    Reset
                                </Button>
                            </div>
                        ) : (
                            <div className={'service-policy-reset-class'}>
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
