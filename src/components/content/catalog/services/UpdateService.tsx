/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MutableRefObject, useRef, useState } from 'react';
import { Button, Modal, Upload, UploadFile } from 'antd';
import { AppstoreAddOutlined, CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import { Ocl } from '../../../../xpanse-api/generated';
import { RcFile } from 'antd/es/upload';
import UpdateResult from './UpdateResult';
import YamlSyntaxValidationResult from '../../register/YamlSyntaxValidationResult';
import { updateServiceResult } from './updateServiceResult';
import { ValidationStatus } from '../../register/ValidationStatus';
import loadOclFile from '../../register/loadOclFile';
import OclSummaryDisplay from '../../register/OclSummaryDisplay';

function UpdateService({
    id,
    updateStatusWhenUnregister,
}: {
    id: string;
    updateStatusWhenUnregister: MutableRefObject<string>;
}): JSX.Element {
    const ocl = useRef<Ocl | undefined>(undefined);
    const files = useRef<UploadFile[]>([]);
    const yamlValidationResult = useRef<string>('');
    const oclDisplayData = useRef<JSX.Element>(<></>);
    const updateResult = useRef<string>('');
    const [yamlSyntaxValidationStatus, setYamlSyntaxValidationStatus] = useState<ValidationStatus>('notStarted');
    const [oclValidationStatus, setOclValidationStatus] = useState<ValidationStatus>('notStarted');
    const [updateRequestStatus, setUpdateRequestStatus] = useState<ValidationStatus>('notStarted');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        if (updateRequestStatus === 'completed') {
            window.location.reload();
        }
        files.current.pop();
        ocl.current = undefined;
        yamlValidationResult.current = '';
        updateResult.current = '';
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        setUpdateRequestStatus('notStarted');
        oclDisplayData.current = <></>;
        setIsModalOpen(false);
    };

    function validateAndLoadYamlFile(uploadedFiles: UploadFile[]) {
        if (uploadedFiles.length > 0) {
            const reader = new FileReader();
            reader.readAsText(uploadedFiles[0] as RcFile);
            reader.onload = (e) => {
                if (e.target) {
                    try {
                        ocl.current = loadOclFile(e.target.result as string);
                        files.current[0].status = 'success';
                        yamlValidationResult.current = 'YAML Syntax Valid';
                        setYamlSyntaxValidationStatus('completed');
                        oclDisplayData.current = OclSummaryDisplay(
                            setOclValidationStatus,
                            ocl.current,
                            files.current[0]
                        );
                    } catch (e: unknown) {
                        if (e instanceof Error) {
                            console.log(e);
                            files.current[0].status = 'error';
                            yamlValidationResult.current = e.message;
                            setYamlSyntaxValidationStatus('error');
                        } else {
                            console.log(e);
                        }
                    }
                }
            };
        }
    }
    const sendRequestRequest = () => {
        if (ocl.current) {
            updateServiceResult(id, ocl.current, setUpdateRequestStatus, updateResult, files.current[0]);
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
        if (updateRequestStatus === 'completed') {
            return;
        }
        files.current.pop();
        ocl.current = undefined;
        yamlValidationResult.current = '';
        updateResult.current = '';
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        setUpdateRequestStatus('notStarted');
        oclDisplayData.current = <></>;
    };

    return (
        <div className={'update-unregister-btn-class'}>
            <Button
                type='primary'
                onClick={showModal}
                style={{ marginLeft: '20px', marginTop: '20px' }}
                disabled={
                    updateStatusWhenUnregister.current === 'completed' || updateStatusWhenUnregister.current === 'error'
                }
            >
                Update
            </Button>
            <Modal
                title=''
                footer={null}
                open={isModalOpen}
                onOk={() => handleOk()}
                onCancel={handleCancel}
                width={1000}
            >
                <div className={'register-content'}>
                    <div className={'content-title'}>
                        <AppstoreAddOutlined />
                        &nbsp;Update Service
                    </div>
                    {ocl.current ? (
                        <UpdateResult
                            ocl={ocl.current}
                            updateRequestStatus={updateRequestStatus}
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
                                (updateRequestStatus === 'notStarted' && yamlSyntaxValidationStatus === 'error') ||
                                updateRequestStatus === 'error' ||
                                updateRequestStatus === 'completed' ||
                                oclValidationStatus === 'error'
                            }
                            type={'primary'}
                            icon={<CloudUploadOutlined />}
                            onClick={sendRequestRequest}
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
