/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ExclamationCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Badge, Button, Flex, Form, Input, Popconfirm, PopconfirmProps, Radio, Spin, Tooltip } from 'antd';
import React, { useState } from 'react';
import appStyles from '../../../../styles/app.module.css';
import flavorStyles from '../../../../styles/flavor.module.css';
import serviceModifyStyles from '../../../../styles/service-modify.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import {
    csp,
    DeployedServiceDetails,
    modify,
    type ModifyData,
    ModifyRequest,
    orderStatus,
    serviceDeploymentState,
    ServiceFlavor,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import { useLatestServiceOrderStatusQuery } from '../../common/queries/useLatestServiceOrderStatusQuery.ts';
import useGetOrderableServiceDetails from '../../deployedServices/myServices/query/useGetOrderableServiceDetails.tsx';
import { FlavorFeatures } from '../common/FlavorFeatures';
import { FlavorPrice } from '../common/FlavorPrice.tsx';
import { FlavorTitle } from '../common/FlavorTitle';
import ScaleOrModifySubmitStatusAlert from '../common/ScaleOrModifySubmitStatusAlert';
import { ModifySubmitRequest } from '../common/modifySubmitRequest';
import useGetServicePricesQuery from '../common/useGetServicePricesQuery.ts';
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
    let isDowngradeAllowed: boolean = true;
    let getParams: DeployParam[] = [];
    const [modifyStatus, setModifyStatus] = useState<serviceDeploymentState | undefined>(undefined);
    const [selectFlavor, setSelectFlavor] = useState<string>(currentSelectedService.flavor);
    const [scaleWarning, setScaleWarning] = useState<string>('Are you sure to scale the service?');

    const [isShowModifyingResult, setIsShowModifyingResult] = useState<boolean>(false);
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    const orderableServiceDetailsQuery = useGetOrderableServiceDetails(currentSelectedService.serviceTemplateId);
    const modifyServiceRequest = useMutation({
        mutationFn: (modifyServiceRequestParams: ModifySubmitRequest) => {
            const data: ModifyData = {
                serviceId: modifyServiceRequestParams.serviceId,
                requestBody: modifyServiceRequestParams.modifyRequest,
            };
            return modify(data);
        },
    });
    const getScaleServiceOrderStatusQuery = useLatestServiceOrderStatusQuery(
        modifyServiceRequest.data?.orderId ?? '',
        modifyServiceRequest.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED]
    );

    if (orderableServiceDetailsQuery.isSuccess) {
        if (orderableServiceDetailsQuery.data.flavors.serviceFlavors.length > 0) {
            flavorList = [...orderableServiceDetailsQuery.data.flavors.serviceFlavors].sort(
                (a, b) => a.priority - b.priority
            );
            isDowngradeAllowed = orderableServiceDetailsQuery.data.flavors.isDowngradeAllowed;
        }
        getParams = getModifyParams(orderableServiceDetailsQuery.data.inputVariables);
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
            serviceId: currentSelectedService.serviceId,
            modifyRequest: createRequest,
        };

        modifyServiceRequest.mutate(modifyServiceRequestParams);
        setIsShowModifyingResult(true);
    };

    const getModifyDetailsStatus = (status: serviceDeploymentState | undefined) => {
        setModifyStatus(status);
    };

    const onClickScale = () => {
        if (
            orderableServiceDetailsQuery.data?.flavors.modificationImpact.isDataLost &&
            orderableServiceDetailsQuery.data.flavors.modificationImpact.isServiceInterrupted
        ) {
            setScaleWarning(ChangeFlavorServiceWillBeRestartedAndDataWillBeLost);
        } else if (
            orderableServiceDetailsQuery.data?.flavors.modificationImpact.isDataLost &&
            !orderableServiceDetailsQuery.data.flavors.modificationImpact.isServiceInterrupted
        ) {
            setScaleWarning(ChangeFlavorServiceDataWillBeLost);
        } else if (
            !orderableServiceDetailsQuery.data?.flavors.modificationImpact.isDataLost &&
            orderableServiceDetailsQuery.data?.flavors.modificationImpact.isServiceInterrupted
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

    const getServicePriceQuery = useGetServicePricesQuery(
        currentSelectedService.serviceTemplateId,
        currentSelectedService.region.name,
        currentSelectedService.region.site,
        currentSelectedService.billingMode,
        flavorList
    );

    const retryRequest = () => {
        if (currentSelectedService.serviceTemplateId && currentSelectedService.serviceTemplateId.length > 0) {
            void getServicePriceQuery.refetch();
        }
    };

    return (
        <div className={serviceModifyStyles.modifySelectClass}>
            <div className={`${serviceModifyStyles.modifyTitleClass} ${appStyles.contentTitle}`}>Change Flavor:</div>
            {isShowModifyingResult ? (
                <ScaleOrModifySubmitStatusAlert
                    modifyServiceRequest={modifyServiceRequest}
                    getScaleOrModifyServiceOrderStatusQuery={getScaleServiceOrderStatusQuery}
                    currentSelectedService={currentSelectedService}
                    serviceProviderContactDetails={
                        orderableServiceDetailsQuery.isSuccess
                            ? orderableServiceDetailsQuery.data.serviceProviderContactDetails
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
                <div className={`${serviceOrderStyles.orderFormSelectionStyle} ${flavorStyles.regionFlavorContent}`}>
                    <Form.Item
                        name='selectFlavor'
                        label='Flavor'
                        rules={[{ required: true, message: 'Flavor is required' }]}
                    >
                        {flavorList.length > 0 ? (
                            <Flex vertical gap='middle'>
                                <Radio.Group
                                    optionType={'button'}
                                    onChange={(e) => {
                                        if (currentSelectedService.flavor === (e.target.value as string)) {
                                            return;
                                        }
                                        setSelectFlavor(e.target.value as string);
                                        form.setFieldsValue({ selectFlavor: e.target.value as string });
                                    }}
                                    value={selectFlavor}
                                    className={flavorStyles.antRadioGroup}
                                >
                                    {flavorList.map((flavor: ServiceFlavor) => {
                                        const isCurrentFlavor = currentSelectedService.flavor === flavor.name;
                                        const currentFlavorPriority =
                                            flavorList.find((f) => f.name === currentSelectedService.flavor)
                                                ?.priority ?? 1;
                                        const isDisabled =
                                            isCurrentFlavor ||
                                            (isDowngradeAllowed ? false : flavor.priority > currentFlavorPriority);
                                        const radioButton = (
                                            <Radio.Button
                                                key={flavor.name}
                                                value={flavor.name}
                                                disabled={isDisabled}
                                                className={`${flavorStyles.customRadioButtonContent} ${flavorStyles.antRadioButtonWrapperDisabled}`}
                                            >
                                                <FlavorTitle title={flavor.name} />
                                                {getServicePriceQuery.isLoading ? (
                                                    <div className={flavorStyles.flavorSkeleton}>
                                                        <Spin
                                                            indicator={
                                                                <LoadingOutlined
                                                                    className={flavorStyles.flavorPriceLoading}
                                                                    spin
                                                                />
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    <FlavorPrice
                                                        flavor={flavor}
                                                        isSuccess={getServicePriceQuery.isSuccess}
                                                        priceData={getServicePriceQuery.data}
                                                        isError={getServicePriceQuery.isError}
                                                        error={getServicePriceQuery.error}
                                                        retryRequest={retryRequest}
                                                    />
                                                )}
                                                <FlavorFeatures flavor={flavor} />
                                            </Radio.Button>
                                        );
                                        return (
                                            <div key={flavor.name} className={flavorStyles.customRadioButton}>
                                                {isCurrentFlavor ? (
                                                    <div className={flavorStyles.ribbonContainer}>
                                                        <Badge.Ribbon
                                                            text='current'
                                                            className={serviceModifyStyles.flavorCardCustomRibbon}
                                                            color={'#b5b5b5'}
                                                        >
                                                            {radioButton}
                                                        </Badge.Ribbon>
                                                    </div>
                                                ) : (
                                                    <div className={flavorStyles.ribbonContainer}>{radioButton}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </Radio.Group>
                            </Flex>
                        ) : null}
                    </Form.Item>
                </div>
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
                        serviceDeploymentState.MODIFYING.toString()
                            ? `${serviceOrderStyles.deploying} ${serviceOrderStyles.orderParamItemRow}`
                            : ''
                    }
                >
                    {getParams.map((item) =>
                        item.kind === 'variable' || item.kind === 'env' ? (
                            <OrderItem
                                key={item.name}
                                item={item}
                                csp={currentSelectedService.csp as csp}
                                region={currentSelectedService.region}
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
                                    (modifyStatus && modifyStatus === serviceDeploymentState.MODIFICATION_SUCCESSFUL)
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
