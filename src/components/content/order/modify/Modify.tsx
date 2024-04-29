/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useState } from 'react';
import { Button, Form, Input, Tooltip } from 'antd';
import '../../../../styles/service_modify.css';
import {
    DeployedService,
    DeployedServiceDetails,
    ModifyRequest,
    ServiceService,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { InfoCircleOutlined } from '@ant-design/icons';
import useGetServiceTemplateDetails from '../../deployedServices/myServices/query/useGetServiceTemplateDetails';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import { OrderItem } from '../common/utils/OrderItem';
import { useOrderFormStore } from '../store/OrderFormStore';
import '../../../../styles/service_order.css';
import { getModifyParams } from '../formDataHelpers/modifyParamsHelper';
import ScaleOrModifySubmitStatusAlert from '../common/ScaleOrModifySubmitStatusAlert';
import { ModifySubmitRequest } from '../common/modifySubmitRequest';
import { useMutation } from '@tanstack/react-query';
import { getExistingServiceParameters } from '../common/utils/existingServiceParameters';
import { DeployParam } from '../types/DeployParam';

export const Modify = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    let getParams: DeployParam[] = [];

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
                        <Button
                            type='primary'
                            htmlType='submit'
                            disabled={
                                !hasVariableChanged() ||
                                (modifyStatus &&
                                    modifyStatus === DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL)
                            }
                        >
                            Modify
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};
