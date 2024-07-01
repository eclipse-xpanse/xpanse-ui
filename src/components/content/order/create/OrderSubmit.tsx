/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { Navigate, To, useLocation, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import appStyles from '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import tableStyles from '../../../../styles/table.module.css';
import { DeployRequest, serviceDeploymentState } from '../../../../xpanse-api/generated';
import { CUSTOMER_SERVICE_NAME_FIELD, createServicePageRoute, homePageRoute } from '../../../utils/constants';
import { ApiDoc } from '../../common/doc/ApiDoc';
import { EulaInfo } from '../common/EulaInfo';
import { OrderItem } from '../common/utils/OrderItem';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import OrderSubmitStatusAlert from '../orderStatus/OrderSubmitStatusAlert';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { useOrderFormStore } from '../store/OrderFormStore';
import NavigateOrderSubmission from './NavigateOrderSubmission';
import { useDeployRequestSubmitQuery } from './useDeployRequestSubmitQuery';

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
        [serviceDeploymentState.DEPLOYMENT_SUCCESSFUL, serviceDeploymentState.DEPLOYMENT_FAILED]
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
            billingMode: state.billingMode,
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
        .concat('&latestVersion=', state.version)
        .concat('&billingMode=', state.billingMode);

    return (
        <>
            <div>
                <div className={tableStyles.genericTableContainer}>
                    <Row justify='space-between'>
                        <Col span={6}>
                            <Tooltip placement='topLeft' title={state.name + '@' + state.version}>
                                <Paragraph ellipsis={true} className={appStyles.contentTitle}>
                                    Service: {state.name + '@' + state.version}
                                </Paragraph>
                            </Tooltip>
                        </Col>
                        <Col span={4}>
                            <ApiDoc id={state.id} styleClass={serviceOrderStyles.contentTitleApi}></ApiDoc>
                        </Col>
                    </Row>

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
                        <div className={serviceOrderStyles.orderFormGroupItems}>
                            <div className={serviceOrderStyles.orderParamItemLeft} />
                            <Form.Item
                                name={'Name'}
                                label={'Name: Service Name'}
                                rules={[{ required: true }, { type: 'string', min: 5 }]}
                                colon={true}
                                className={serviceOrderStyles.orderParamsFirstParam}
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
                                    getServiceDetailsByIdQuery.data?.serviceDeploymentState.toString() ===
                                    serviceDeploymentState.DEPLOYING.toString()
                                        ? `${serviceOrderStyles.deploying} ${serviceOrderStyles.orderParamItemRow}`
                                        : ''
                                }
                            >
                                {state.params.map((item) =>
                                    item.kind === 'variable' || item.kind === 'env' ? (
                                        <OrderItem key={item.name} item={item} csp={state.csp} region={state.region} />
                                    ) : undefined
                                )}
                            </div>
                        </div>
                        <div className={serviceOrderStyles.orderParamsFirstParam} />
                        <div className={serviceOrderStyles.orderParamItemRow}>
                            <div className={serviceOrderStyles.orderParamItemLeft} />
                            <div className={serviceOrderStyles.orderParamItemContent}>
                                <EulaInfo
                                    eula={state.eula}
                                    isEulaAccepted={isEulaAccepted}
                                    setIsEulaAccepted={setIsEulaAccepted}
                                />
                            </div>
                        </div>
                        <Row justify='space-around'>
                            <Col span={6}>
                                <div>
                                    <NavigateOrderSubmission
                                        text={'Back'}
                                        to={createServicePageUrl as To}
                                        props={state}
                                    />
                                </div>
                            </Col>
                            <Col span={4}>
                                <div className={serviceOrderStyles.orderParamDeploy}>
                                    <Button
                                        type='primary'
                                        loading={
                                            submitDeploymentRequest.isPending ||
                                            getServiceDetailsByIdQuery.data?.serviceDeploymentState.toString() ===
                                                serviceDeploymentState.DEPLOYING.toString()
                                        }
                                        htmlType='submit'
                                        disabled={
                                            submitDeploymentRequest.isPending ||
                                            getServiceDetailsByIdQuery.data?.serviceDeploymentState.toString() ===
                                                serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString()
                                        }
                                    >
                                        Deploy
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
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
