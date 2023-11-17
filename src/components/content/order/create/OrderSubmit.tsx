/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import NavigateOrderSubmission from './NavigateOrderSubmission';
import '../../../../styles/service_order.css';
import { Navigate, To, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from '../formElements/TextInput';
import { NumberInput } from '../formElements/NumberInput';
import { BooleanInput } from '../formElements/BooleanInput';
import { Button, Form, Input, Tooltip } from 'antd';
import { DeployRequest } from '../../../../xpanse-api/generated';
import { createServicePageRoute, CUSTOMER_SERVICE_NAME_FIELD, homePageRoute } from '../../../utils/constants';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ApiDoc } from '../../common/doc/ApiDoc';
import OrderSubmitStatusPolling from './OrderSubmitStatusPolling';
import { useDeployRequestSubmitQuery } from './useDeployRequestSubmitQuery';
import { useOrderFormStore } from '../store/OrderFormStore';
import { DeployParam } from '../types/DeployParam';

export function OrderItem({ item }: { item: DeployParam }) {
    if (item.type === 'string') {
        return <TextInput item={item} />;
    }
    if (item.type === 'number') {
        return <NumberInput item={item} />;
    }
    if (item.type === 'boolean') {
        return <BooleanInput item={item} />;
    }

    return <></>;
}

export interface OrderSubmitProps {
    id: string;
    category: DeployRequest.category;
    name: string;
    version: string;
    region: string;
    area: string;
    csp: DeployRequest.csp;
    flavor: string;
    params: DeployParam[];
    serviceHostingType: DeployRequest.serviceHostingType;
}

function OrderSubmit(state: OrderSubmitProps): React.JSX.Element {
    const [form] = Form.useForm();
    const [deploying, setDeploying] = useState<boolean>(false);
    const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);
    const submitDeploymentRequest = useDeployRequestSubmitQuery();
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    // Avoid re-rendering of the component when variables are added to store.
    const deployParamsRef = useRef(useOrderFormStore.getState().deployParams);
    const navigate = useNavigate();
    useEffect(() => useOrderFormStore.subscribe((state) => (deployParamsRef.current = state.deployParams)), []);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (state === undefined || state === null) {
        navigate(homePageRoute);
    }

    function onSubmit() {
        setRequestSubmitted(true);
        setDeploying(true);
        setIsShowDeploymentResult(true);
        const createRequest: DeployRequest = {
            category: state.category,
            csp: state.csp,
            flavor: state.flavor,
            region: state.region,
            serviceName: state.name,
            version: state.version,
            customerServiceName: deployParamsRef.current.Name as string,
            serviceHostingType: state.serviceHostingType,
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
                <div className={'services-content'}>
                    <div className={'content-title'}>
                        <div className={'content-title-order'}>
                            Service: {state.name}@{state.version}
                            <ApiDoc id={state.id} styleClass={'content-title-api'}></ApiDoc>
                        </div>
                    </div>
                </div>
            </div>
            {isShowDeploymentResult ? (
                <OrderSubmitStatusPolling
                    uuid={submitDeploymentRequest.data}
                    error={submitDeploymentRequest.error}
                    isSuccess={submitDeploymentRequest.isSuccess}
                    isLoading={submitDeploymentRequest.isPending}
                    setIsDeploying={setDeploying}
                    setRequestSubmitted={setRequestSubmitted}
                    serviceHostingType={state.serviceHostingType}
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
                disabled={requestSubmitted}
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
                <div className={deploying ? 'deploying order-param-item-row' : ''}>
                    {state.params.map((item) =>
                        item.kind === 'variable' || item.kind === 'env' ? (
                            <OrderItem key={item.name} item={item} />
                        ) : (
                            <></>
                        )
                    )}
                </div>
                <div className={'Line'} />
                <div className={'order-param-item-row'}>
                    <div className={'order-param-item-left'} />
                    <div className={'order-param-deploy'}>
                        <Button type='primary' loading={deploying} htmlType='submit' disabled={requestSubmitted}>
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
