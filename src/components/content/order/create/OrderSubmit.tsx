/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import Navigate from './Navigate';
import '../../../../styles/service_order.css';
import { To, useLocation } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
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
import { createServicePageRoute } from '../../../utils/constants';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ApiDoc } from '../../common/ApiDoc';
import OrderSubmitStatusPolling from './OrderSubmitStatusPolling';
import { useDeployRequestSubmitQuery } from './useDeployRequestSubmitQuery';

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

function OrderSubmit(props: OrderSubmitProps): JSX.Element {
    const [parameters, setParameters] = useState<DeployParam[]>(props.params);
    const [deploying, setDeploying] = useState<boolean>(false);
    const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);
    const [customerServiceName, setCustomerServiceName] = useState<string>('');
    const submitDeploymentRequest = useDeployRequestSubmitQuery();

    function GetOnChangeHandler(parameter: DeployParam): ParamOnChangeHandler {
        if (parameter.type === 'string') {
            return (event: ChangeEvent<HTMLInputElement>) => {
                setIsShowDeploymentResult(false);
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: event.target.value };
                        }
                        return item;
                    })
                );
            };
        }
        if (parameter.type === 'number') {
            return (value: string | number | null) => {
                setIsShowDeploymentResult(false);
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: value as string };
                        }
                        return item;
                    })
                );
            };
        }
        if (parameter.type === 'boolean') {
            return (checked: boolean) => {
                setIsShowDeploymentResult(false);
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: checked ? 'true' : 'false' };
                        }
                        return item;
                    })
                );
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
            customerServiceName: customerServiceName,
        };
        const serviceRequestProperties: Record<string, string> = {};
        for (const item of parameters) {
            if (item.kind === 'variable' || item.kind === 'env') {
                serviceRequestProperties[item.name] = item.value;
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
                layout='vertical'
                autoComplete='off'
                onFinish={onSubmit}
                validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                key='deploy'
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
                        onChange={(e) => setCustomerServiceName(e.target.value)}
                        className={'order-param-item-content'}
                        suffix={
                            <Tooltip title={'Customer defined name for the service instance created'}>
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                </Form.Item>
                <div className={deploying ? 'deploying order-param-item-row' : ''}>
                    {parameters.map((item) =>
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

export function OrderSubmitPage(): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    return OrderSubmit(useLocation().state.props);
}

export default OrderSubmitPage;
