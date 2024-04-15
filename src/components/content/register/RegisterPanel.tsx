/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Col, Row, Upload, UploadFile } from 'antd';
import { AppstoreAddOutlined, CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { ApiError, Ocl, Response, ServiceTemplateDetailVo, ServiceVendorService } from '../../../xpanse-api/generated';
import '../../../styles/register.css';
import OclSummaryDisplay from '../common/ocl/OclSummaryDisplay';
import loadOclFile from '../common/ocl/loadOclFile';
import { ValidationStatus } from '../common/ocl/ValidationStatus';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    registerFailedRoute,
    registerInvalidRoute,
    registerPageRoute,
    registerSuccessfulRoute,
} from '../../utils/constants';
import YamlSyntaxValidationResult from '../common/ocl/YamlSyntaxValidationResult';
import RegisterResult from './RegisterResult';
import { getQueryKey } from '../catalog/services/query/useAvailableServiceTemplatesQuery';

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
    const queryClient = useQueryClient();

    const registerRequest = useMutation({
        mutationFn: (ocl: Ocl) => {
            return ServiceVendorService.register(ocl);
        },
        onSuccess: (serviceTemplateVo: ServiceTemplateDetailVo) => {
            files.current[0].status = 'done';
            registerResult.current = [`ID - ${serviceTemplateVo.id}`];
            void queryClient.refetchQueries({ queryKey: getQueryKey(serviceTemplateVo.category) });
            navigate(registerSuccessfulRoute.concat(`?id=${serviceTemplateVo.id}`));
        },
        onError: (error: Error) => {
            files.current[0].status = 'error';
            if (error instanceof ApiError && error.body && 'details' in error.body) {
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
                        navigate(registerInvalidRoute);
                    }
                }
            };
        }
    }

    const sendRequestRequest = ({ event }: { event: React.MouseEvent }) => {
        event.stopPropagation();
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

    const retryRequest = () => {
        if (ocl.current !== undefined) {
            registerRequest.mutate(ocl.current);
        }
    };

    return (
        <div className={'register-content'}>
            <div className={'content-title'}>
                <AppstoreAddOutlined />
                &nbsp;Register Service
            </div>
            {ocl.current !== undefined && !registerRequest.isPending && !registerRequest.isIdle ? (
                <RegisterResult
                    ocl={ocl.current}
                    registerRequestStatus={registerRequest.status}
                    registerResult={registerResult.current}
                    onRemove={onRemove}
                    retryRequest={retryRequest}
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
                    showUploadList={{
                        showRemoveIcon: true,
                        removeIcon: registerRequest.isPending,
                    }}
                >
                    <Row>
                        <Col>
                            <div className={'register-buttons-upload'}>
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
                            <div className={'register-buttons-register'}>
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
                            <div className={'register-buttons-validate'}>
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
    );
}

export default RegisterPanel;
