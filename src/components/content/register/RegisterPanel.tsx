/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Upload, UploadFile } from 'antd';
import { AppstoreAddOutlined, CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import React, { Key, useEffect, useRef, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { ApiError, Ocl, Response, ServiceTemplateVo, ServiceVendorService } from '../../../xpanse-api/generated';
import '../../../styles/register.css';
import OclSummaryDisplay from '../common/ocl/OclSummaryDisplay';
import loadOclFile from '../common/ocl/loadOclFile';
import { ValidationStatus } from '../common/ocl/ValidationStatus';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    registerFailedRoute,
    registerInvalidRoute,
    registerPageRoute,
    registerSuccessfulRoute,
} from '../../utils/constants';
import YamlSyntaxValidationResult from '../common/ocl/YamlSyntaxValidationResult';
import RegisterResult from './RegisterResult';
import { UploadFileStatus } from 'antd/es/upload/interface';

function RegisterPanel(): React.JSX.Element {
    const ocl = useRef<Ocl | undefined>(undefined);
    const files = useRef<UploadFile[]>([]);
    const yamlValidationResult = useRef<string>('');
    const oclDisplayData = useRef<React.JSX.Element>(<></>);
    const registerResult = useRef<string[]>([]);
    const [yamlSyntaxValidationStatus, setYamlSyntaxValidationStatus] = useState<ValidationStatus>('notStarted');
    const [oclValidationStatus, setOclValidationStatus] = useState<ValidationStatus>('notStarted');
    const navigate = useNavigate();
    const location = useLocation();

    const registerRequest = useMutation({
        mutationFn: (ocl: Ocl) => {
            return ServiceVendorService.register(ocl);
        },
        onSuccess: (serviceTemplateVo: ServiceTemplateVo) => {
            files.current[0].status = 'success' as UploadFileStatus;
            registerResult.current = [`ID - ${serviceTemplateVo.id}`];
            navigate(registerSuccessfulRoute.concat(`?id=${serviceTemplateVo.id}`));
        },
        onError: (error: Error) => {
            files.current[0].status = 'error';
            if (error instanceof ApiError && 'details' in error.body) {
                const response: Response = error.body as Response;
                registerResult.current = response.details;
            } else {
                registerResult.current = [error.message];
            }
            navigate(registerFailedRoute);
        },
    });

    // useEffect to clean up state when 'register panel' is clicked after registration has failed.
    useEffect(() => {
        if (location.pathname === registerPageRoute) {
            onRemove();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // useEffect to route to /register URI when a user reloads the failed URI. Hence, this must be run only during component's first render.
    useEffect(() => {
        if (location.pathname.includes(registerFailedRoute) || location.pathname.includes(registerSuccessfulRoute)) {
            navigate(registerPageRoute);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        navigate(registerInvalidRoute);
                    }
                }
            };
        }
    }

    const sendRequestRequest = () => {
        if (ocl.current !== undefined) {
            registerRequest.mutate(ocl.current);
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
        files.current.pop();
        ocl.current = undefined;
        yamlValidationResult.current = '';
        registerResult.current = [];
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        oclDisplayData.current = <></>;
        registerRequest.reset();
        navigate(registerPageRoute);
    };

    return (
        <div className={'register-content'}>
            <div className={'content-title'}>
                <AppstoreAddOutlined />
                &nbsp;Register Service
            </div>
            {ocl.current !== undefined && !registerRequest.isLoading && !registerRequest.isIdle ? (
                <RegisterResult
                    ocl={ocl.current}
                    registerRequestStatus={registerRequest.status}
                    registerResult={registerResult.current}
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
                        (registerRequest.isIdle && yamlSyntaxValidationStatus === 'error') ||
                        registerRequest.isError ||
                        registerRequest.isSuccess ||
                        oclValidationStatus === 'error'
                    }
                    type={'primary'}
                    icon={<CloudUploadOutlined />}
                    onClick={sendRequestRequest}
                    loading={registerRequest.isLoading}
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
