/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import NavigateOrderSubmission from './NavigateOrderSubmission';
import '../../../../styles/service_order.css';
import { Navigate, To, useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Tooltip, Typography } from 'antd';
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
import { EulaInfo } from '../common/EulaInfo';

function OrderSubmit(state: OrderSubmitProps): React.JSX.Element {
    const { Paragraph } = Typography;
    const [form] = Form.useForm();
    const [isEulaAccepted, setIsEulaAccepted] = useState<boolean>(false);
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
            customerServiceName: useOrderFormStore.getState().deployParams.Name as string,
            serviceHostingType: state.serviceHostingType,
            availabilityZones: state.availabilityZones,
            eulaAccepted: isEulaAccepted,
        };
        const serviceRequestProperties: Record<string, unknown> = {};
        for (const variable in useOrderFormStore.getState().deployParams) {
            if (
                variable !== CUSTOMER_SERVICE_NAME_FIELD &&
                useOrderFormStore.getState().deployParams[variable] !== ''
            ) {
                serviceRequestProperties[variable] = useOrderFormStore.getState().deployParams[variable];
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
                    <Row>
                        <Col span={4}>
                            <Tooltip placement='topLeft' title={state.name + '@' + state.version}>
                                <Paragraph ellipsis={true} className={'content-title'}>
                                    Service: {state.name + '@' + state.version}
                                </Paragraph>
                            </Tooltip>
                        </Col>
                        <Col span={4}>
                            <ApiDoc id={state.id} styleClass={'content-title-api'}></ApiDoc>
                        </Col>
                    </Row>
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
                initialValues={useOrderFormStore.getState().deployParams}
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
                <div className={'order-param-item-row'}>
                    <div className={'order-param-item-left'} />
                    <div className={'order-param-item-content'}>
                        <EulaInfo
                            eula={state.eula}
                            isEulaAccepted={isEulaAccepted}
                            setIsEulaAccepted={setIsEulaAccepted}
                        />
                    </div>
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
