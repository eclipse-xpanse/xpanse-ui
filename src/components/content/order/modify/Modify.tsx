/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Popconfirm, PopconfirmProps, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import '../../../../styles/service_modify.css';
import '../../../../styles/service_order.css';
import {
    DeployVariable,
    DeployedService,
    DeployedServiceDetails,
    ModifyRequest,
    ServiceService,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import useGetServiceTemplateDetails from '../../deployedServices/myServices/query/useGetServiceTemplateDetails';
import ScaleOrModifySubmitStatusAlert from '../common/ScaleOrModifySubmitStatusAlert';
import { ModifySubmitRequest } from '../common/modifySubmitRequest';
import { OrderItem } from '../common/utils/OrderItem';
import { getExistingServiceParameters } from '../common/utils/existingServiceParameters';
import { getModifyParams } from '../formDataHelpers/modifyParamsHelper';
import { useOrderFormStore } from '../store/OrderFormStore';
import { DeployParam } from '../types/DeployParam';

export const Modify = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const { Paragraph } = Typography;
    let getParams: DeployParam[] = [];
    let getVariables: DeployVariable[] = [];

    const [modifyWarning, setModifyWarning] = useState<React.JSX.Element[]>([]);

    const [isShowModifyingResult, setIsShowModifyingResult] = useState<boolean>(false);
    const [modifyStatus, setModifyStatus] = useState<DeployedService.serviceDeploymentState | undefined>(undefined);
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const [storedDeployVariables] = useOrderFormStore((state) => [state.deployParams]);

    const serviceTemplateDetailsQuery = useGetServiceTemplateDetails(currentSelectedService.serviceTemplateId);
    const modifyServiceRequest = useMutation({
        mutationFn: (modifyServiceRequestParams: ModifySubmitRequest) => {
            return ServiceService.modify(modifyServiceRequestParams.id, modifyServiceRequestParams.modifyRequest);
        },
    });

    const hasVariableChanged: () => boolean = () => {
        const prevParamsString = JSON.stringify(getExistingServiceParameters(currentSelectedService));
        const newParamsString = JSON.stringify(storedDeployVariables);
        return prevParamsString !== newParamsString;
    };

    if (serviceTemplateDetailsQuery.isSuccess) {
        getParams = getModifyParams(serviceTemplateDetailsQuery.data.variables);
        getVariables = serviceTemplateDetailsQuery.data.variables;
    }

    const onFinish = () => {
        const deployParamsCache = useOrderFormStore.getState().deployParams;
        const createRequest: ModifyRequest = {
            flavor: currentSelectedService.flavor,
            customerServiceName: deployParamsCache[CUSTOMER_SERVICE_NAME_FIELD] as string,
        };
        const serviceRequestProperties: Record<string, unknown> = {};
        for (const variable in deployParamsCache) {
            if (variable !== CUSTOMER_SERVICE_NAME_FIELD && deployParamsCache[variable] !== '') {
                serviceRequestProperties[variable] = deployParamsCache[variable];
            }
        }
        createRequest.serviceRequestProperties = serviceRequestProperties as Record<string, never>;
        const modifyServiceRequestParams: ModifySubmitRequest = {
            id: currentSelectedService.id,
            modifyRequest: createRequest,
        };

        modifyServiceRequest.mutate(modifyServiceRequestParams);
        setIsShowModifyingResult(true);
    };

    const getModifyDetailsStatus = (status: DeployedService.serviceDeploymentState | undefined) => {
        setModifyStatus(status);
    };

    function getModifiedProperties(
        originalDeployParams: Record<string, unknown>,
        updatedDeployParams: Record<string, unknown>
    ): string[] {
        const originalKeys = Object.keys(originalDeployParams);
        const updatedKeys = Object.keys(updatedDeployParams);

        const allKeys = new Set([...originalKeys, ...updatedKeys]);

        const modifiedKeys: string[] = [];
        allKeys.forEach((key) => {
            if (originalDeployParams[key] !== updatedDeployParams[key]) {
                modifiedKeys.push(key);
            }
        });

        return modifiedKeys;
    }

    const onClickModify = () => {
        const modifiedKeys = getModifiedProperties(
            getExistingServiceParameters(currentSelectedService),
            storedDeployVariables
        );
        if (modifiedKeys.length > 0) {
            const warnings: React.JSX.Element[] = [];

            const variableMap = new Map(getVariables.map((variable) => [variable.name, variable.modificationImpact]));

            modifiedKeys.forEach((updatedKey) => {
                const impact = variableMap.get(updatedKey);

                if (impact) {
                    if (impact.isDataLost && impact.isServiceInterrupted) {
                        warnings.push(
                            <Paragraph key={updatedKey} style={{ margin: 0 }}>
                                <span>{`Changing ${updatedKey} - will delete the existing data and restart the service.`}</span>
                            </Paragraph>
                        );
                    } else if (impact.isDataLost && !impact.isServiceInterrupted) {
                        warnings.push(
                            <Paragraph key={updatedKey} style={{ margin: 0 }}>
                                <span>{`Changing ${updatedKey} - will delete the existing service data.`}</span>
                            </Paragraph>
                        );
                    } else if (!impact.isDataLost && impact.isServiceInterrupted) {
                        warnings.push(
                            <Paragraph key={updatedKey} style={{ margin: 0 }}>
                                <span>{`Changing ${updatedKey} - will restart the service.`}</span>
                            </Paragraph>
                        );
                    }
                }
            });

            if (warnings.length === 0) {
                warnings.push(<span>{'Are you sure to proceed with service configuration modification?'}</span>);
            } else {
                warnings.push(<span>{' proceed?'}</span>);
            }

            setModifyWarning(warnings);
        }
    };

    const confirm: PopconfirmProps['onConfirm'] = () => {
        onFinish();
    };

    const cancel: PopconfirmProps['onCancel'] = () => {
        setModifyWarning([]);
    };

    return (
        <div className={'modify-select-class'}>
            <div className={'modify-title-class content-title'}>Modify Parameters:</div>
            {isShowModifyingResult ? (
                <ScaleOrModifySubmitStatusAlert
                    isSubmitFailed={modifyServiceRequest.isError}
                    submitFailedResult={modifyServiceRequest.error}
                    isSubmitInProgress={modifyServiceRequest.isPending}
                    currentSelectedService={currentSelectedService}
                    serviceProviderContactDetails={
                        serviceTemplateDetailsQuery.isSuccess
                            ? serviceTemplateDetailsQuery.data.serviceProviderContactDetails
                            : undefined
                    }
                    getModifyDetailsStatus={getModifyDetailsStatus}
                />
            ) : null}
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                initialValues={useOrderFormStore.getState().deployParams}
                onFinish={onFinish}
                className={'modify-container'}
                validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                key='scale'
                disabled={modifyServiceRequest.isPending || modifyServiceRequest.isSuccess}
            >
                <div className={'order-param-item-left'} />
                <Form.Item
                    name={'Name'}
                    label={'Name: Service Name'}
                    rules={[{ required: true }, { type: 'string', min: 5 }]}
                    colon={true}
                >
                    <Input
                        name={'Name'}
                        showCount
                        placeholder={'customer defined name for service ordered'}
                        maxLength={256}
                        onChange={(e) => {
                            cacheFormVariable(CUSTOMER_SERVICE_NAME_FIELD, e.target.value);
                        }}
                        className={'order-param-item-content'}
                        suffix={
                            <Tooltip title={'Customer defined name for the service instance created'}>
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                </Form.Item>
                <div
                    className={
                        currentSelectedService.serviceDeploymentState.toString() ===
                        DeployedServiceDetails.serviceDeploymentState.MODIFYING.toString()
                            ? 'deploying order-param-item-row'
                            : ''
                    }
                >
                    {getParams.map((item) =>
                        item.kind === 'variable' || item.kind === 'env' ? (
                            <OrderItem
                                key={item.name}
                                item={item}
                                csp={currentSelectedService.deployRequest.csp}
                                region={currentSelectedService.deployRequest.region.name}
                            />
                        ) : undefined
                    )}
                </div>
                <div className={'order-param-item-left'} />
                <div className={'service-modify-submit-reset-container'}>
                    <div className={'service-modify-submit-class'}>
                        <Popconfirm
                            placement='top'
                            title='Modify parameters'
                            description={
                                <div className={'service-modify-warnings-content'}>
                                    <Paragraph>{modifyWarning}</Paragraph>
                                </div>
                            }
                            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={cancel}
                            onCancel={confirm}
                            okText='No'
                            cancelText='Yes'
                        >
                            <Button
                                type='primary'
                                onClick={onClickModify}
                                disabled={
                                    !hasVariableChanged() ||
                                    (modifyStatus &&
                                        modifyStatus === DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL)
                                }
                            >
                                Modify
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            </Form>
        </div>
    );
};
