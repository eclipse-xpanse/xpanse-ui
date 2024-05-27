/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Badge, Button, Card, Col, Form, Input, Popconfirm, PopconfirmProps, Row, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import appStyles from '../../../../styles/app.module.css';
import serviceModifyStyles from '../../../../styles/service-modify.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import {
    Billing,
    DeployedService,
    DeployedServiceDetails,
    ModifyRequest,
    ServiceFlavor,
    ServiceModificationService,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import useGetServiceTemplateDetails from '../../deployedServices/myServices/query/useGetServiceTemplateDetails';
import ScaleOrModifySubmitStatusAlert from '../common/ScaleOrModifySubmitStatusAlert';
import { ModifySubmitRequest } from '../common/modifySubmitRequest';
import { OrderItem } from '../common/utils/OrderItem';
import {
    ChangeFlavorServiceDataWillBeLost,
    ChangeFlavorServiceWillBeRestarted,
    ChangeFlavorServiceWillBeRestartedAndDataWillBeLost,
} from '../common/utils/ScaleOrModifyWarnings';
import { getModifyParams } from '../formDataHelpers/modifyParamsHelper';
import { useOrderFormStore } from '../store/OrderFormStore';
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
    const [scaleWarning, setScaleWarning] = useState<string>('Are you sure to scale the service?');

    const [isShowModifyingResult, setIsShowModifyingResult] = useState<boolean>(false);
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    const serviceTemplateDetailsQuery = useGetServiceTemplateDetails(currentSelectedService.serviceTemplateId);
    const modifyServiceRequest = useMutation({
        mutationFn: (modifyServiceRequestParams: ModifySubmitRequest) => {
            return ServiceModificationService.modify(
                modifyServiceRequestParams.id,
                modifyServiceRequestParams.modifyRequest
            );
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

    const onClickScale = () => {
        if (
            serviceTemplateDetailsQuery.data?.flavors.modificationImpact.isDataLost &&
            serviceTemplateDetailsQuery.data.flavors.modificationImpact.isServiceInterrupted
        ) {
            setScaleWarning(ChangeFlavorServiceWillBeRestartedAndDataWillBeLost);
        } else if (
            serviceTemplateDetailsQuery.data?.flavors.modificationImpact.isDataLost &&
            !serviceTemplateDetailsQuery.data.flavors.modificationImpact.isServiceInterrupted
        ) {
            setScaleWarning(ChangeFlavorServiceDataWillBeLost);
        } else if (
            !serviceTemplateDetailsQuery.data?.flavors.modificationImpact.isDataLost &&
            serviceTemplateDetailsQuery.data?.flavors.modificationImpact.isServiceInterrupted
        ) {
            setScaleWarning(ChangeFlavorServiceWillBeRestarted);
        }
    };

    const confirm: PopconfirmProps['onConfirm'] = () => {
        onFinish();
    };

    const cancel: PopconfirmProps['onCancel'] = () => {
        setScaleWarning('');
    };

    return (
        <div className={serviceModifyStyles.modifySelectClass}>
            <div className={`${serviceModifyStyles.modifyTitleClass} ${appStyles.contentTitle}`}>Change Flavor:</div>
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
            <div className={serviceOrderStyles.orderParamItemLeft} />
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                initialValues={useOrderFormStore.getState().deployParams}
                onFinish={onFinish}
                className={serviceModifyStyles.modifyContainer}
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
                                <Col
                                    span={4}
                                    key={flavor.name}
                                    className={serviceModifyStyles.modifySelectFlavorBilling}
                                >
                                    <div
                                        className={`${serviceModifyStyles.flavorCardContainer} ${
                                            currentSelectedService.flavor === flavor.name
                                                ? serviceModifyStyles.flavorSelectHoverDisabled
                                                : selectFlavor === flavor.name
                                                  ? serviceModifyStyles.flavorSelectHover
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
                                            <div className={serviceModifyStyles.flavorOldBadge}>
                                                <Badge.Ribbon
                                                    text='current'
                                                    className={serviceModifyStyles.flavorCardCustomRibbon}
                                                    color={'#b5b5b5'}
                                                >
                                                    <Card title={flavor.name}>
                                                        <p className={serviceModifyStyles.flavorCardContent}>
                                                            {currentBilling ? (
                                                                <>
                                                                    <Tag color={'blue'}>
                                                                        {/* TODO Will be fixed after #1597 is fixed */}
                                                                        {(20).toString()}
                                                                        {
                                                                            currentSelectedService.deployRequest
                                                                                .billingMode
                                                                        }
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
                                                <p className={serviceModifyStyles.flavorCardContent}>
                                                    {currentBilling ? (
                                                        <>
                                                            <Tag color={'blue'}>
                                                                {/* TODO Will be fixed after #1597 is fixed */}
                                                                {(20).toString()}
                                                                {currentSelectedService.deployRequest.billingMode}
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
                <div className={serviceOrderStyles.orderParamItemLeft} />
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
                        className={serviceOrderStyles.orderParamItemContent}
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
                            ? `${serviceOrderStyles.deploying} ${serviceOrderStyles.orderParamItemRow}`
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
                <div className={serviceOrderStyles.orderParamItemLeft} />
                <div className={serviceModifyStyles.serviceModifySubmitResetContainer}>
                    <div className={serviceModifyStyles.serviceModifySubmitClass}>
                        <Popconfirm
                            placement='top'
                            title='Scale'
                            description={scaleWarning}
                            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={cancel}
                            onCancel={confirm}
                            okText='No'
                            cancelText='Yes'
                        >
                            <Button
                                type='primary'
                                disabled={
                                    currentSelectedService.flavor === selectFlavor ||
                                    (modifyStatus &&
                                        modifyStatus === DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL)
                                }
                                onClick={() => {
                                    onClickScale();
                                }}
                            >
                                Scale
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            </Form>
        </div>
    );
};
