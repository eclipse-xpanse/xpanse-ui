/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import Navigate from './Navigate';
import '../../../../styles/service_order.css';
import { To, useLocation } from 'react-router-dom';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
    DeployParam,
    NumberInputEventHandler,
    ParamOnChangeHandler,
    SwitchOnChangeHandler,
    TextInputEventHandler,
} from '../formElements/CommonTypes';
import { TextInput } from '../formElements/TextInput';
import { NumberInput } from '../formElements/NumberInput';
import { Switch } from '../formElements/Switch';
import { Button, Form, Input, Tooltip } from 'antd';
import { CreateRequest } from '../../../../xpanse-api/generated';
import { createServicePageRoute, CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ApiDoc } from '../../common/doc/ApiDoc';
import OrderSubmitStatusPolling from './OrderSubmitStatusPolling';
import { useDeployRequestSubmitQuery } from './useDeployRequestSubmitQuery';
import { useOrderFormStore } from '../store/OrderFormStore';

export function OrderItem({ item, onChangeHandler }: { item: DeployParam; onChangeHandler: ParamOnChangeHandler }) {
    if (item.type === 'string') {
        return <TextInput item={item} onChangeHandler={onChangeHandler as TextInputEventHandler} />;
    }
    if (item.type === 'number') {
        return <NumberInput item={item} onChangeHandler={onChangeHandler as NumberInputEventHandler} />;
    }
    if (item.type === 'boolean') {
        return <Switch item={item} onChangeHandler={onChangeHandler as SwitchOnChangeHandler} />;
    }

    return <></>;
}

export interface OrderSubmitProps {
    id: string;
    category: CreateRequest.category;
    name: string;
    version: string;
    region: string;
    area: string;
    csp: CreateRequest.csp;
    flavor: string;
    params: DeployParam[];
}

function OrderSubmit(props: OrderSubmitProps): React.JSX.Element {
    console.log('rendering');
    const [form] = Form.useForm();
    const [deploying, setDeploying] = useState<boolean>(false);
    const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);
    const submitDeploymentRequest = useDeployRequestSubmitQuery();
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    // Avoid re-rendering of the component when variables are added to store.
    const deployParamsRef = useRef(useOrderFormStore.getState().deployParams);
    useEffect(() => useOrderFormStore.subscribe((state) => (deployParamsRef.current = state.deployParams)), []);

    function GetOnChangeHandler(parameter: DeployParam): ParamOnChangeHandler {
        if (parameter.type === 'string') {
            return (event: ChangeEvent<HTMLInputElement>) => {
                setIsShowDeploymentResult(false);
                cacheFormVariable(event.target.name, event.target.value);
            };
        }
        if (parameter.type === 'number') {
            return (value: string | number | null) => {
                setIsShowDeploymentResult(false);
                cacheFormVariable(parameter.name, value as string);
            };
        }
        if (parameter.type === 'boolean') {
            return (checked: boolean) => {
                setIsShowDeploymentResult(false);
                cacheFormVariable(parameter.name, checked ? 'true' : 'false');
            };
        }
        return (value: unknown) => {
            console.log(value);
        };
    }

    function onSubmit() {
        setRequestSubmitted(true);
        setDeploying(true);
        const createRequest: CreateRequest = {
            category: props.category,
            csp: props.csp,
            flavor: props.flavor,
            region: props.region,
            serviceName: props.name,
            version: props.version,
            customerServiceName: deployParamsRef.current.Name,
        };
        const serviceRequestProperties: Record<string, string> = {};
        for (const variable in deployParamsRef.current) {
            if (variable !== CUSTOMER_SERVICE_NAME_FIELD) {
                serviceRequestProperties[variable] = deployParamsRef.current[variable];
            }
        }
        createRequest.serviceRequestProperties = serviceRequestProperties;
        submitDeploymentRequest.mutate(createRequest);
        setIsShowDeploymentResult(true);
    }

    const createServicePageUrl: string = createServicePageRoute
        .concat('?catalog=', props.category)
        .concat('&serviceName=', props.name)
        .concat('&latestVersion=', props.version);

    return (
        <>
            <div>
                <Navigate text={'<< Back'} to={createServicePageUrl as To} props={props} />
                <div className={'Line'} />
                <div className={'services-content'}>
                    <div className={'content-title'}>
                        <div className={'content-title-order'}>
                            Service: {props.name}@{props.version}
                            <ApiDoc id={props.id} styleClass={'content-title-api'}></ApiDoc>
                        </div>
                    </div>
                </div>
            </div>
            {isShowDeploymentResult ? (
                <OrderSubmitStatusPolling
                    uuid={submitDeploymentRequest.data}
                    error={submitDeploymentRequest.error as Error}
                    isLoading={submitDeploymentRequest.isLoading}
                    setIsDeploying={setDeploying}
                    setRequestSubmitted={setRequestSubmitted}
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
                    {props.params.map((item) =>
                        item.kind === 'variable' || item.kind === 'env' ? (
                            <OrderItem key={item.name} item={item} onChangeHandler={GetOnChangeHandler(item)} />
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    return OrderSubmit(useLocation().state.props);
}

export default OrderSubmitPage;
