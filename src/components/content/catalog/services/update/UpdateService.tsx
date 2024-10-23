/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AppstoreAddOutlined, CloudUploadOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Modal, Row, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useRef, useState } from 'react';
import appStyles from '../../../../../styles/app.module.css';
import catalogStyles from '../../../../../styles/catalog.module.css';
import registerStyles from '../../../../../styles/register.module.css';
import {
    ApiError,
    Ocl,
    Response,
    ServiceTemplateDetailVo,
    category,
    serviceRegistrationState,
    update,
    type UpdateData,
} from '../../../../../xpanse-api/generated';
import OclSummaryDisplay from '../../../common/ocl/OclSummaryDisplay';
import { ValidationStatus } from '../../../common/ocl/ValidationStatus';
import YamlSyntaxValidationResult from '../../../common/ocl/YamlSyntaxValidationResult';
import loadOclFile from '../../../common/ocl/loadOclFile';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import UpdateResult from './UpdateResult';

function UpdateService({
    id,
    category,
    isViewDisabled,
}: {
    id: string;
    category: category;
    isViewDisabled: boolean;
}): React.JSX.Element {
    const ocl = useRef<Ocl | undefined>(undefined);
    const files = useRef<UploadFile[]>([]);
    const yamlValidationResult = useRef<string>('');
    const oclDisplayData = useRef<React.JSX.Element>(<></>);
    const updateResult = useRef<string[]>([]);
    const serviceRegistrationStatus = useRef<serviceRegistrationState>(serviceRegistrationState.UNREGISTERED);
    const [yamlSyntaxValidationStatus, setYamlSyntaxValidationStatus] = useState<ValidationStatus>('notStarted');
    const [oclValidationStatus, setOclValidationStatus] = useState<ValidationStatus>('notStarted');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const updateServiceRequest = useMutation({
        mutationFn: (ocl: Ocl) => {
            const data: UpdateData = {
                id: id,
                requestBody: ocl,
            };
            return update(data);
        },
        onSuccess: (serviceTemplateVo: ServiceTemplateDetailVo) => {
            files.current[0].status = 'done';
            updateResult.current = [`ID - ${serviceTemplateVo.serviceTemplateId}`];
            serviceRegistrationStatus.current = serviceTemplateVo.serviceRegistrationState as serviceRegistrationState;
        },
        onError: (error: Error) => {
            files.current[0].status = 'error';
            if (error instanceof ApiError && error.body && typeof error.body === 'object' && 'details' in error.body) {
                const response: Response = error.body as Response;
                updateResult.current = response.details;
            } else {
                updateResult.current = [error.message];
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
        files.current.pop();
        ocl.current = undefined;
        yamlValidationResult.current = '';
        updateResult.current = [];
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        oclDisplayData.current = <></>;
        setIsModalOpen(false);
        updateServiceRequest.reset();
    };

    const tryNewFile = () => {
        files.current.pop();
        ocl.current = undefined;
        yamlValidationResult.current = '';
        updateResult.current = [];
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        oclDisplayData.current = <></>;
        updateServiceRequest.reset();
    };

    function validateAndLoadYamlFile(uploadedFiles: UploadFile[]) {
        if (uploadedFiles.length > 0) {
            const reader = new FileReader();
            reader.readAsText(uploadedFiles[0] as RcFile);
            reader.onload = (e) => {
                if (e.target) {
                    try {
                        ocl.current = loadOclFile(e.target.result as string);
                        files.current[0].status = 'done';
                        yamlValidationResult.current = 'YAML Syntax Valid';
                        setYamlSyntaxValidationStatus('completed');
                        oclDisplayData.current = OclSummaryDisplay(
                            setOclValidationStatus,
                            ocl.current,
                            files.current[0]
                        );
                    } catch (e: unknown) {
                        files.current[0].status = 'error';
                        setYamlSyntaxValidationStatus('error');
                        if (e instanceof Error) {
                            yamlValidationResult.current = e.message;
                        } else {
                            yamlValidationResult.current = 'unhandled error occurred';
                        }
                    }
                }
            };
        }
    }

    const sendRequestRequest = ({ event }: { event: React.MouseEvent }) => {
        event.stopPropagation();
        if (ocl.current) {
            updateServiceRequest.mutate(ocl.current);
        }
    };

    const retryRequest = () => {
        if (ocl.current) {
            updateServiceRequest.mutate(ocl.current);
        }
    };

    const setFileData = (file: RcFile): boolean => {
        files.current.pop();
        files.current.push(file);
        setYamlSyntaxValidationStatus('notStarted');
        validateAndLoadYamlFile([file]);
        return false;
    };

    return (
        <div className={catalogStyles.updateUnregisterBtnClass}>
            <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={showModal}
                className={catalogStyles.catalogManageBtnClass}
                disabled={isViewDisabled}
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
                    {ocl.current ? (
                        <UpdateResult
                            ocl={ocl.current}
                            serviceRegistrationStatus={serviceRegistrationStatus.current}
                            updateRequestStatus={updateServiceRequest.status}
                            updateResult={updateResult.current}
                            onRemove={handleCancel}
                            tryNewFile={tryNewFile}
                            retryRequest={retryRequest}
                        />
                    ) : null}
                    <div className={registerStyles.registerButtons}>
                        <Upload
                            name={'OCL File'}
                            multiple={false}
                            beforeUpload={setFileData}
                            maxCount={1}
                            fileList={files.current}
                            onRemove={tryNewFile}
                            accept={'.yaml, .yml'}
                            showUploadList={{
                                showRemoveIcon: true,
                                removeIcon: updateServiceRequest.isPending,
                            }}
                        >
                            <Row>
                                <Col>
                                    <div className={registerStyles.registerButtonsUpload}>
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
                                                validationResult={yamlValidationResult.current}
                                                yamlSyntaxValidationStatus={yamlSyntaxValidationStatus}
                                            />
                                        ) : null}
                                    </div>
                                </Col>
                            </Row>
                        </Upload>
                    </div>
                    <div>{oclDisplayData.current}</div>
                </div>
            </Modal>
        </div>
    );
}

export default UpdateService;
