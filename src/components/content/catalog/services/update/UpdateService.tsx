/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { MutableRefObject, useRef, useState } from 'react';
import { Button, Modal, Upload, UploadFile } from 'antd';
import { AppstoreAddOutlined, CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import {
    ApiError,
    Ocl,
    ServiceTemplateVo,
    Response,
    ServiceVendorService,
    ServiceVo,
} from '../../../../../xpanse-api/generated';
import { RcFile } from 'antd/es/upload';
import UpdateResult from './UpdateResult';
import YamlSyntaxValidationResult from '../../../common/ocl/YamlSyntaxValidationResult';
import { ValidationStatus } from '../../../common/ocl/ValidationStatus';
import loadOclFile from '../../../common/ocl/loadOclFile';
import OclSummaryDisplay from '../../../common/ocl/OclSummaryDisplay';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import { UploadFileStatus } from 'antd/es/upload/interface';

function UpdateService({
    id,
    unregisterStatus,
    category,
}: {
    id: string;
    unregisterStatus: MutableRefObject<string>;
    category: ServiceVo.category;
}): React.JSX.Element {
    const ocl = useRef<Ocl | undefined>(undefined);
    const files = useRef<UploadFile[]>([]);
    const yamlValidationResult = useRef<string>('');
    const oclDisplayData = useRef<React.JSX.Element>(<></>);
    const updateResult = useRef<string[]>([]);
    const [yamlSyntaxValidationStatus, setYamlSyntaxValidationStatus] = useState<ValidationStatus>('notStarted');
    const [oclValidationStatus, setOclValidationStatus] = useState<ValidationStatus>('notStarted');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const updateServiceRequest = useMutation({
        mutationFn: (ocl: Ocl) => {
            return ServiceVendorService.update(id, ocl);
        },
        onSuccess: (serviceTemplateVo: ServiceTemplateVo) => {
            files.current[0].status = 'success' as UploadFileStatus;
            updateResult.current = [`ID - ${serviceTemplateVo.id}`];
        },
        onError: (error: Error) => {
            files.current[0].status = 'error';
            if (error instanceof ApiError && 'details' in error.body) {
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
        if (updateServiceRequest.isSuccess) {
            void queryClient.refetchQueries(getQueryKey(category));
        }
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

    function validateAndLoadYamlFile(uploadedFiles: UploadFile[]) {
        if (uploadedFiles.length > 0) {
            const reader = new FileReader();
            reader.readAsText(uploadedFiles[0] as RcFile);
            reader.onload = (e) => {
                if (e.target) {
                    try {
                        ocl.current = loadOclFile(e.target.result as string);
                        files.current[0].status = 'success' as UploadFileStatus;
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
    const sendRequestRequest = () => {
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

    const onRemove = () => {
        if (updateServiceRequest.isSuccess) {
            return;
        }
        files.current.pop();
        ocl.current = undefined;
        yamlValidationResult.current = '';
        updateResult.current = [];
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        oclDisplayData.current = <></>;
        updateServiceRequest.reset();
    };

    return (
        <div className={'update-unregister-btn-class'}>
            <Button
                type='primary'
                onClick={showModal}
                style={{ marginLeft: '20px', marginTop: '20px' }}
                disabled={unregisterStatus.current === 'completed' || unregisterStatus.current === 'error'}
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
                width={'80em'}
            >
                <div className={'register-content'}>
                    <div className={'content-title'}>
                        <AppstoreAddOutlined />
                        &nbsp;Update Service
                    </div>
                    {ocl.current ? (
                        <UpdateResult
                            ocl={ocl.current}
                            updateRequestStatus={updateServiceRequest.status}
                            updateResult={updateResult.current}
                            onRemove={onRemove}
                        />
                    ) : null}
                    <div className={'register-buttons'}>
                        <Upload
                            name={'OCL File'}
                            multiple={false}
                            beforeUpload={setFileData}
                            maxCount={1}
                            fileList={files.current}
                            onRemove={onRemove}
                            accept={'.yaml, .yml'}
                            showUploadList={true}
                        >
                            <Button
                                size={'large'}
                                disabled={yamlSyntaxValidationStatus === 'completed'}
                                loading={yamlSyntaxValidationStatus === 'inProgress'}
                                type={'primary'}
                                icon={<UploadOutlined />}
                            >
                                Upload File
                            </Button>
                        </Upload>
                        <Button
                            size={'large'}
                            disabled={
                                yamlSyntaxValidationStatus === 'notStarted' ||
                                (updateServiceRequest.isIdle && yamlSyntaxValidationStatus === 'error') ||
                                updateServiceRequest.isError ||
                                updateServiceRequest.isSuccess ||
                                oclValidationStatus === 'error'
                            }
                            type={'primary'}
                            icon={<CloudUploadOutlined />}
                            onClick={sendRequestRequest}
                            loading={updateServiceRequest.isLoading}
                        >
                            Update
                        </Button>
                        {yamlSyntaxValidationStatus === 'completed' || yamlSyntaxValidationStatus === 'error' ? (
                            <YamlSyntaxValidationResult
                                validationResult={yamlValidationResult.current}
                                yamlSyntaxValidationStatus={yamlSyntaxValidationStatus}
                            />
                        ) : null}
                    </div>
                    <div>{oclDisplayData.current}</div>
                </div>
            </Modal>
        </div>
    );
}
export default UpdateService;
