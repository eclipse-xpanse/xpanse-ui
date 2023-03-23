/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Upload, UploadFile } from 'antd';
import { AppstoreAddOutlined, CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { Ocl } from '../../../xpanse-api/generated';
import '../../../styles/register.css';
import RegisterResult from './RegisterResult';
import OclSummaryDisplay from './OclSummaryDisplay';
import loadOclFile from './loadOclFile';
import { registerService } from './registerService';
import YamlSyntaxValidationResult from './YamlSyntaxValidationResult';
import { ValidationStatus } from './ValidationStatus';

function RegisterPanel(): JSX.Element {
    const ocl = useRef<Ocl | undefined>(undefined);
    const files = useRef<UploadFile[]>([]);
    const yamlValidationResult = useRef<string>('');
    const oclDisplayData = useRef<JSX.Element>(<></>);
    const registerResult = useRef<string>('');
    const [yamlSyntaxValidationStatus, setYamlSyntaxValidationStatus] = useState<ValidationStatus>('notStarted');
    const [oclValidationStatus, setOclValidationStatus] = useState<ValidationStatus>('notStarted');
    const [registerRequestStatus, setRegisterRequestStatus] = useState<ValidationStatus>('notStarted');

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
                    } catch (e: any) {
                        console.log(e);
                        files.current[0].status = 'error';
                        yamlValidationResult.current = e.message;
                        setYamlSyntaxValidationStatus('error');
                    }
                }
            };
        }
    }

    const sendRequestRequest = () => {
        registerService(ocl.current as Ocl, setRegisterRequestStatus, registerResult, files.current[0]);
        console.log(files.current[0].status);
    };

    const setFileData = (file: RcFile): boolean => {
        files.current.push(file);
        validateAndLoadYamlFile([file]);
        return false;
    };

    const onRemove = () => {
        files.current.pop();
        ocl.current = undefined;
        yamlValidationResult.current = '';
        registerResult.current = '';
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        setRegisterRequestStatus('notStarted');
        oclDisplayData.current = <></>;
    };

    return (
        <div className={'register-content'}>
            <div className={'content-title'}>
                <AppstoreAddOutlined />
                &ensp;Register Service
            </div>
            <RegisterResult
                ocl={ocl.current}
                registerRequestStatus={registerRequestStatus}
                registerResult={registerResult.current}
                onRemove={onRemove}
            />
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
                        (registerRequestStatus === 'notStarted' && yamlSyntaxValidationStatus === 'error') ||
                        registerRequestStatus === 'error' ||
                        registerRequestStatus === 'completed' ||
                        oclValidationStatus === 'error'
                    }
                    type={'primary'}
                    icon={<CloudUploadOutlined />}
                    onClick={sendRequestRequest}
                >
                    Register
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
    );
}

export default RegisterPanel;
