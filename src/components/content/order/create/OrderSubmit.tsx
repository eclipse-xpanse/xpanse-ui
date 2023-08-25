/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import Navigate from './Navigate';
import '../../../../styles/service_order.css';
import { To, useLocation } from 'react-router-dom';
import React, { ChangeEvent, useState } from 'react';
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
import { useOrderPropsStore } from '../../../store/OrderStore';
import { shallow } from 'zustand/shallow';

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
    const [form] = Form.useForm();
    const [parameters, setParameters] = useState<DeployParam[]>(props.params);
    const [deploying, setDeploying] = useState<boolean>(false);
    const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
    const [isShowDeploymentResult, setIsShowDeploymentResult] = useState<boolean>(false);
    const [customerServiceName, setCustomerServiceName] = useState<string>('');
    const submitDeploymentRequest = useDeployRequestSubmitQuery();
    const [oldCustomerServiceName, deployParams, deployProps] = useOrderPropsStore((state) => [
        state.oldCustomerServiceName,
        state.deployParams,
        state.deployProps,
    ]);
    const [setParams] = useOrderPropsStore((state) => [state.setParams], shallow);

    const getInitialValues = (): Record<string, string> | undefined => {
        if (deployProps === undefined) {
            return undefined;
        }
        const fieldsToUpdate: Record<string, string> = {};
        if (props.name === deployProps.name) {
            if (oldCustomerServiceName.length > 0) {
                fieldsToUpdate.Name = oldCustomerServiceName;
            }
            if (deployParams.length > 0) {
                for (const item of deployParams) {
                    fieldsToUpdate[item.name] = item.value;
                }
            }
        }
        return fieldsToUpdate;
    };

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
                setParams(customerServiceName, props, parameters);
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
                setParams(customerServiceName, props, parameters);
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
                setParams(customerServiceName, props, parameters);
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
        setParams(customerServiceName, props, parameters);
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
                initialValues={getInitialValues()}
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
                            setCustomerServiceName(e.target.value);
                            setParams(e.target.value, props, parameters);
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

function OrderSubmitPage(): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    return OrderSubmit(useLocation().state.props);
}

export default OrderSubmitPage;
