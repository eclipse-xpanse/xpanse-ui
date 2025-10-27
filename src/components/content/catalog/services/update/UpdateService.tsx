/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AppstoreAddOutlined, CloudUploadOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Form, Modal, Radio, Row, Upload, UploadFile } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import appStyles from '../../../../../styles/app.module.css';
import catalogStyles from '../../../../../styles/catalog.module.css';
import registerStyles from '../../../../../styles/register.module.css';
import {
    Category,
    ErrorResponse,
    Ocl,
    ServiceTemplateDetailVo,
    ServiceTemplateRegistrationState,
    ServiceTemplateRequestInfo,
    update,
} from '../../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse.ts';
import OclSummaryDisplay from '../../../common/ocl/OclSummaryDisplay';
import { ValidationStatus } from '../../../common/ocl/ValidationStatus';
import YamlSyntaxValidationResult from '../../../common/ocl/YamlSyntaxValidationResult';
import loadOclFile from '../../../common/ocl/loadOclFile';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import UpdateResult from './UpdateResult';

function UpdateService({
    serviceDetail,
    category,
    isViewDisabled,
}: {
    serviceDetail: ServiceTemplateDetailVo;
    category: Category;
    isViewDisabled: boolean;
}): React.JSX.Element {
    const [form] = Form.useForm();
    const [ocl, setOcl] = useState<Ocl | undefined>(undefined);
    const [files] = useState<UploadFile[]>([]);
    const [yamlValidationResult, setYamlValidationResult] = useState<string>('');
    const [updateResult, setUpdateResult] = useState<string[]>([]);
    const [yamlSyntaxValidationStatus, setYamlSyntaxValidationStatus] = useState<ValidationStatus>('notStarted');
    const [oclValidationStatus, setOclValidationStatus] = useState<ValidationStatus>('notStarted');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemoveServiceTemplateUntilApproved, setIsRemoveServiceTemplateUntilApproved] = useState(false);

    const queryClient = useQueryClient();
    const updateServiceRequest = useMutation({
        mutationFn: async (ocl: Ocl) => {
            const response = await update({
                body: ocl,
                path: {
                    serviceTemplateId: serviceDetail.serviceTemplateId,
                },
                query: {
                    isUnpublishUntilApproved:
                        serviceDetail.isAvailableInCatalog &&
                        serviceDetail.serviceTemplateRegistrationState === ServiceTemplateRegistrationState.APPROVED &&
                        files.length > 0
                            ? isRemoveServiceTemplateUntilApproved
                            : false,
                },
            });
            return response.data;
        },
        onSuccess: (serviceTemplateRequestInfo: ServiceTemplateRequestInfo | undefined) => {
            if (serviceTemplateRequestInfo === undefined) {
                return;
            }
            files.forEach((file: UploadFile) => {
                file.status = 'done';
            });
            setUpdateResult([`ID - ${serviceTemplateRequestInfo.serviceTemplateId}`]);
        },
        onError: (error: Error) => {
            files.forEach((file: UploadFile) => {
                file.status = 'error';
            });
            if (isHandleKnownErrorResponse(error)) {
                const response: ErrorResponse = error.body;
                setUpdateResult(response.details);
            } else {
                setUpdateResult([error.message]);
            }
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        files.pop();
        setOcl(undefined);
        setYamlValidationResult('');
        setUpdateResult([]);
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        setIsModalOpen(false);
        updateServiceRequest.reset();
    };

    const tryNewFile = () => {
        files.pop();
        setOcl(undefined);
        setYamlValidationResult('');
        setUpdateResult([]);
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        updateServiceRequest.reset();
    };

    function validateAndLoadYamlFile(uploadedFiles: UploadFile[]) {
        if (uploadedFiles.length > 0) {
            const reader = new FileReader();
            reader.readAsText(uploadedFiles[0] as RcFile);
            reader.onload = (e) => {
                if (e.target) {
                    try {
                        setOcl(loadOclFile(e.target.result as string));
                        files[0].status = 'done';
                        setYamlValidationResult('YAML Syntax Valid');
                        setYamlSyntaxValidationStatus('completed');
                    } catch (e: unknown) {
                        files[0].status = 'error';
                        setYamlSyntaxValidationStatus('error');
                        if (e instanceof Error) {
                            setYamlValidationResult(e.message);
                        } else {
                            setYamlValidationResult('unhandled error occurred');
                        }
                    }
                }
            };
        }
    }

    const sendRequestRequest = ({ event }: { event: React.MouseEvent }) => {
        event.stopPropagation();
        if (ocl) {
            updateServiceRequest.mutate(ocl);
        }
    };

    const retryRequest = () => {
        if (ocl) {
            updateServiceRequest.mutate(ocl);
        }
    };

    const setFileData = (file: RcFile): boolean => {
        files.pop();
        files.push(file);
        setYamlSyntaxValidationStatus('notStarted');
        validateAndLoadYamlFile([file]);
        return false;
    };

    const onChange = (e: CheckboxChangeEvent) => {
        setIsRemoveServiceTemplateUntilApproved(e.target.checked);
    };

    return (
        <div className={catalogStyles.updateUnpublishBtnClass}>
            <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={showModal}
                className={catalogStyles.catalogManageBtnClass}
                disabled={
                    isViewDisabled ||
                    (serviceDetail.isReviewInProgress &&
                        serviceDetail.serviceTemplateRegistrationState === ServiceTemplateRegistrationState.APPROVED)
                }
            >
                Update
            </Button>
            <Modal
                title=''
                footer={null}
                open={isModalOpen}
                onOk={() => {
                    handleOk();
                }}
                onCancel={handleCancel}
                width={'80%'}
            >
                <div className={registerStyles.registerContent}>
                    <div className={appStyles.contentTitle}>
                        <AppstoreAddOutlined />
                        &nbsp;Update Service
                    </div>
                    {ocl ? (
                        <UpdateResult
                            ocl={ocl}
                            updateServiceRequest={updateServiceRequest}
                            updateResult={updateResult}
                            onRemove={handleCancel}
                            tryNewFile={tryNewFile}
                            retryRequest={retryRequest}
                        />
                    ) : null}
                    <div className={registerStyles.registerButtons}>
                        <Form
                            form={form}
                            autoComplete='off'
                            onFinish={sendRequestRequest}
                            validateTrigger={['sendRequestRequest', 'onChange']}
                        >
                            <Upload
                                name={'OCL File'}
                                multiple={false}
                                beforeUpload={setFileData}
                                maxCount={1}
                                fileList={files}
                                onRemove={tryNewFile}
                                accept={'.yaml, .yml'}
                                showUploadList={{
                                    showRemoveIcon: true,
                                    removeIcon: updateServiceRequest.isPending,
                                }}
                            >
                                <Row>
                                    <Col>
                                        <div className={registerStyles.registerButtonsRegister}>
                                            <Button
                                                size={'large'}
                                                disabled={yamlSyntaxValidationStatus === 'completed'}
                                                loading={yamlSyntaxValidationStatus === 'inProgress'}
                                                type={'primary'}
                                                icon={<UploadOutlined />}
                                            >
                                                Upload File
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className={registerStyles.registerButtonsRegister}>
                                            <Button
                                                size={'large'}
                                                disabled={
                                                    yamlSyntaxValidationStatus === 'notStarted' ||
                                                    (updateServiceRequest.isIdle &&
                                                        yamlSyntaxValidationStatus === 'error') ||
                                                    updateServiceRequest.isError ||
                                                    updateServiceRequest.isSuccess ||
                                                    oclValidationStatus === 'error'
                                                }
                                                type={'primary'}
                                                icon={<CloudUploadOutlined />}
                                                onClick={(event: React.MouseEvent) => {
                                                    sendRequestRequest({ event: event });
                                                }}
                                                loading={updateServiceRequest.isPending}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className={registerStyles.registerButtonsValidate}>
                                            {yamlSyntaxValidationStatus === 'completed' ||
                                            yamlSyntaxValidationStatus === 'error' ? (
                                                <YamlSyntaxValidationResult
                                                    validationResult={yamlValidationResult}
                                                    yamlSyntaxValidationStatus={yamlSyntaxValidationStatus}
                                                />
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>
                            </Upload>
                            {serviceDetail.isAvailableInCatalog &&
                            serviceDetail.serviceTemplateRegistrationState ===
                                ServiceTemplateRegistrationState.APPROVED &&
                            files.length > 0 ? (
                                <Form.Item
                                    name='isRemoveServiceTemplateUntilApproved'
                                    label={
                                        <span style={{ fontWeight: 'bold' }}>
                                            Remove current service template until updated service template is approved
                                        </span>
                                    }
                                    required={true}
                                    rules={[{ required: true, message: 'Eula needs to be accepted' }]}
                                >
                                    <Radio.Group
                                        disabled={updateServiceRequest.isPending || updateServiceRequest.isSuccess}
                                        onChange={onChange}
                                        defaultValue={isRemoveServiceTemplateUntilApproved}
                                    >
                                        <Radio value={true}>true</Radio>
                                        <Radio value={false}>false</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            ) : null}
                        </Form>
                    </div>
                    {ocl ? (
                        <OclSummaryDisplay setOclValidationStatus={setOclValidationStatus} ocl={ocl} file={files[0]} />
                    ) : null}
                </div>
            </Modal>
        </div>
    );
}

export default UpdateService;
