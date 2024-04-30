/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useState } from 'react';
import { Badge, Button, Card, Col, Form, Input, Row, Tag, Tooltip } from 'antd';
import '../../../../styles/service_modify.css';
import '../../../../styles/service_order.css';
import {
    Billing,
    DeployedService,
    DeployedServiceDetails,
    ModifyRequest,
    ServiceFlavor,
    ServiceService,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { InfoCircleOutlined } from '@ant-design/icons';
import useGetServiceTemplateDetails from '../../deployedServices/myServices/query/useGetServiceTemplateDetails';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import { OrderItem } from '../common/utils/OrderItem';
import { useOrderFormStore } from '../store/OrderFormStore';
import { getModifyParams } from '../formDataHelpers/modifyParamsHelper';
import { ModifySubmitRequest } from '../common/modifySubmitRequest';
import ScaleOrModifySubmitStatusAlert from '../common/ScaleOrModifySubmitStatusAlert';
import { useMutation } from '@tanstack/react-query';
import { DeployParam } from '../types/DeployParam';

export const Scale = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    let flavorList: ServiceFlavor[] = [];
    let getParams: DeployParam[] = [];
    let currentBilling: Billing | undefined = undefined;
    const [modifyStatus, setModifyStatus] = useState<DeployedService.serviceDeploymentState | undefined>(undefined);
    const [selectFlavor, setSelectFlavor] = useState<string>(
        currentSelectedService.flavor ? currentSelectedService.flavor : ''
    );
    const [isShowModifyingResult, setIsShowModifyingResult] = useState<boolean>(false);

    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    const serviceTemplateDetailsQuery = useGetServiceTemplateDetails(currentSelectedService.serviceTemplateId);
    const modifyServiceRequest = useMutation({
        mutationFn: (modifyServiceRequestParams: ModifySubmitRequest) => {
            return ServiceService.modify(modifyServiceRequestParams.id, modifyServiceRequestParams.modifyRequest);
        },
    });

    if (serviceTemplateDetailsQuery.isSuccess) {
        currentBilling = serviceTemplateDetailsQuery.data.billing;
        if (serviceTemplateDetailsQuery.data.flavors.serviceFlavors.length > 0) {
            flavorList = serviceTemplateDetailsQuery.data.flavors.serviceFlavors;
        }
        getParams = getModifyParams(serviceTemplateDetailsQuery.data.variables);
    }

    const onFinish = () => {
        const deployParamsCache = useOrderFormStore.getState().deployParams;
        const createRequest: ModifyRequest = {
            flavor: selectFlavor,
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
            <div className={'modify-title-class content-title'}>Change Flavor:</div>
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
            <div className={'order-param-item-left'} />
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                initialValues={useOrderFormStore.getState().deployParams}
                onFinish={onFinish}
                className={'modify-container'}
                validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                key='scale'
                disabled={
                    currentSelectedService.flavor === selectFlavor ||
                    modifyServiceRequest.isPending ||
                    modifyServiceRequest.isSuccess
                }
            >
                <Form.Item name='flavor'>
                    <Row gutter={16}>
                        {flavorList.map((flavor) => {
                            return (
                                <Col span={4} key={flavor.name} className={'modify-select-flavor-billing'}>
                                    <div
                                        className={`flavor-card-container ${
                                            currentSelectedService.flavor === flavor.name
                                                ? 'flavor-select-hover-disabled'
                                                : selectFlavor === flavor.name
                                                  ? 'flavor-select-hover'
                                                  : ''
                                        }`}
                                        onClick={() => {
                                            if (currentSelectedService.flavor === flavor.name) {
                                                return;
                                            }
                                            setSelectFlavor(flavor.name);
                                            form.setFieldsValue({ selectFlavor: flavor.name });
                                        }}
                                        style={{
                                            pointerEvents:
                                                currentSelectedService.flavor === flavor.name ||
                                                modifyServiceRequest.isPending ||
                                                modifyServiceRequest.isSuccess
                                                    ? 'none'
                                                    : 'auto',
                                            cursor:
                                                currentSelectedService.flavor === flavor.name ||
                                                modifyServiceRequest.isPending ||
                                                modifyServiceRequest.isSuccess
                                                    ? 'not-allowed'
                                                    : 'auto',
                                        }}
                                    >
                                        {currentSelectedService.flavor === flavor.name ? (
                                            <div className={'flavor-old-badge'}>
                                                <Badge.Ribbon
                                                    text='current'
                                                    className={'flavor-card-custom-ribbon'}
                                                    color={'#b5b5b5'}
                                                >
                                                    <Card title={flavor.name}>
                                                        <p className={'flavor-card-content'}>
                                                            {currentBilling ? (
                                                                <>
                                                                    <Tag color={'blue'}>
                                                                        {flavor.fixedPrice}
                                                                        {/* TODO Will be fixed in #1591 or #1592 */}
                                                                        {currentBilling.billingModes[0]}
                                                                    </Tag>
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </p>
                                                    </Card>
                                                </Badge.Ribbon>
                                            </div>
                                        ) : (
                                            <Card title={flavor.name}>
                                                <p className={'flavor-card-content'}>
                                                    {currentBilling ? (
                                                        <>
                                                            <Tag color={'blue'}>
                                                                {flavor.fixedPrice}
                                                                {/* TODO Will be fixed in #1591 or #1592 */}
                                                                {currentBilling.billingModes[0]}
                                                                in #1591 or #1592
                                                            </Tag>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </p>
                                            </Card>
                                        )}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Form.Item>
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
                                currentSelectedService.flavor === selectFlavor ||
                                (modifyStatus &&
                                    modifyStatus === DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL)
                            }
                        >
                            Scale
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};
