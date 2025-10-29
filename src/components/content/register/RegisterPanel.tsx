/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AppstoreAddOutlined, CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Row, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import appStyles from '../../../styles/app.module.css';
import registerStyles from '../../../styles/register.module.css';
import { ErrorResponse, Ocl, register, ServiceTemplateRequestInfo } from '../../../xpanse-api/generated';
import {
    registerFailedRoute,
    registerInvalidRoute,
    registerPageRoute,
    registerSuccessfulRoute,
} from '../../utils/constants';
import { getQueryKey } from '../catalog/services/query/useAvailableServiceTemplatesQuery.ts';
import { isHandleKnownErrorResponse } from '../common/error/isHandleKnownErrorResponse.ts';
import OclSummaryDisplay from '../common/ocl/OclSummaryDisplay';
import { ValidationStatus } from '../common/ocl/ValidationStatus';
import YamlSyntaxValidationResult from '../common/ocl/YamlSyntaxValidationResult';
import loadOclFile from '../common/ocl/loadOclFile';
import RegisterResult from './RegisterResult';

function RegisterPanel(): React.JSX.Element {
    const [ocl, setOcl] = useState<Ocl | undefined>(undefined);
    const [files] = useState<UploadFile[]>([]);
    const [yamlValidationResult, setYamlValidationResult] = useState<string>('');
    const [registerResult, setRegisterResult] = useState<string[]>([]);
    const serviceTemplateId = useRef<string>('');
    const [yamlSyntaxValidationStatus, setYamlSyntaxValidationStatus] = useState<ValidationStatus>('notStarted');
    const [oclValidationStatus, setOclValidationStatus] = useState<ValidationStatus>('notStarted');
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const registerRequest = useMutation({
        mutationFn: async (ocl: Ocl) => {
            const response = await register({ body: ocl });
            return response.data;
        },
        onSuccess: (serviceTemplateRequestInfo: ServiceTemplateRequestInfo | undefined) => {
            if (serviceTemplateRequestInfo === undefined) {
                return;
            }
            files[0].status = 'done';
            setRegisterResult([`ID - ${serviceTemplateRequestInfo.serviceTemplateId}`]);
            serviceTemplateId.current = serviceTemplateRequestInfo.serviceTemplateId;
            if (ocl) {
                void queryClient.refetchQueries({ queryKey: getQueryKey(ocl.category) });
            }
            void navigate(registerSuccessfulRoute.concat(`?id=${serviceTemplateRequestInfo.serviceTemplateId}`));
        },
        onError: (error: Error) => {
            files[0].status = 'error';
            if (isHandleKnownErrorResponse(error)) {
                const response: ErrorResponse = error.body;
                setRegisterResult(response.details);
            } else {
                setRegisterResult([error.message]);
            }
            void navigate(registerFailedRoute);
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
            void navigate(registerPageRoute);
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
                        void navigate(registerInvalidRoute);
                    }
                }
            };
        }
    }

    const sendRequestRequest = ({ event }: { event: React.MouseEvent }) => {
        event.stopPropagation();
        if (ocl !== undefined) {
            registerRequest.mutate(ocl);
        }
    };

    const setFileData = (file: RcFile): boolean => {
        files.pop();
        files.push(file);
        setYamlSyntaxValidationStatus('notStarted');
        validateAndLoadYamlFile([file]);
        return false;
    };

    const onRemove = () => {
        files.pop();
        setOcl(undefined);
        setYamlValidationResult('');
        setRegisterResult([]);
        setYamlSyntaxValidationStatus('notStarted');
        setOclValidationStatus('notStarted');
        registerRequest.reset();
        void navigate(registerPageRoute);
    };

    const retryRequest = () => {
        if (ocl !== undefined) {
            registerRequest.mutate(ocl);
        }
    };

    return (
        <div className={registerStyles.registerContent}>
            <div className={appStyles.contentTitle}>
                <AppstoreAddOutlined />
                &nbsp;Register Service
            </div>
            {ocl !== undefined && !registerRequest.isPending && !registerRequest.isIdle ? (
                <RegisterResult
                    ocl={ocl}
                    serviceTemplateId={serviceTemplateId.current}
                    registerRequestStatus={registerRequest.status}
                    registerResult={registerResult}
                    onRemove={onRemove}
                    retryRequest={retryRequest}
                />
            ) : null}
            <div className={registerStyles.registerButtons}>
                <Upload
                    name={'OCL File'}
                    multiple={false}
                    beforeUpload={setFileData}
                    maxCount={1}
                    fileList={files}
                    onRemove={onRemove}
                    accept={'.yaml, .yml'}
                    showUploadList={{
                        showRemoveIcon: true,
                        removeIcon: registerRequest.isPending,
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
                                        (registerRequest.isIdle && yamlSyntaxValidationStatus === 'error') ||
                                        registerRequest.isError ||
                                        registerRequest.isSuccess ||
                                        oclValidationStatus === 'error'
                                    }
                                    type={'primary'}
                                    icon={<CloudUploadOutlined />}
                                    onClick={(event: React.MouseEvent) => {
                                        sendRequestRequest({ event: event });
                                    }}
                                    loading={registerRequest.isPending}
                                >
                                    Register
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
            </div>
            {ocl !== undefined ? (
                <OclSummaryDisplay setOclValidationStatus={setOclValidationStatus} ocl={ocl} file={files[0]} />
            ) : null}
        </div>
    );
}

export default RegisterPanel;
