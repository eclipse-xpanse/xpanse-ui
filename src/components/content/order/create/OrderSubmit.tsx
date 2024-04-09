/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import NavigateOrderSubmission from './NavigateOrderSubmission';
import '../../../../styles/service_order.css';
import { Navigate, To, useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { Button, Form, Input, Tooltip } from 'antd';
import { DeployedServiceDetails, DeployRequest } from '../../../../xpanse-api/generated';
import { createServicePageRoute, CUSTOMER_SERVICE_NAME_FIELD, homePageRoute } from '../../../utils/constants';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ApiDoc } from '../../common/doc/ApiDoc';
import OrderSubmitStatusAlert from '../orderStatus/OrderSubmitStatusAlert';
import { useDeployRequestSubmitQuery } from './useDeployRequestSubmitQuery';
import { useOrderFormStore } from '../store/OrderFormStore';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { v4 } from 'uuid';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import { OrderItem } from '../common/utils/OrderItem';

function OrderSubmit(state: OrderSubmitProps): React.JSX.Element {
    const [form] = Form.useForm();
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);
    const uniqueRequestId = useRef(v4());
    const submitDeploymentRequest = useDeployRequestSubmitQuery();
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(
        submitDeploymentRequest.data,
        submitDeploymentRequest.isSuccess,
        state.serviceHostingType,
        [
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED,
        ]
    );
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    // Avoid re-rendering of the component when variables are added to store.
    const deployParamsRef = useRef(useOrderFormStore.getState().deployParams);
    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (state === undefined || state === null) {
        navigate(homePageRoute);
    }

    function onSubmit() {
        setIsShowDeploymentResult(true);
        uniqueRequestId.current = v4();
        const createRequest: DeployRequest = {
            category: state.category,
            csp: state.csp,
            flavor: state.flavor,
            region: {
                name: state.region,
                area: state.area,
            },
            serviceName: state.name,
            version: state.version,
            customerServiceName: deployParamsRef.current.Name as string,
            serviceHostingType: state.serviceHostingType,
            availabilityZones: state.availabilityZones,
        };
        const serviceRequestProperties: Record<string, unknown> = {};
        for (const variable in deployParamsRef.current) {
            if (variable !== CUSTOMER_SERVICE_NAME_FIELD && deployParamsRef.current[variable] !== '') {
                serviceRequestProperties[variable] = deployParamsRef.current[variable];
            }
        }
        createRequest.serviceRequestProperties = serviceRequestProperties as Record<string, never>;
        submitDeploymentRequest.mutate(createRequest);
    }

    const createServicePageUrl: string = createServicePageRoute
        .concat('?catalog=', state.category)
        .concat('&serviceName=', state.name)
        .concat('&latestVersion=', state.version);

    return (
        <>
            <div>
                <NavigateOrderSubmission text={'<< Back'} to={createServicePageUrl as To} props={state} />
                <div className={'Line'} />
                <div className={'generic-table-container'}>
                    <div className={'content-title'}>
                        <div className={'content-title-order'}>
                            Service: {state.name}@{state.version}
                            <ApiDoc id={state.id} styleClass={'content-title-api'}></ApiDoc>
                        </div>
                    </div>
                </div>
            </div>
            {isShowDeploymentResult ? (
                <OrderSubmitStatusAlert
                    key={uniqueRequestId.current}
                    uuid={submitDeploymentRequest.data}
                    isSubmitFailed={submitDeploymentRequest.error}
                    deployedServiceDetails={getServiceDetailsByIdQuery.data}
                    isPollingError={getServiceDetailsByIdQuery.isError}
                    serviceProviderContactDetails={state.contactServiceDetails}
                />
            ) : null}
            <div className={'order-param-item-left'} />
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                initialValues={deployParamsRef.current}
                onFinish={onSubmit}
                validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                key='deploy'
                disabled={submitDeploymentRequest.isSuccess}
            >
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
                        getServiceDetailsByIdQuery.data?.serviceDeploymentState.toString() ===
                        DeployedServiceDetails.serviceDeploymentState.DEPLOYING.toString()
                            ? 'deploying order-param-item-row'
                            : ''
                    }
                >
                    {state.params.map((item) =>
                        item.kind === 'variable' || item.kind === 'env' ? (
                            <OrderItem key={item.name} item={item} csp={state.csp} region={state.region} />
                        ) : undefined
                    )}
                </div>
                <div className={'Line'} />
                <div className={'order-param-item-row'}>
                    <div className={'order-param-item-left'} />
                    <div className={'order-param-deploy'}>
                        <Button
                            type='primary'
                            loading={
                                submitDeploymentRequest.isPending ||
                                getServiceDetailsByIdQuery.data?.serviceDeploymentState.toString() ===
                                    DeployedServiceDetails.serviceDeploymentState.DEPLOYING.toString()
                            }
                            htmlType='submit'
                            disabled={
                                submitDeploymentRequest.isPending ||
                                getServiceDetailsByIdQuery.data?.serviceDeploymentState.toString() ===
                                    DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString()
                            }
                        >
                            Deploy
                        </Button>
                    </div>
                </div>
            </Form>
        </>
    );
}

function OrderSubmitPage(): React.JSX.Element {
    const location = useLocation();
    if (!location.state) {
        return <Navigate to={homePageRoute} />;
    }
    return OrderSubmit(location.state as OrderSubmitProps);
}

export default OrderSubmitPage;
